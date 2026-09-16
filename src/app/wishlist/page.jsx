"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Loader2,
  PackageOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  // ==========================================
  // LOAD WISHLIST
  // ==========================================
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/wishlist`, {
          credentials: "include",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load wishlist."
          );
        }

        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error("Wishlist loading error:", error);

        setError(
          error.message || "Something went wrong while loading wishlist."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load products."
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Products loading error:", error);
      }
    };

    loadProducts();
  }, []);

  // ==========================================
  // MATCH WISHLIST WITH PRODUCTS
  // ==========================================
  const wishlistProducts = wishlist
    .map((item) => {
      const product = products.find(
        (product) =>
          String(product._id || product.id) ===
          String(item.productId)
      );

      if (!product) return null;

      return {
        ...product,
        wishlistId: item._id,
      };
    })
    .filter(Boolean);

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================
  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      const response = await fetch(
        `${API_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to remove product."
        );
      }

      setWishlist((current) =>
        current.filter(
          (item) =>
            String(item.productId) !== String(productId)
        )
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
      alert(error.message || "Failed to remove product.");
    } finally {
      setRemovingId(null);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      id: product._id || product.id,
      quantity: 1,
    });
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-green-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

            <h1 className="text-xl font-bold text-slate-900">
              Unable to load wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================
  if (wishlistProducts.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/medicines"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-green-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="flex min-h-[55vh] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                <Heart className="h-12 w-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Your Wishlist is Empty
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Save your favorite SMAGRO products here and
                easily find them whenever you need them.
              </p>

              <Link
                href="/medicines"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                <PackageOpen className="h-5 w-5" />
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // WISHLIST UI
  // ==========================================
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/medicines"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-green-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                <Heart className="h-6 w-6 fill-green-600 text-green-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  My Wishlist
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {wishlistProducts.length}{" "}
                  {wishlistProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  saved
                </p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-green-100 bg-white px-5 py-3 shadow-sm sm:block">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Saved Products
            </p>

            <p className="mt-1 text-lg font-bold text-green-600">
              {wishlistProducts.length}
            </p>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => {
            const productId = product._id || product.id;

            return (
              <article
                key={productId}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Link href={`/medicines/${productId}`}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name || "Product"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PackageOpen className="h-14 w-14 text-slate-300" />
                      </div>
                    )}
                  </Link>

                  {/* WISHLIST REMOVE */}
                  <button
                    type="button"
                    onClick={() => handleRemove(productId)}
                    disabled={removingId === productId}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-red-500 shadow-md backdrop-blur transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {removingId === productId ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>

                  {/* BADGE */}
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <Link href={`/medicines/${productId}`}>
                    <h2 className="line-clamp-1 text-lg font-bold text-slate-900 transition hover:text-green-600">
                      {product.name}
                    </h2>
                  </Link>

                  {product.banglaName && (
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {product.banglaName}
                    </p>
                  )}

                  {product.category && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green-600">
                      {product.category}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="text-xl font-bold text-slate-900">
                        ৳{Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved to your wishlist
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}