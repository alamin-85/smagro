"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <ShoppingBag className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-gray-600">
              Add some products to your cart before placing an order.
            </p>

            <Link
              href="/medicines"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-600">
            Review your products before placing your order.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">

            {/* Products */}
            <div className="space-y-4 lg:col-span-2">

              {cart.map((item) => (
                <div
    key={item._id || item.id || item.productId || `cart-item-${index}`}
    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
  >

                  {/* Image */}
                  <div className="relative h-32 w-full shrink-0 rounded-xl bg-gray-50 sm:w-32">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">

                    <div className="flex justify-between gap-4">

                      <div>
                        <p className="text-sm text-green-600">
                          {item.category}
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-gray-900">
                          {item.name}
                        </h2>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="h-fit text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                    </div>

                    <div className="mt-auto flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center">

                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-gray-200">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                      </div>

                      {/* Price */}
                      <p className="text-xl font-bold text-green-700">
                        ৳{item.price * item.quantity}
                      </p>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{cartTotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-700">
                      ৳{cartTotal}
                    </span>
                  </div>
                </div>

              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-semibold text-white hover:bg-green-700"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Link>

            </div>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}