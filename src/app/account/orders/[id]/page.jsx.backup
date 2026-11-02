"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const statusStyles = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const paymentStatusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/api/orders/my`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("My Orders Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/account"
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
              >
                <ArrowLeft size={16} />
                Back to My Account
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <ShoppingBag size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    My Orders
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Track and manage your SMAGRO orders
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <Loader2 className="mx-auto animate-spin text-emerald-600" size={34} />

              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading your orders...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Package size={25} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load orders
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchOrders()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShoppingBag size={34} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't placed any orders yet. Explore our products and
              start your farming journey with SMAGRO.
            </p>

            <Link
              href="/medicines"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ShoppingBag size={17} />
              Browse Products
            </Link>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {orders.length}
                </span>{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>
            </div>

            {orders.map((order) => {
              const status =
                statusStyles[order.status] || statusStyles.pending;

              const paymentStatus =
                paymentStatusStyles[order.paymentStatus] ||
                paymentStatusStyles.pending;

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  {/* Order Top */}
                  <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <Package size={21} />
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Order ID
                          </p>

                          <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800">
                            #{order._id}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays size={14} />
                            {formatDateTime(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${paymentStatus}`}
                        >
                          Payment: {order.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="px-5 py-5 sm:px-6">
                    <div className="grid gap-5 md:grid-cols-3">
                      {/* Items */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Package size={17} className="text-emerald-600" />
                          Products
                        </div>

                        <div className="mt-3 space-y-2">
                          {(order.items || []).slice(0, 3).map((item, index) => (
                            <div
                              key={`${order._id}-${item.productId || index}`}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="truncate text-slate-600">
                                {item.name || "Product"}
                              </span>

                              <span className="shrink-0 font-semibold text-slate-800">
                                ×{item.quantity || 1}
                              </span>
                            </div>
                          ))}

                          {(order.items || []).length > 3 && (
                            <p className="pt-1 text-xs font-medium text-emerald-600">
                              + {(order.items || []).length - 3} more products
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Truck size={17} className="text-emerald-600" />
                          Delivery
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                          {order.shippingAddress || "Address not available"}
                        </p>
                      </div>

                      {/* Payment */}
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <CreditCard
                            size={17}
                            className="text-emerald-600"
                          />
                          Payment
                        </div>

                        <p className="mt-3 text-sm font-semibold capitalize text-slate-700">
                          {order.paymentMethod || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.paymentStatus || "pending"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                          {formatCurrency(order.total)}
                        </p>
                      </div>

                      <Link
                        href={`/account/orders/${order._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                      >
                        View Details
                        <ChevronRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}