"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
ArrowLeft,
Package,
User,
Phone,
MapPin,
CreditCard,
CalendarDays,
Trash2,
RefreshCw,
CheckCircle2,
} from "lucide-react";

const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:4000";

const ORDER_STATUSES = [
"pending",
"confirmed",
"processing",
"shipped",
"delivered",
"cancelled",
];

export default function AdminOrderDetailsPage() {
const params = useParams();
const router = useRouter();

const orderId = params?.id;

const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const [updating, setUpdating] = useState(false);
const [deleting, setDeleting] = useState(false);
const [error, setError] = useState("");

const fetchOrder = async () => {
try {
setLoading(true);
setError("");


  const response = await fetch(
    `${API_URL}/api/orders/${orderId}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to load order."
    );
  }

  setOrder(data.order);
} catch (error) {
  console.error(
    "Fetch order error:",
    error
  );

  setError(
    error.message ||
      "Failed to load order."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
if (orderId) {
fetchOrder();
}
}, [orderId]);

const handleStatusChange = async (
newStatus
) => {
if (!order) return;


if (newStatus === order.status) {
  return;
}

try {
  setUpdating(true);
  setError("");

  const response = await fetch(
    `${API_URL}/api/orders/${order._id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update order status."
    );
  }

  setOrder(data.order);
} catch (error) {
  console.error(
    "Update order status error:",
    error
  );

  setError(
    error.message ||
      "Failed to update order status."
  );
} finally {
  setUpdating(false);
}


};

const handleDelete = async () => {
if (!order) return;


const confirmed = window.confirm(
  "Are you sure you want to permanently delete this order? This action cannot be undone."
);

if (!confirmed) return;

try {
  setDeleting(true);
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

  router.push("/admin/orders");
} catch (error) {
  console.error(
    "Delete order error:",
    error
  );

  setError(
    error.message ||
      "Failed to delete order."
  );
} finally {
  setDeleting(false);
}


};

const formatDate = (date) => {
if (!date) return "—";


return new Date(date).toLocaleString(
  "en-BD",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

if (loading) {
return ( <div className="flex min-h-screen items-center justify-center bg-gray-50"> <div className="text-center"> <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />


      <p className="mt-4 text-sm text-gray-500">
        Loading order...
      </p>
    </div>
  </div>
);


}

if (error && !order) {
return ( <div className="min-h-screen bg-gray-50 px-6 py-10"> <div className="mx-auto max-w-3xl"> <Link
         href="/admin/orders"
         className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
       > <ArrowLeft size={17} />
Back to Orders </Link>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    </div>
  </div>
);


}

if (!order) {
return null;
}

const items = Array.isArray(order.items)
? order.items
: [];

return ( <div className="min-h-screen bg-gray-50 px-6 py-8"> <div className="mx-auto max-w-6xl">
{/* Header */}


    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <Link
          href="/admin/orders"
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Package size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Order #
              {order._id
                ?.toString()
                .slice(-8)
                .toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={fetchOrder}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-700"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-60"
        >
          <Trash2 size={17} />

          {deleting
            ? "Deleting..."
            : "Delete Order"}
        </button>
      </div>
    </div>

    {/* Error */}

    {error && (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {error}
      </div>
    )}

    {/* Order Status */}

    <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Order Status
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span
              className={`rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusClass(
                order.status
              )}`}
            >
              {order.status || "pending"}
            </span>

            {order.status ===
              "delivered" && (
              <CheckCircle2
                size={20}
                className="text-green-600"
              />
            )}
          </div>
        </div>

        <div className="w-full lg:max-w-xs">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Change Status
          </label>

          <select
            value={
              order.status || "pending"
            }
            onChange={(e) =>
              handleStatusChange(
                e.target.value
              )
            }
            disabled={updating}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium capitalize outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60"
          >
            {ORDER_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>

          {updating && (
            <p className="mt-2 text-xs text-gray-500">
              Updating order status...
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Customer + Payment */}

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Customer */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <User size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Customer Information
            </h2>

            <p className="text-xs text-gray-500">
              Customer details
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Name
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {order.customer?.name ||
                "—"}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Phone
              size={18}
              className="mt-0.5 text-gray-400"
            />

            <div>
              <p className="text-xs font-medium text-gray-400">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.customer?.phone ||
                  "—"}
              </p>
            </div>
          </div>

          {order.customer?.email && (
            <div>
              <p className="text-xs font-medium text-gray-400">
                Email
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.customer.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery + Payment */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <MapPin size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Delivery & Payment
            </h2>

            <p className="text-xs text-gray-500">
              Shipping and payment details
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin
              size={18}
              className="mt-0.5 text-gray-400"
            />

            <div>
              <p className="text-xs font-medium text-gray-400">
                Delivery Address
              </p>

              <p className="mt-1 leading-6 text-gray-900">
                {order.shippingAddress ||
                  "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard
              size={18}
              className="mt-0.5 text-gray-400"
            />

            <div>
              <p className="text-xs font-medium text-gray-400">
                Payment
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {order.paymentMethod ||
                  "—"}
              </p>

              <p className="mt-1 text-sm capitalize text-gray-500">
                Status:{" "}
                {order.paymentStatus ||
                  "pending"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays
              size={18}
              className="mt-0.5 text-gray-400"
            />

            <div>
              <p className="text-xs font-medium text-gray-400">
                Order Date
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Products */}

    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900">
          Ordered Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {items.length} product
          {items.length !== 1
            ? "s"
            : ""}{" "}
          in this order
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <div
            key={
              item.productId ||
              item.id ||
              index
            }
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name || "Product"}
                  className="h-16 w-16 rounded-xl border border-gray-100 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <Package size={24} />
                </div>
              )}

              <div>
                <h3 className="font-bold text-gray-900">
                  {item.name ||
                    "Unnamed Product"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  ৳
                  {Number(
                    item.price || 0
                  ).toLocaleString(
                    "en-BD"
                  )}{" "}
                  × {item.quantity || 1}
                </p>
              </div>
            </div>

            <p className="font-bold text-green-700">
              ৳
              {(
                Number(
                  item.price || 0
                ) *
                Number(
                  item.quantity || 1
                )
              ).toLocaleString("en-BD")}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Summary */}

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-900">
          Order Notes
        </h2>

        <p className="mt-3 min-h-20 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {order.notes ||
            "No additional notes."}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-900">
          Order Summary
        </h2>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-medium text-gray-900">
              ৳
              {Number(
                order.subtotal || 0
              ).toLocaleString("en-BD")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Delivery Charge
            </span>

            <span className="font-medium text-gray-900">
              ৳
              {Number(
                order.deliveryCharge ||
                  0
              ).toLocaleString("en-BD")}
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span className="text-green-700">
                ৳
                {Number(
                  order.total || 0
                ).toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


);
}
