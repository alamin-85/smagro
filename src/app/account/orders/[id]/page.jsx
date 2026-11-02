
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ORDER_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    description: "Your order has been received.",
    icon: ShoppingBag,
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    key: "processing",
    label: "Processing",
    description: "Your items are being prepared.",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: Check,
  },
];

const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

function formatDate(date) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

function getPaymentStatus(order) {
  return (
    order?.payment?.status ||
    order?.paymentStatus ||
    "pending"
  );
}

function getPaymentLabel(status) {
  const labels = {
    pending: "Pending",
    paid: "Paid",
    verified: "Verified",
    rejected: "Rejected",
    failed: "Failed",
  };

  return labels[status] || status;
}

function getStatusStyle(status) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return styles[status] || styles.pending;
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon size={19} />
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async (isRefresh = false) => {
    if (!orderId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/my/${orderId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load order details."
        );
      }

      if (!data.order) {
        throw new Error("Order not found.");
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Order Details Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <RefreshCw
            size={36}
            className="mx-auto animate-spin text-emerald-600"
          />
          <p className="mt-4 font-semibold text-slate-600">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle size={32} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to Load Order
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Order not found."}
          </p>

          <button
            onClick={() => fetchOrder()}
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Try Again
          </button>

          <div>
            <Link
              href="/account/orders"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600"
            >
              <ArrowLeft size={16} />
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = String(order.status || "pending").toLowerCase();
  const currentIndex = STATUS_INDEX[status] ?? -1;
  const isCancelled = status === "cancelled";
  const paymentStatus = getPaymentStatus(order);

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
          <Link
            href="/account/orders"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to My Orders
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Package size={25} />
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    Order Details
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your SMAGRO order
                  </p>
                </div>
              </div>

              <p className="mt-4 break-all font-mono text-sm text-slate-500">
                Order ID: <span className="font-bold text-slate-800">#{order._id}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Status
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Summary */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Order Status
              </p>

              <span
                className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusStyle(status)}`}
              >
                {status}
              </span>

              <p className="mt-3 text-sm text-slate-500">
                Order placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5 sm:min-w-52">
              <p className="text-sm font-medium text-emerald-700">
                Total Amount
              </p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Timeline */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <div className="flex items-center gap-2">
              <Truck className="text-emerald-600" size={22} />
              <h2 className="text-xl font-extrabold text-slate-900">
                Order Tracking
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Follow the current progress of your order.
            </p>
          </div>

          {isCancelled ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-3 text-red-700">
                <XCircle size={25} />
                <h3 className="font-bold">This order has been cancelled</h3>
              </div>
              <p className="mt-2 text-sm text-red-600">
                Please contact SMAGRO support if you need assistance.
              </p>
            </div>
          ) : (
            <div className="relative">
              {ORDER_STEPS.map((step, index) => {
                const Icon = step.icon;
                const completed = currentIndex >= index;
                const active = currentIndex === index;

                return (
                  <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                    {index !== ORDER_STEPS.length - 1 && (
                      <div
                        className={`absolute left-[19px] top-10 h-[calc(100%-16px)] w-0.5 ${
                          currentIndex > index
                            ? "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-bold ${
                            completed ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </h3>

                        {active && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {step.description}
                      </p>

                      {index === 0 && (
                        <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          {formatDateTime(order.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            <Clock3 size={14} className="mr-1 inline" />
            Tracking shows the current order progress. Individual status
            change dates are not available yet.
          </p>
        </section>

        {/* Product Details */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600" size={22} />
            <h2 className="text-xl font-extrabold text-slate-900">
              Ordered Products
            </h2>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-slate-500">
              No product information available.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <div
                  key={`${item.productId || item._id || index}`}
                  className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {item.name || "Product"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    {formatCurrency(
                      Number(item.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
            <span className="font-bold text-slate-700">Order Total</span>
            <span className="text-2xl font-extrabold text-emerald-600">
              {formatCurrency(order.total)}
            </span>
          </div>
        </section>

        {/* Delivery and Payment */}
        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard icon={MapPin} title="Shipping Address">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
              {order.shippingAddress || "Address not available"}
            </p>
          </InfoCard>

          <InfoCard icon={CreditCard} title="Payment Information">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-bold capitalize text-slate-800">
                  {order.paymentMethod || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Payment Status</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                    paymentStatus === "paid" ||
                    paymentStatus === "verified"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : paymentStatus === "rejected" ||
                          paymentStatus === "failed"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {getPaymentLabel(paymentStatus)}
                </span>
              </div>

              {order.payment?.verifiedAt && (
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-emerald-700">
                  <ShieldCheck size={15} />
                  Verified on {formatDateTime(order.payment.verifiedAt)}
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Order Information */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold text-slate-900">
            Order Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Order ID
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Order Date
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Updated
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDateTime(order.updatedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Method
              </p>
              <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                {order.paymentMethod || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-bold text-white">
              Need help with your order?
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Contact SMAGRO support for assistance.
            </p>
          </div>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            <ArrowLeft size={16} />
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
