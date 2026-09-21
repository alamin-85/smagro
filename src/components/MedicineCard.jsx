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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MedicineCard({ medicine }) {
  const { addToCart } = useCart();

  // ==========================================
  // PRODUCT ID
  // ==========================================
  const productId = medicine?._id || medicine?.id;

  // ==========================================
  // WISHLIST STATES
  // ==========================================
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);

  // ==========================================
  // FEEDBACK STATE
  // ==========================================
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistError, setWishlistError] = useState("");

  // ==========================================
  // CHECK WISHLIST STATUS
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const checkWishlist = async () => {
      if (!productId) {
        if (!cancelled) {
          setWishlistLoading(false);
        }
        return;
      }

      try {
        setWishlistLoading(true);

        const response = await fetch(
          `${API_URL}/api/wishlist/check/${productId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        // --------------------------------------
        // USER NOT LOGGED IN
        // --------------------------------------
        if (response.status === 401) {
          if (!cancelled) {
            setIsWishlisted(false);
          }
          return;
        }

        // --------------------------------------
        // OTHER API ERROR
        // --------------------------------------
        if (!response.ok) {
          throw new Error("Failed to check wishlist status.");
        }

        // --------------------------------------
        // SAFE JSON PARSING
        // --------------------------------------
        const data = await response.json();

        if (!cancelled && data?.success) {
          setIsWishlisted(Boolean(data.isInWishlist));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Wishlist check error:", error);
          setIsWishlisted(false);
        }
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
  }, [productId]);

  // ==========================================
  // CLEAR FEEDBACK
  // ==========================================
  const clearFeedback = () => {
    setWishlistMessage("");
    setWishlistError("");
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    if (!medicine || medicine.stock <= 0) {
      return;
    }

    try {
      addToCart(medicine, 1);

      // Small browser feedback
      window.setTimeout(() => {
        // Intentionally empty.
        // CartContext handles cart state.
      }, 0);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ==========================================
  // LOGIN REDIRECT
  // ==========================================
  const redirectToLogin = () => {
    const currentPath =
      window.location.pathname + window.location.search;

    const loginUrl = `/login?redirect=${encodeURIComponent(
      currentPath
    )}`;

    window.location.href = loginUrl;
  };

  // ==========================================
  // TOGGLE WISHLIST
  // ==========================================
  const handleWishlist = async () => {
    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------
    if (!productId) {
      setWishlistError("Product information is missing.");
      return;
    }

    // --------------------------------------
    // PREVENT DOUBLE CLICK
    // --------------------------------------
    if (wishlistLoading || wishlistUpdating) {
      return;
    }

    clearFeedback();

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

        // ------------------------------------
        // LOGIN REQUIRED
        // ------------------------------------
        if (response.status === 401) {
          redirectToLogin();
          return;
        }

        // ------------------------------------
        // SAFE RESPONSE
        // ------------------------------------
        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Failed to remove from wishlist."
          );
        }

        // ------------------------------------
        // REAL-TIME UI UPDATE
        // ------------------------------------
        setIsWishlisted(false);

        setWishlistMessage("Removed from wishlist.");

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

      // --------------------------------------
      // LOGIN REQUIRED
      // --------------------------------------
      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      // --------------------------------------
      // SAFE RESPONSE
      // --------------------------------------
      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // --------------------------------------
      // DUPLICATE / OTHER ERROR
      // --------------------------------------
      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Failed to add to wishlist."
        );
      }

      // --------------------------------------
      // REAL-TIME UI UPDATE
      // --------------------------------------
      setIsWishlisted(true);

      setWishlistMessage("Added to wishlist.");
    } catch (error) {
      console.error("Wishlist update error:", error);

      setWishlistError(
        error?.message ||
          "Something went wrong with your wishlist."
      );
    } finally {
      setWishlistUpdating(false);

      // --------------------------------------
      // AUTO CLEAR MESSAGE
      // --------------------------------------
      window.setTimeout(() => {
        setWishlistMessage("");
        setWishlistError("");
      }, 3000);
    }
  };

  // ==========================================
  // SAFE VALUES
  // ==========================================
  const productLink = productId
    ? `/medicines/${productId}`
    : "/medicines";

  const stock = Number(medicine?.stock || 0);
  const price = Number(medicine?.price || 0);

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ==========================================
          IMAGE
      ========================================== */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {medicine?.image ? (
          <Link href={productLink}>
            <Image
              src={medicine.image}
              alt={medicine?.name || "Medicine"}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
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
        {medicine?.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            {medicine.badge}
          </span>
        )}

        {/* ==========================================
            STOCK STATUS
        ========================================== */}
        <span
          className={`absolute right-16 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
            stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </span>

        {/* ==========================================
            WISHLIST BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={
            wishlistLoading || wishlistUpdating || !productId
          }
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
              ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
              : "border-gray-200 bg-white/95 text-gray-500 hover:bg-green-50 hover:text-green-600"
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {wishlistLoading || wishlistUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
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
        {/* CATEGORY */}
        <p className="mb-2 text-sm font-medium text-green-600">
          {medicine?.category || "General"}
        </p>

        {/* NAME */}
        <h3 className="text-xl font-bold text-gray-900">
          {medicine?.name || "Unnamed Product"}
        </h3>

        {/* BANGLA NAME */}
        {medicine?.banglaName && (
          <p className="mt-1 text-sm text-gray-500">
            {medicine.banglaName}
          </p>
        )}

        {/* DESCRIPTION */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
          {medicine?.description ||
            "No product description available."}
        </p>

        {/* ==========================================
            PRICE
        ========================================== */}
        <div className="mt-4">
          <span className="text-2xl font-bold text-green-700">
            {price > 0 ? `৳${price}` : "Price on Request"}
          </span>
        </div>

        {/* ==========================================
            BUTTONS
        ========================================== */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* CART */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
          </button>

          {/* DETAILS */}
          <Link
            href={productLink}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ==========================================
            WISHLIST SUCCESS MESSAGE
        ========================================== */}
        {wishlistMessage && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {wishlistMessage}
          </div>
        )}

        {/* ==========================================
            WISHLIST ERROR MESSAGE
        ========================================== */}
        {wishlistError && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {wishlistError}
          </div>
        )}

        {isWishlisted && !wishlistMessage && !wishlistError && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500">
            <Heart className="h-3.5 w-3.5 fill-current" />
            Saved to Wishlist
          </div>
        )}
      </div>
    </div>
  );
}