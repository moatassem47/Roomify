

const getKey = (userId) => `cart_${userId}`;

export const getCartItems = (userId) => {
  if (!userId) return [];
  try {
    const raw = sessionStorage.getItem(getKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (userId, items) => {
  if (!userId) return;
  sessionStorage.setItem(getKey(userId), JSON.stringify(items));
};

export const clearCart = (userId) => {
  if (!userId) return;
  sessionStorage.removeItem(getKey(userId));
};

export const addItem = (userId, product, quantity = 1) => {
  const items = getCartItems(userId);
  const existing = items.findIndex((i) => i.productId._id === product._id);
  if (existing > -1) {
    items[existing].quantity += quantity;
  } else {
    items.push({
      productId: {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls,
      },
      quantity,
    });
  }
  saveCartItems(userId, items);
  return items;
};

export const removeItem = (userId, productId) => {
  const items = getCartItems(userId).filter(
    (i) => i.productId._id !== productId
  );
  saveCartItems(userId, items);
  return items;
};

export const updateItemQuantity = (userId, productId, action) => {
  const items = getCartItems(userId);
  const idx = items.findIndex((i) => i.productId._id === productId);
  if (idx === -1) return items;

  if (action === "increment") {
    items[idx].quantity += 1;
  } else if (action === "decrement") {
    if (items[idx].quantity > 1) {
      items[idx].quantity -= 1;
    }
  }
  saveCartItems(userId, items);
  return items;
};

export const computeTotals = (items) => {
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + i.quantity * (i.productId.price || 0),
    0
  );
  return { totalQuantity, totalPrice };
};
