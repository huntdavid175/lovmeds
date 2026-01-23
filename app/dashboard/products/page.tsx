"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { supabase } from "@/app/lib/database";

type Variant = {
  name: string;
  price: number;
  salePrice?: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
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
  categoryIds?: string[];
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<Product[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch products and categories from Supabase on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants (*),
          product_category_relations (category_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform Supabase data to Product format
      const transformedProducts: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        normalPrice: parseFloat(p.normal_price),
        salePrice: p.sale_price ? parseFloat(p.sale_price) : undefined,
        costPrice: parseFloat(p.cost_price),
        stock: p.stock,
        imageUrl: p.image_url,
        variants: (p.product_variants || []).map((v: any) => ({
          name: v.name,
          price: parseFloat(v.price),
          salePrice: v.sale_price ? parseFloat(v.sale_price) : undefined,
        })),
        categoryIds: (p.product_category_relations || []).map(
          (r: any) => r.category_id
        ),
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(MOCK_PRODUCTS); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    normalPrice: "",
    salePrice: "",
    costPrice: "",
    stock: "",
    imageUrl: "",
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
        imageUrl: product.imageUrl || "",
        variants: product.variants,
      });
      setSelectedCategories(product.categoryIds || []);
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        normalPrice: "",
        salePrice: "",
        costPrice: "",
        stock: "",
        imageUrl: "",
        variants: [],
      });
      setSelectedCategories([]);
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
      imageUrl: "",
      variants: [],
    });
    setSelectedCategories([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const slug = generateSlug(formData.title);

      if (editingProduct) {
        // Update existing product
        const { error: productError } = await supabase
          .from("products")
          .update({
            title: formData.title,
            description: formData.description,
            slug: slug,
            normal_price: parseFloat(formData.normalPrice),
            sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
            cost_price: parseFloat(formData.costPrice),
            stock: parseInt(formData.stock) || 0,
            image_url: formData.imageUrl || null,
          })
          .eq("id", editingProduct.id);

        if (productError) throw productError;

        // Delete existing variants and insert new ones
        if (formData.variants.length > 0) {
          await supabase
            .from("product_variants")
            .delete()
            .eq("product_id", editingProduct.id);

          const variantsToInsert = formData.variants.map((v) => ({
            product_id: editingProduct.id,
            name: v.name,
            price: v.price,
            sale_price: v.salePrice || null,
            stock: 0,
          }));

          await supabase.from("product_variants").insert(variantsToInsert);
        }

        // Update category relations
        await supabase
          .from("product_category_relations")
          .delete()
          .eq("product_id", editingProduct.id);

        if (selectedCategories.length > 0) {
          const categoryRelations = selectedCategories.map((categoryId) => ({
            product_id: editingProduct.id,
            category_id: categoryId,
          }));

          await supabase
            .from("product_category_relations")
            .insert(categoryRelations);
        }
      } else {
        // Insert new product
        const { data: productData, error: productError } = await supabase
          .from("products")
          .insert({
            title: formData.title,
            description: formData.description,
            slug: slug,
            normal_price: parseFloat(formData.normalPrice),
            sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
            cost_price: parseFloat(formData.costPrice),
            stock: parseInt(formData.stock) || 0,
            image_url: formData.imageUrl || null,
            featured: false,
          })
          .select()
          .single();

        if (productError) throw productError;

        // Insert variants if any
        if (formData.variants.length > 0 && productData) {
          const variantsToInsert = formData.variants.map((v) => ({
            product_id: productData.id,
            name: v.name,
            price: v.price,
            sale_price: v.salePrice || null,
            stock: 0,
          }));

          await supabase.from("product_variants").insert(variantsToInsert);
        }

        // Insert category relations if any
        if (selectedCategories.length > 0 && productData) {
          const categoryRelations = selectedCategories.map((categoryId) => ({
            product_id: productData.id,
            category_id: categoryId,
          }));

          await supabase
            .from("product_category_relations")
            .insert(categoryRelations);
        }
      }

      // Refresh products list
      await fetchProducts();
      handleCloseForm();
    } catch (error: any) {
      alert(`Error saving product: ${error.message}`);
      console.error("Error saving product:", error);
    }
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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Delete variants first (due to foreign key constraint)
      await supabase.from("product_variants").delete().eq("product_id", id);

      // Delete product
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      // Refresh products list
      await fetchProducts();
    } catch (error: any) {
      alert(`Error deleting product: ${error.message}`);
      console.error("Error deleting product:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const errors: string[] = [];
        const parsedProducts: Product[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNum = index + 2; // +2 because index is 0-based and Excel rows start at 2 (header is row 1)

          // Validate required fields
          if (!row["Title"] || !row["Normal Price"] || !row["Cost Price"] || row["Stock"] === undefined) {
            errors.push(`Row ${rowNum}: Missing required fields (Title, Normal Price, Cost Price, or Stock)`);
            return;
          }

          const product: Product = {
            id: `temp-${Date.now()}-${index}`, // Temporary ID, will be replaced by Supabase UUID
            title: String(row["Title"] || "").trim(),
            description: String(row["Description"] || "").trim(),
            normalPrice: parseFloat(row["Normal Price"]) || 0,
            salePrice: row["Sale Price"] ? parseFloat(row["Sale Price"]) : undefined,
            costPrice: parseFloat(row["Cost Price"]) || 0,
            stock: parseInt(row["Stock"]) || 0,
            imageUrl: row["Image URL"] ? String(row["Image URL"]).trim() : undefined,
            variants: [],
          };

          // Parse variants if provided (format: "Variant1:Price1, Variant2:Price2")
          if (row["Variants"]) {
            const variantString = String(row["Variants"]);
            const variantPairs = variantString.split(",").map((v: string) => v.trim());
            product.variants = variantPairs
              .map((pair: string) => {
                const [name, price] = pair.split(":").map((s) => s.trim());
                if (name && price) {
                  return { name, price: parseFloat(price) || 0 };
                }
                return null;
              })
              .filter((v): v is Variant => v !== null);
          }

          parsedProducts.push(product);
        });

        setImportPreview(parsedProducts);
        setImportErrors(errors);
      } catch (error) {
        setImportErrors([`Error reading file: ${error}`]);
        setImportPreview([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportProducts = async () => {
    if (importPreview.length === 0) return;

    setIsImporting(true);
    const errors: string[] = [];
    const successful: string[] = [];

    try {
      for (const product of importPreview) {
        try {
          // Generate slug if not provided
          const slug = generateSlug(product.title);

          // Insert product into Supabase
          const { data: productData, error: productError } = await supabase
            .from("products")
            .insert({
              title: product.title,
              description: product.description,
              slug: slug,
              normal_price: product.normalPrice,
              sale_price: product.salePrice || null,
              cost_price: product.costPrice,
              stock: product.stock,
              image_url: product.imageUrl || null,
              featured: false,
            })
            .select()
            .single();

          if (productError) {
            errors.push(`${product.title}: ${productError.message}`);
            continue;
          }

          // Insert variants if any
          if (product.variants && product.variants.length > 0 && productData) {
            const variantsToInsert = product.variants.map((variant) => ({
              product_id: productData.id,
              name: variant.name,
              price: variant.price,
              sale_price: variant.salePrice || null,
              stock: 0, // Default stock for variants
            }));

            const { error: variantError } = await supabase
              .from("product_variants")
              .insert(variantsToInsert);

            if (variantError) {
              errors.push(`${product.title} variants: ${variantError.message}`);
            }
          }

          successful.push(product.title);
        } catch (error: any) {
          errors.push(`${product.title}: ${error.message || "Unknown error"}`);
        }
      }

      if (successful.length > 0) {
        // Refresh products list
        await fetchProducts();
        alert(`Successfully imported ${successful.length} product(s)!`);
      }

      if (errors.length > 0) {
        setImportErrors(errors);
      } else {
        // Close modal if no errors
        setIsImportOpen(false);
        setImportPreview([]);
        setImportErrors([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      setImportErrors([`Import failed: ${error.message}`]);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Title: "Product Name",
        Description: "Product description here",
        "Normal Price": 29.99,
        "Sale Price": 24.99,
        "Cost Price": 15.00,
        Stock: 50,
        Variants: "Small:24.99, Large:34.99",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "product-import-template.xlsx");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black mb-1 ls-title">
            Products
          </h1>
          <p className="text-black/60 text-sm md:text-base">
            Manage your product catalog
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <button
            onClick={() => {
              setIsImportOpen(true);
              setImportPreview([]);
              setImportErrors([]);
            }}
            className="h-12 px-6 rounded-xl bg-white border border-black/10 text-black font-medium transition-colors hover:bg-black/5 cursor-pointer"
          >
            📥 Import from Excel
          </button>
          <button
            onClick={() => handleOpenForm()}
            className="h-12 px-6 rounded-xl bg-[#A33D4A] text-white font-medium transition-colors hover:bg-[#8E3540] cursor-pointer"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33D4A] mx-auto mb-4"></div>
          <p className="text-black/60">Loading products...</p>
        </div>
      )}

      {/* Products List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-black/60">No products found. Import from Excel or add a product manually.</p>
            </div>
          ) : (
            products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
          >
            {product.imageUrl && (
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-black/5">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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
            {product.categoryIds && product.categoryIds.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-black/50 mb-2">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {product.categoryIds.map((categoryId) => {
                    const category = categories.find((c) => c.id === categoryId);
                    return category ? (
                      <span
                        key={categoryId}
                        className="text-xs px-2 py-1 bg-[#A33D4A]/10 text-[#A33D4A] rounded-full"
                      >
                        {category.name}
                      </span>
                    ) : null;
                  })}
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
            ))
          )}
        </div>
      )}

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

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Image URL (Google Drive Link)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
                  className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                />
                <p className="text-xs text-black/50 mt-1">
                  Upload to Google Drive and paste the shareable link here
                </p>
                {formData.imageUrl && (
                  <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden bg-black/5">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Categories
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-black/10 rounded-xl p-4">
                  {categories.length === 0 ? (
                    <p className="text-sm text-black/50">
                      No categories available.{" "}
                      <a
                        href="/dashboard/categories"
                        className="text-[#A33D4A] hover:underline"
                      >
                        Create categories
                      </a>{" "}
                      first.
                    </p>
                  ) : (
                    categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([
                                ...selectedCategories,
                                category.id,
                              ]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter(
                                  (id) => id !== category.id
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 rounded border-black/20 text-[#A33D4A] focus:ring-[#A33D4A] cursor-pointer"
                        />
                        <span className="text-sm text-black">{category.name}</span>
                      </label>
                    ))
                  )}
                </div>
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

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-3xl text-black">
                Import Products from Excel
              </h2>
              <button
                onClick={() => {
                  setIsImportOpen(false);
                  setImportPreview([]);
                  setImportErrors([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-black/60 mb-4">
                  Upload an Excel file (.xlsx) with product data. Download the template to see the required format.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 rounded-xl border border-black/10 text-black text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    📥 Download Template
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="px-4 py-2 rounded-xl bg-[#A33D4A] text-white text-sm font-medium hover:bg-[#8E3540] transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {importErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Errors found:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {importErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {importPreview.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-black mb-4">
                    Preview ({importPreview.length} products ready to import):
                  </p>
                  <div className="max-h-96 overflow-y-auto border border-black/10 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-black/5 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-black">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-black">
                            Normal Price
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-black">
                            Cost Price
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-black">
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10">
                        {importPreview.slice(0, 10).map((product, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-black/70">
                              {product.title}
                            </td>
                            <td className="px-4 py-3 text-black/70">
                              {formatCurrency(product.normalPrice)}
                            </td>
                            <td className="px-4 py-3 text-black/70">
                              {formatCurrency(product.costPrice)}
                            </td>
                            <td className="px-4 py-3 text-black/70">
                              {product.stock}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 10 && (
                      <p className="p-4 text-sm text-black/60 text-center">
                        ... and {importPreview.length - 10} more products
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsImportOpen(false);
                    setImportPreview([]);
                    setImportErrors([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="flex-1 h-12 rounded-xl border border-black/10 text-black font-medium hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportProducts}
                  disabled={importPreview.length === 0}
                  className="flex-1 h-12 rounded-xl bg-[#A33D4A] text-white font-medium transition-colors hover:bg-[#8E3540] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Import {importPreview.length > 0 ? `${importPreview.length} ` : ""}
                  Products
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
