"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  ShoppingBag,
  Eye,
  Trash2,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchOrders = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      setError(
        error.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return orders;
    }

    return orders.filter((order) => {
      const orderId =
        order._id?.toString().toLowerCase() || "";

      const customerName =
        order.customer?.name
          ?.toLowerCase() || "";

      const phone =
        order.customer?.phone
          ?.toLowerCase() || "";

      const paymentMethod =
        order.paymentMethod
          ?.toLowerCase() || "";

      const status =
        order.status
          ?.toLowerCase() || "";

      return (
        orderId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        phone.includes(searchValue) ||
        paymentMethod.includes(searchValue) ||
        status.includes(searchValue)
      );
    });
  }, [orders, search]);

  const stats = {
    total: orders.length,

    pending: orders.filter(
      (order) => order.status === "pending"
    ).length,

    processing: orders.filter(
      (order) =>
        order.status === "processing" ||
        order.status === "confirmed"
    ).length,

    delivered: orders.filter(
      (order) => order.status === "delivered"
    ).length,

    cancelled: orders.filter(
      (order) => order.status === "cancelled"
    ).length,
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-BD",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "confirmed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "processing":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "shipped":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";

      case "delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const handleDelete = async (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete this order?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${order._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete order."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (item) =>
            item._id !== order._id
        )
      );
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete order."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <ShoppingBag size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage and monitor customer orders.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Orders
              </p>

              <ShoppingBag
                size={20}
                className="text-green-600"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Pending
              </p>

              <Clock3
                size={20}
                className="text-yellow-600"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Processing
              </p>

              <Truck
                size={20}
                className="text-blue-600"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stats.processing}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Delivered
              </p>

              <CheckCircle2
                size={20}
                className="text-green-600"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stats.delivered}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Cancelled
              </p>

              <XCircle
                size={20}
                className="text-red-600"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Search */}

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by order ID, customer name, phone, payment or status..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* Orders Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading orders...
                </p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ShoppingBag size={28} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                No orders found
              </h2>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                {search
                  ? "Try changing your search keyword."
                  : "Customer orders will appear here once they place an order."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={order._id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Order */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            #
                            {order._id
                              ?.toString()
                              .slice(-8)
                              .toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </td>

                        {/* Customer */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {order.customer
                              ?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {order.customer
                              ?.phone || "—"}
                          </p>
                        </td>

                        {/* Items */}

                        <td className="px-5 py-4">
                          <span className="font-medium text-gray-700">
                            {Array.isArray(
                              order.items
                            )
                              ? order.items.length
                              : 0}{" "}
                            product
                            {Array.isArray(
                              order.items
                            ) &&
                            order.items.length !==
                              1
                              ? "s"
                              : ""}
                          </span>
                        </td>

                        {/* Payment */}

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">
                            {order.paymentMethod ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs capitalize text-gray-500">
                            {order.paymentStatus ||
                              "pending"}
                          </p>
                        </td>

                        {/* Total */}

                        <td className="px-5 py-4">
                          <span className="font-bold text-green-700">
                            ৳
                            {Number(
                              order.total || 0
                            ).toLocaleString(
                              "en-BD"
                            )}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status ||
                              "pending"}
                          </span>
                        </td>

                        {/* Action */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:border-green-300 hover:bg-green-100"
                            >
                              <Eye size={15} />
                              View
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(
                                  order
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}