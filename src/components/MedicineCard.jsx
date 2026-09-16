"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ArrowRight,
  Package,
  Heart,
  Loader2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MedicineCard({ medicine }) {
  const { addToCart } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);

  // ==========================================
  // CHECK WISHLIST STATUS
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const checkWishlist = async () => {
      try {
        const productId = medicine._id || medicine.id;

        if (!productId) {
          setWishlistLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/wishlist/check/${productId}`,
          {
            credentials: "include",
          }
        );

        // Guest user / unauthorized
        if (response.status === 401) {
          if (!cancelled) {
            setIsWishlisted(false);
          }

          return;
        }

        const data = await response.json();

        if (!cancelled && data.success) {
          setIsWishlisted(Boolean(data.isInWishlist));
        }
      } catch (error) {
        console.error("Wishlist check error:", error);
      } finally {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      }
    };

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [medicine._id, medicine.id]);

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    if (medicine.stock <= 0) return;

    addToCart(medicine, 1);

    alert(`${medicine.name} added to cart!`);
  };

  // ==========================================
  // TOGGLE WISHLIST
  // ==========================================
  const handleWishlist = async () => {
    const productId = medicine._id || medicine.id;

    if (!productId || wishlistUpdating) return;

    try {
      setWishlistUpdating(true);

      // ======================================
      // REMOVE FROM WISHLIST
      // ======================================
      if (isWishlisted) {
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
            data.message || "Failed to remove from wishlist."
          );
        }

        setIsWishlisted(false);

        return;
      }

      // ======================================
      // ADD TO WISHLIST
      // ======================================
      const response = await fetch(`${API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: String(productId),
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to add to wishlist."
        );
      }

      setIsWishlisted(true);
    } catch (error) {
      console.error("Wishlist update error:", error);

      alert(
        error.message ||
          "Something went wrong with your wishlist."
      );
    } finally {
      setWishlistUpdating(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ==========================================
          IMAGE
      ========================================== */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {medicine.image ? (
          <Link href={`/medicines/${medicine.id}`}>
            <Image
              src={medicine.image}
              alt={medicine.name}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-gray-300" />
          </div>
        )}

        {/* ==========================================
            PRODUCT BADGE
        ========================================== */}
        {medicine.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            {medicine.badge}
          </span>
        )}

        {/* ==========================================
            STOCK STATUS
        ========================================== */}
        <span
          className={`absolute right-16 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
            medicine.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>

        {/* ==========================================
            WISHLIST BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || wishlistUpdating}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`absolute right-4 top-16 flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-all duration-200 ${
            isWishlisted
              ? "border-red-100 bg-red-50 text-red-500"
              : "border-gray-200 bg-white/95 text-gray-500 hover:bg-green-50 hover:text-green-600"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {wishlistLoading || wishlistUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 transition-all ${
                isWishlisted ? "fill-current" : ""
              }`}
            />
          )}
        </button>
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}
      <div className="p-5">
        <p className="mb-2 text-sm font-medium text-green-600">
          {medicine.category}
        </p>

        <h3 className="text-xl font-bold text-gray-900">
          {medicine.name}
        </h3>

        {medicine.banglaName && (
          <p className="mt-1 text-sm text-gray-500">
            {medicine.banglaName}
          </p>
        )}

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
          {medicine.description}
        </p>

        {/* ==========================================
            PRICE
        ========================================== */}
        <div className="mt-4">
          <span className="text-2xl font-bold text-green-700">
            {medicine.price > 0
              ? `৳${medicine.price}`
              : "Price on Request"}
          </span>
        </div>

        {/* ==========================================
            BUTTONS
        ========================================== */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            disabled={medicine.stock <= 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </button>

          <Link
            href={`/medicines/${medicine.id}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ==========================================
            WISHLIST STATUS
        ========================================== */}
        {isWishlisted && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500">
            <Heart className="h-3.5 w-3.5 fill-current" />
            Saved to Wishlist
          </div>
        )}
      </div>
    </div>
  );
}