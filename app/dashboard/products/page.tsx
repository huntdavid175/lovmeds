"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Variant = {
  name: string;
  price: number;
  salePrice?: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  normalPrice: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  variants: Variant[];
  imageUrl?: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Sample Product",
    description: "This is a sample product description",
    normalPrice: 29.99,
    salePrice: 24.99,
    costPrice: 15.00,
    stock: 50,
    variants: [
      { name: "Small", price: 24.99 },
      { name: "Large", price: 34.99 },
    ],
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    normalPrice: "",
    salePrice: "",
    costPrice: "",
    stock: "",
    variants: [] as Variant[],
  });

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        normalPrice: product.normalPrice.toString(),
        salePrice: product.salePrice?.toString() || "",
        costPrice: product.costPrice.toString(),
        stock: product.stock.toString(),
        variants: product.variants,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        normalPrice: "",
        salePrice: "",
        costPrice: "",
        stock: "",
        variants: [],
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      normalPrice: "",
      salePrice: "",
      costPrice: "",
      stock: "",
      variants: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      normalPrice: parseFloat(formData.normalPrice),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      costPrice: parseFloat(formData.costPrice),
      stock: parseInt(formData.stock) || 0,
      variants: formData.variants,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }

    handleCloseForm();
  };

  const calculateProfit = (product: Product) => {
    const sellingPrice = product.salePrice || product.normalPrice;
    return sellingPrice - product.costPrice;
  };

  const calculateProfitMargin = (product: Product) => {
    const sellingPrice = product.salePrice || product.normalPrice;
    if (sellingPrice === 0) return 0;
    return ((sellingPrice - product.costPrice) / sellingPrice) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", price: 0 }],
    });
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl text-black mb-2 ls-title">
            Products
          </h1>
          <p className="text-black/60">Manage your product catalog</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="h-12 px-6 rounded-xl bg-[#A33D4A] text-white font-medium transition-colors hover:bg-[#8E3540] cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
          >
            <h3 className="font-heading text-xl text-black mb-2">{product.title}</h3>
            <p className="text-black/60 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-semibold text-[#A33D4A]">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-sm text-black/40 line-through">
                      {formatCurrency(product.normalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-black">
                    {formatCurrency(product.normalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/60">Cost: {formatCurrency(product.costPrice)}</span>
                <span className="text-black/60">Stock: {product.stock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/60">Profit:</span>
                <span className={`text-sm font-semibold ${
                  calculateProfit(product) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(calculateProfit(product))} ({calculateProfitMargin(product).toFixed(1)}%)
                </span>
              </div>
            </div>
            {product.variants.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-black/50 mb-2">Variants:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-black/5 rounded text-black/70"
                    >
                      {v.name} ({formatCurrency(v.price)})
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleOpenForm(product)}
                className="flex-1 h-10 rounded-lg border border-black/10 text-black text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1 h-10 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-3xl text-black">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Normal Price (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.normalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, normalPrice: e.target.value })
                    }
                    required
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sale Price (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cost Price (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: e.target.value })
                    }
                    required
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Profit Preview */}
              {formData.normalPrice && formData.costPrice && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Estimated Profit:</span>
                    <span className="text-lg font-semibold text-green-700">
                      {formatCurrency(
                        parseFloat(formData.salePrice || formData.normalPrice) - parseFloat(formData.costPrice)
                      )}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-green-700">Profit Margin:</span>
                    <span className="text-sm font-medium text-green-700">
                      {(
                        ((parseFloat(formData.salePrice || formData.normalPrice) - parseFloat(formData.costPrice)) /
                          parseFloat(formData.salePrice || formData.normalPrice)) *
                        100
                      ).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-black">
                    Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-sm text-[#A33D4A] font-medium hover:underline cursor-pointer"
                  >
                    + Add Variant
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center p-4 bg-black/5 rounded-xl"
                    >
                      <input
                        type="text"
                        placeholder="Variant name"
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(index, "name", e.target.value)
                        }
                        className="flex-1 h-10 px-3 rounded-lg border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-32 h-10 px-3 rounded-lg border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="h-10 w-10 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 h-12 rounded-xl border border-black/10 text-black font-medium hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-[#A33D4A] text-white font-medium transition-colors hover:bg-[#8E3540] cursor-pointer"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
