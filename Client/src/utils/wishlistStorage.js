
const getKey = (userId) => `wishlist_${userId}`;

export const getWishlistItems = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(getKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveWishlistItems = (userId, items) => {
  if (!userId) return;
  localStorage.setItem(getKey(userId), JSON.stringify(items));
};

/**
 * Toggle a product in the wishlist.
 * Returns { items, added } where added=true means the item was added.
 */
export const toggleWishlistItem = (userId, product) => {
  const items = getWishlistItems(userId);
  const idx = items.findIndex((i) => i._id === product._id);
  let added;
  if (idx > -1) {
    items.splice(idx, 1);
    added = false;
  } else {
    items.push(product);
    added = true;
  }
  saveWishlistItems(userId, items);
  return { items, added };
};
