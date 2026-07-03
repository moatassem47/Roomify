import api from "../../../utils/axios";

const toList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildSpecs = (product) => ({
  width: product.width,
  depth: product.depth,
  height: product.height,
  material: toList(product.material),
  color: toList(product.color),
});

const buildProductPayload = (product) => ({
  name: product.name,
  description: product.description,
  price: Number(product.price),
  stockQuantity: Number(product.stockQuantity),
  category: product.category,
  rating: Number(product.rating || 0),
  specs: buildSpecs(product),
});

export const addAdminProduct = async (product) => {
  const formData = new FormData();
  const payload = buildProductPayload(product);

  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, key === "specs" ? JSON.stringify(value) : value);
  });

  Array.from(product.images || []).forEach((image) => {
    formData.append("images", image);
  });

  if (product.model?.[0]) {
    formData.append("model", product.model[0]);
  }

  try {
    const res = await api.post("/admin/product/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const updateAdminProduct = async ({ id, product }) => {
  try {
    const res = await api.patch(
      `/admin/product/update/${id}`,
      buildProductPayload(product),
    );
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};

export const deleteAdminProduct = async (id) => {
  try {
    const res = await api.delete(`/admin/product/delete/${id}`);
    return res.data;
  } catch (e) {
    throw e.response?.data || e.message;
  }
};
