// Storefront API (public, read-only token — safe in the browser). Admin credentials are never used here.
const SHOPIFY_API_VERSION = "2026-10";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "pixel-perfect-replica-nmagm-a0htv4t1.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "22075781440d3de2a3fbef7f8bccc4fd";

export type CollectionKey = "girls" | "boys";
// Shopify collection handles, with tag fallback if the collection doesn't exist yet.
export const COLLECTIONS: Record<CollectionKey, { handle: string; tag: string }> = {
  boys: { handle: "hostel-harami", tag: "boys" },
  girls: { handle: "soft-chaos-club", tag: "girls" },
};

export interface Variant {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  image: string | null;
  images: string[];
  availableForSale: boolean;
  variants: Variant[];
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 402) throw new Error("Shopify store needs an active plan to serve products.");
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const data = await res.json();
  if (data.errors) throw new Error(data.errors.map((e: { message: string }) => e.message).join(", "));
  return data;
}

const PRODUCT_FIELDS = `
  id title description handle availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) { edges { node { id title availableForSale price { amount currencyCode } selectedOptions { name value } } } }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(n: any): Product {
  const images = n.images.edges.map((e: { node: { url: string } }) => e.node.url);
  return {
    id: n.id,
    handle: n.handle,
    title: n.title,
    description: n.description,
    price: parseFloat(n.priceRange.minVariantPrice.amount),
    currencyCode: n.priceRange.minVariantPrice.currencyCode,
    image: images[0] ?? null,
    images,
    availableForSale: n.availableForSale,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: n.variants.edges.map(({ node: v }: any) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price.amount),
      currencyCode: v.price.currencyCode,
      availableForSale: v.availableForSale,
      selectedOptions: v.selectedOptions,
    })),
  };
}

export async function fetchProducts(collection?: CollectionKey): Promise<Product[]> {
  if (collection) {
    const c = COLLECTIONS[collection];
    const d = await storefrontApiRequest(
      `query($h: String!) { collection(handle: $h) { products(first: 100) { edges { node { ${PRODUCT_FIELDS} } } } } }`,
      { h: c.handle },
    );
    const col = d.data.collection;
    if (col) return col.products.edges.map((e: { node: unknown }) => mapProduct(e.node));
    const t = await storefrontApiRequest(
      `query($q: String!) { products(first: 100, query: $q) { edges { node { ${PRODUCT_FIELDS} } } } }`,
      { q: `tag:${c.tag}` },
    );
    return t.data.products.edges.map((e: { node: unknown }) => mapProduct(e.node));
  }
  const d = await storefrontApiRequest(
    `query { products(first: 100, sortKey: CREATED_AT, reverse: true) { edges { node { ${PRODUCT_FIELDS} } } } }`,
  );
  return d.data.products.edges.map((e: { node: unknown }) => mapProduct(e.node));
}

export async function fetchProduct(handle: string): Promise<Product | null> {
  const d = await storefrontApiRequest(`query($h: String!) { product(handle: $h) { ${PRODUCT_FIELDS} } }`, { h: handle });
  return d.data.product ? mapProduct(d.data.product) : null;
}

export const formatPrice = (amount: number, currency = "INR") =>
  currency === "INR" ? `₹${Math.round(amount)}` : new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);

// ---- Cart (Storefront API) ----
const LINES = `lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }`;

function withChannel(url: string) {
  try { const u = new URL(url); u.searchParams.set("channel", "online_store"); return u.toString(); } catch { return url; }
}
const notFound = (errs: { message: string }[]) =>
  errs.some((e) => /cart not found|does not exist/i.test(e.message));

export async function createShopifyCart(variantId: string, quantity: number) {
  const d = await storefrontApiRequest(
    `mutation($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl ${LINES} } userErrors { field message } } }`,
    { input: { lines: [{ quantity, merchandiseId: variantId }] } },
  );
  const cart = d.data.cartCreate.cart;
  if (d.data.cartCreate.userErrors.length || !cart) return null;
  return { cartId: cart.id as string, checkoutUrl: withChannel(cart.checkoutUrl), lineId: cart.lines.edges[0]?.node.id as string };
}

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number) {
  const d = await storefrontApiRequest(
    `mutation($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id ${LINES} } userErrors { field message } } }`,
    { cartId, lines: [{ quantity, merchandiseId: variantId }] },
  );
  const errs = d.data.cartLinesAdd.userErrors;
  if (notFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) return { success: false };
  const line = d.data.cartLinesAdd.cart.lines.edges.find((l: { node: { merchandise: { id: string } } }) => l.node.merchandise.id === variantId);
  return { success: true, lineId: line?.node.id as string | undefined };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const d = await storefrontApiRequest(
    `mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } } }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  const errs = d.data.cartLinesUpdate.userErrors;
  if (notFound(errs)) return { success: false, cartNotFound: true };
  return { success: errs.length === 0 };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const d = await storefrontApiRequest(
    `mutation($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } } }`,
    { cartId, lineIds: [lineId] },
  );
  const errs = d.data.cartLinesRemove.userErrors;
  if (notFound(errs)) return { success: false, cartNotFound: true };
  return { success: errs.length === 0 };
}

export async function fetchCartQuantity(cartId: string): Promise<number | null> {
  const d = await storefrontApiRequest(`query($id: ID!) { cart(id: $id) { id totalQuantity } }`, { id: cartId });
  return d.data.cart ? d.data.cart.totalQuantity : null;
}
