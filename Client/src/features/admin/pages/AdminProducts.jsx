import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Loading from "../../../components/common/Loading";
import Error from "../../../components/common/Error";
import useAuth from "../../../store/authStore";
import { useGetProducts } from "../../products/apis/useProducts";
import {
  useAddAdminProduct,
  useDeleteAdminProduct,
  useUpdateAdminProduct,
} from "../apis/useAdminProducts";

const categories = ["Living Room", "Bedroom", "Office", "Hallway", "Kitchen"];

const initialForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: categories[0],
  rating: "0",
  width: "",
  depth: "",
  height: "",
  material: "",
  color: "",
  images: null,
  model: null,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const AdminProducts = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [form, setForm] = useState(initialForm);

  const filters = {
    search,
    page,
    limit: 8,
    sort: "newest",
  };

  const { data, isLoading, error } = useGetProducts(filters);
  const addProduct = useAddAdminProduct();
  const updateProduct = useUpdateAdminProduct();
  const deleteProduct = useDeleteAdminProduct();

  const isSaving = addProduct.isPending || updateProduct.isPending;

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setForm(initialForm);
    setSelectedProduct(null);
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: files || value,
    }));
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stockQuantity: product.stockQuantity ?? "",
      category: product.category || categories[0],
      rating: product.rating || "0",
      width: product.specs?.width || "",
      depth: product.specs?.depth || "",
      height: product.specs?.height || "",
      material: product.specs?.material?.join(", ") || "",
      color: product.specs?.color?.join(", ") || "",
      images: null,
      model: null,
    });
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (confirmed) {
      deleteProduct.mutate(product._id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProduct) {
      updateProduct.mutate(
        { id: selectedProduct._id, product: form },
        { onSuccess: resetForm },
      );
      return;
    }

    addProduct.mutate(form, { onSuccess: resetForm });
  };

  if (isLoading) return <Loading text="Loading products..." />;
  if (error) return <Error error={error} />;

  const products = data?.docs || [];
  const totalProducts = data?.totalDocs || 0;

  return (
    <>
      <title>Admin Products | Roomify</title>
      <meta
        name="description"
        content="Manage Roomify catalogue products."
      />

      <div className="max-w-7xl mx-auto px-3 md:px-5 lg:px-8 py-10 ">
        <div className="mb-8 flex flex-col gap-2">
          <p className="font-sans text-sm font-semibold text-brand-cedar">
            Admin
          </p>
          <h1 className="font-serif text-4xl text-brand-charcoal">
            Products
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
          <section className="bg-white rounded-xl shadow-ambient overflow-hidden">
            <div className="p-5 border-b border-brand-surface-container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-brand-charcoal">
                  Catalogue
                </h2>
                <p className="text-sm text-brand-text">
                  {totalProducts} products
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-surface-dim" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products"
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-cream border border-brand-surface-container rounded-base shadow-inset-soft outline-none focus:border-brand-cedar focus:ring-1 focus:ring-brand-cedar transition-all text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left">
                <thead className="bg-brand-surface-container text-brand-text text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Price</th>
                    <th className="px-5 py-3 font-semibold">Stock</th>
                    <th className="px-5 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-surface-container">
                  {products.map((product) => (
                    <tr key={product._id} className="align-middle">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-base bg-brand-cream overflow-hidden flex items-center justify-center shrink-0">
                            {product.imageUrls?.[0] ? (
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-brand-cedar" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-charcoal">
                              {product.name}
                            </p>
                            <p className="text-xs text-brand-surface-dim line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-brand-text">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-brand-cedar">
                        {currencyFormatter.format(product.price || 0)}
                      </td>
                      <td className="px-5 py-4 text-sm text-brand-text">
                        {product.stockQuantity}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-base border border-brand-surface-container text-sm font-semibold text-brand-cedar hover:bg-brand-cream transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={deleteProduct.isPending}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-base border border-brand-error-container text-sm font-semibold text-brand-error hover:bg-brand-error-container transition-colors disabled:opacity-60"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="py-16 text-center text-brand-text">
                No products found.
              </div>
            )}

            {data?.totalPages > 1 && (
              <div className="p-5 border-t border-brand-surface-container flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  disabled={!data?.hasPrevPage}
                  className="px-4 py-2 rounded-base border border-brand-surface-container text-sm font-semibold text-brand-cedar disabled:opacity-40"
                >
                  Previous
                </button>
                <p className="text-sm text-brand-text">
                  Page {data.page} of {data.totalPages}
                </p>
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={!data?.hasNextPage}
                  className="px-4 py-2 rounded-base border border-brand-surface-container text-sm font-semibold text-brand-cedar disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-ambient p-5">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="font-serif text-2xl text-brand-charcoal">
                  {selectedProduct ? "Edit Product" : "Add Product"}
                </h2>
                {selectedProduct && (
                  <p className="text-sm text-brand-text">
                    {selectedProduct.name}
                  </p>
                )}
              </div>
              {selectedProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-2 rounded-base text-brand-cedar hover:bg-brand-cream transition-colors"
                  aria-label="Cancel edit"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form
              key={fileInputKey}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                  Price
                  <input
                    name="price"
                    type="number"
                    min="20"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                  Stock
                  <input
                    name="stockQuantity"
                    type="number"
                    min="0"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Rating
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                  className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                  Width
                  <input
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    className="h-11 px-3 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                  Depth
                  <input
                    name="depth"
                    value={form.depth}
                    onChange={handleChange}
                    className="h-11 px-3 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                  Height
                  <input
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="h-11 px-3 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Materials
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="Oak, Linen"
                  className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Colors
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="#825032, Beige"
                  className="h-11 px-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal focus:ring-1 focus:ring-brand-cedar"
                />
              </label>

              {!selectedProduct && (
                <>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                    Images
                    <input
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      required
                      className="block w-full text-sm text-brand-text file:mr-4 file:rounded-base file:border-0 file:bg-brand-cedar file:px-4 file:py-2 file:text-white file:font-semibold"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                    3D Model
                    <input
                      name="model"
                      type="file"
                      accept=".glb,.gltf,.usdz"
                      onChange={handleChange}
                      className="block w-full text-sm text-brand-text file:mr-4 file:rounded-base file:border-0 file:bg-brand-sage file:px-4 file:py-2 file:text-white file:font-semibold"
                    />
                  </label>
                </>
              )}

              <label className="flex flex-col gap-2 text-sm font-semibold text-brand-cedar">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="p-4 bg-brand-cream rounded-base shadow-inset-soft outline-none font-normal text-brand-charcoal resize-none focus:ring-1 focus:ring-brand-cedar"
                />
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 bg-brand-cedar text-white font-sans font-semibold cursor-pointer rounded-large py-3 px-6 shadow-ambient hover:-translate-y-1 hover:shadow-ambient-hover transition-all duration-300 active:opacity-80 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {selectedProduct ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSaving
                  ? "Saving..."
                  : selectedProduct
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
