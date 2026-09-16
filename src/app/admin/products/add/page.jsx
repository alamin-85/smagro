"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const categories = [
  "Poultry & Livestock",
  "Cattle",
  "Poultry",
  "Fish",
  "Agricultural Products",
  "Veterinary Medicine",
  "Feed & Supplements",
];

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    banglaName: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    badge: "",
    status: "active",
  });
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [imageUploading, setImageUploading] = useState(false);

  const [benefits, setBenefits] = useState([""]);
  const [usage, setUsage] = useState([""]);
  const [supply, setSupply] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------------
  // Input change
  // --------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // --------------------------------
  // Dynamic field change
  // --------------------------------
  const handleArrayChange = (
    setter,
    index,
    value
  ) => {
    setter((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  };

  // --------------------------------
  // Add dynamic field
  // --------------------------------
  const addArrayField = (setter) => {
    setter((previous) => [...previous, ""]);
  };

  // --------------------------------
  // Remove dynamic field
  // --------------------------------
  const removeArrayField = (setter, index) => {
    setter((previous) => {
      if (previous.length === 1) {
        return [""];
      }

      return previous.filter(
        (_, itemIndex) => itemIndex !== index
      );
    });
  };

  // --------------------------------
  // Submit
  // --------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (
      formData.price === "" ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      Number.isNaN(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

  if (imageFile) {
    setImageUploading(true);

    imageUrl = await uploadImage(imageFile);

    setImageUploading(false);
  }
  if (!imageFile) {
  setError("Please select a product image.");
  return;
}

      const productData = {
        name: formData.name.trim(),

        banglaName: formData.banglaName.trim(),

        category: formData.category,

        description: formData.description.trim(),

        benefits: benefits
          .map((item) => item.trim())
          .filter(Boolean),

        usage: usage
          .map((item) => item.trim())
          .filter(Boolean),

        supply: supply
          .map((item) => item.trim())
          .filter(Boolean),

        price: Number(formData.price),

        stock: Number(formData.stock),

        image: imageUrl || formData.image.trim(),

        badge: formData.badge.trim(),

        status: formData.status,
      };

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create product."
        );
      }

      setSuccess(
        "Product created successfully."
      );

      // Redirect after successful creation
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Add New Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new product to your SMAGRO store.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Messages */}
        {/* -------------------------------- */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* -------------------------------- */}
        {/* Form */}
        {/* -------------------------------- */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* -------------------------------- */}
          {/* Basic Information */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the basic information about the
                product.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Product Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. AMINO MIX"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Bangla Name */}
              <div>
                <label
                  htmlFor="banglaName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Bangla Name
                </label>

                <input
                  id="banglaName"
                  name="banglaName"
                  type="text"
                  value={formData.banglaName}
                  onChange={handleChange}
                  placeholder="অ্যামাইনো এসিডের সুষম মিশ্রণ"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label
                  htmlFor="badge"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Badge
                </label>

                <input
                  id="badge"
                  name="badge"
                  type="text"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="e.g. Featured, New, Popular"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a detailed product description..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Pricing & Inventory */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Pricing & Inventory
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Set the product price and available
                stock.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Price (৳) *
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="450"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Image */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Product Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the image path or image URL for
                this product.
              </p>
            </div>

            <div>
  <label
    htmlFor="productImage"
    className="mb-2 block text-sm font-semibold text-gray-700"
  >
    Product Image *
  </label>

  <input
    id="productImage"
    type="file"
    accept="image/*"
    onChange={(event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        setError("Product image must be less than 5MB.");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
      setSuccess("");
    }}
    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-green-100 file:px-4 file:py-2 file:font-semibold file:text-green-700 hover:file:bg-green-200"
  />

  <p className="mt-2 text-xs text-gray-400">
    JPG, PNG or WEBP. Maximum 5MB.
  </p>

  {imagePreview && (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-medium text-gray-500">
        Image Preview
      </p>

      <img
        src={imagePreview}
        alt="Product preview"
        className="h-56 w-full rounded-lg object-contain"
      />
    </div>
  )}
</div>
          </section>

          {/* -------------------------------- */}
          {/* Benefits */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Product Benefits
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the main benefits of this product.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  addArrayField(setBenefits)
                }
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={`benefit-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={benefit}
                    onChange={(event) =>
                      handleArrayChange(
                        setBenefits,
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeArrayField(
                        setBenefits,
                        index
                      )
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Usage */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Usage / Dosage
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add instructions for using the
                  product.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  addArrayField(setUsage)
                }
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {usage.map((item, index) => (
                <div
                  key={`usage-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(event) =>
                      handleArrayChange(
                        setUsage,
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`Usage / Dosage ${index + 1}`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeArrayField(
                        setUsage,
                        index
                      )
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Supply */}
          {/* -------------------------------- */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Available Supply / Size
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add available package sizes or
                  quantities.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  addArrayField(setSupply)
                }
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {supply.map((item, index) => (
                <div
                  key={`supply-${index}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(event) =>
                      handleArrayChange(
                        setSupply,
                        index,
                        event.target.value
                      )
                    }
                    placeholder={`e.g. 500 ml`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeArrayField(
                        setSupply,
                        index
                      )
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* Submit */}
          {/* -------------------------------- */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
             {loading ? (
  <>
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    {imageUploading ? "Uploading Image..." : "Creating..."}
  </>
) : (
  <>
    <Save size={18} />
    Create Product
  </>
)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}