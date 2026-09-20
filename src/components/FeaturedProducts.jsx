"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShoppingCart,
  Star,
  Check,
  Loader2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load products."
          );
        }

        if (isMounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (error) {
        console.error("Featured products error:", error);

        if (isMounted) {
          setError(
            "Unable to load products right now. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = products
    .filter(
      (product) =>
        product?.status !== "inactive"
    )
    .slice(0, 4);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-green-600">
              Featured Collection
            </span>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Popular Products
            </h2>

            <p className="mt-3 max-w-2xl text-gray-500">
              Explore our carefully selected agricultural and
              livestock-care products.
            </p>
          </div>

          <Link
            href="/medicines"
            className="group inline-flex items-center gap-2 text-sm font-bold text-green-600 transition hover:text-green-700"
          >
            View All Products

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          featuredProducts.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <div className="text-5xl">💊</div>

              <p className="mt-4 font-semibold text-gray-500">
                Products coming soon.
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Our latest agricultural products will appear here.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}

/* =========================================================
   Product Card
========================================================= */

function ProductCard({ product, addToCart }) {
  const productId = product?._id;

  const isAvailable =
    Number(product?.stock || 0) > 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl">

      {/* Image */}
      <Link
        href={`/medicines/${productId}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
      >
        {product?.image ? (
          <Image
            src={product.image}
            alt={product.name || "SMAGRO Product"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">
            💊
          </div>
        )}

        {/* Badge */}
        {product?.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Stock */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable
              ? "bg-white text-green-700 shadow-sm"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5">

        {/* Category */}
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
          {product?.category || "Agriculture"}
        </p>

        {/* Product Name */}
        <Link href={`/medicines/${productId}`}>
          <h3 className="mt-2 line-clamp-1 text-lg font-bold text-gray-900 transition hover:text-green-600">
            {product?.name || "Product"}
          </h3>
        </Link>

        {/* Bangla Name */}
        {product?.banglaName && (
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
            {product.banglaName}
          </p>
        )}

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                className="h-3.5 w-3.5 fill-current text-amber-400"
              />
            ))}
          </div>

          <span className="text-xs text-gray-400">
            5.0
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">
              Price
            </p>

            <p className="text-xl font-extrabold text-gray-900">
              ৳
              {Number(
                product?.price || 0
              ).toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() =>
              addToCart(product, 1)
            }
            className="flex h-11 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isAvailable ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Sold Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Loading Skeleton
========================================================= */

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-gray-100" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />

        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-20 animate-pulse rounded bg-gray-100" />

          <div className="h-11 w-24 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}