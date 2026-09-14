"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import RecentUsers from "@/components/admin/RecentUsers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export default function  AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
const [totalRevenue, setTotalRevenue] = useState(0);
const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     CHECK ADMIN
  ========================= */

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data =
          await response.json();

        if (!response.ok || !data.success) {
          window.location.href = "/login";
          return;
        }

        if (data.user.role !== "admin") {
          window.location.href = "/";
          return;
        }

        setUser(data.user);

        /* =========================
           GET USERS
        ========================= */

        const usersResponse =
          await fetch(
            `${API_URL}/api/auth/users`,
            {
              method: "GET",
              credentials: "include",
            }
          );

        const usersData =
          await usersResponse.json();

        if (usersResponse.ok) {
          setUsers(
            usersData.users || []
          );
        }
        const productsResponse = await fetch(
  `${API_URL}/api/products/count`
);

// =========================
// GET ORDER COUNT
// =========================
const ordersResponse = await fetch(
  `${API_URL}/api/orders/count`,
  {
    method: "GET",
    credentials: "include",
  }
);

const ordersData =
  await ordersResponse.json();

if (
  ordersResponse.ok &&
  ordersData.success
) {
  setOrderCount(
    ordersData.count || 0
  );
}

// =========================
// GET TOTAL REVENUE
// =========================
const revenueResponse = await fetch(
  `${API_URL}/api/orders/revenue`,
  {
    method: "GET",
    credentials: "include",
  }
);

const revenueData =
  await revenueResponse.json();

if (
  revenueResponse.ok &&
  revenueData.success
) {
  setTotalRevenue(
    Number(revenueData.totalRevenue || 0)
  );
}

// =========================
// GET RECENT ORDERS
// =========================
const recentOrdersResponse = await fetch(
  `${API_URL}/api/orders`,
  {
    method: "GET",
    credentials: "include",
  }
);

const recentOrdersData =
  await recentOrdersResponse.json();

if (
  recentOrdersResponse.ok &&
  recentOrdersData.success
) {
  setRecentOrders(
    (recentOrdersData.orders || []).slice(0, 5)
  );
}

const productsData =
  await productsResponse.json();

if (
  productsResponse.ok &&
  productsData.success
) {
  setProductCount(
    productsData.count || 0
  );
}
      } catch (err) {
        console.error(
          "Admin dashboard error:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      window.location.href = "/login";
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        onLogout={handleLogout}
      />

      <div className="lg:pl-72">
        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          user={user}
        />

        <main className="p-4 md:p-8">
          {/* Welcome */}
          <section className="mb-8">
            <div className="rounded-3xl bg-gradient-to-r from-green-700 to-green-500 p-6 text-white shadow-lg md:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck
                      size={20}
                    />

                    <span className="text-sm font-semibold text-green-100">
                      Admin Access
                    </span>
                  </div>

                  <h1 className="text-2xl font-black md:text-3xl">
                    Welcome back,{" "}
                    {user?.name || "Admin"}!
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-green-50 md:text-base">
                    Manage your products,
                    customers and orders from
                    your SMAGRO administration
                    panel.
                  </p>
                </div>

                <Link
                  href="/admin/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-md transition hover:bg-green-50"
                >
                  <Plus size={18} />
                  Add Product
                </Link>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Stats */}
          <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              value={users.length}
              subtitle="Registered customers"
              icon={Users}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              trend="Live"
            />

            <StatCard
              title="Total Products"
              value={productCount}
              subtitle="Active products"
              icon={Package}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              trend="Active"
            />

          <StatCard
  title="Total Orders"
  value={orderCount}
  subtitle="Orders received"
  icon={ShoppingBag}
  iconBg="bg-orange-50"
  iconColor="text-orange-600"
  trend="Live"
/>

           <StatCard
  title="Total Revenue"
  value={`৳${totalRevenue.toLocaleString("en-BD")}`}
  subtitle="Overall store revenue"
  icon={DollarSign}
  iconBg="bg-purple-50"
  iconColor="text-purple-600"
  trend="Live"
/>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your store quickly
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/products"
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Package size={21} />
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Products
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Add, edit or remove products
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-green-600">
                  Manage
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={21} />
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Users
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  View and manage customers
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                  Manage
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>

              <Link
                href="/admin/orders"
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <ShoppingBag size={21} />
                </div>

                <h3 className="font-bold text-gray-900">
                  Manage Orders
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Track and update orders
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600">
                  Manage
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>

              <Link
                href="/admin/analytics"
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp size={21} />
                </div>

                <h3 className="font-bold text-gray-900">
                  Analytics
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  View store performance
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
                  View
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </div>
          </section>

          {/* Bottom Grid */}
          <section className="grid gap-6 xl:grid-cols-2">
            {/* Recent Users */}
            <RecentUsers
              users={users}
            />

            {/* Recent Orders */}
<div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
  <div className="flex items-center justify-between border-b border-gray-100 p-5">
    <div>
      <h3 className="font-bold text-gray-900">
        Recent Orders
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        Latest customer orders
      </p>
    </div>

    <Link
      href="/admin/orders"
      className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
    >
      View All
      <ArrowRight size={15} />
    </Link>
  </div>

  {recentOrders.length === 0 ? (
    <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
        <ShoppingBag size={25} />
      </div>

      <h4 className="mt-4 font-bold text-gray-900">
        No orders yet
      </h4>

      <p className="mt-1 max-w-xs text-sm text-gray-500">
        Customer orders will appear here once
        customers start placing orders.
      </p>

      <Link
        href="/admin/orders"
        className="mt-5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
      >
        Go to Orders
      </Link>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      {recentOrders.map((order) => {
        const orderDate = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString(
              "en-BD",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "N/A";

        const statusStyles = {
          pending:
            "bg-yellow-50 text-yellow-700",
          confirmed:
            "bg-blue-50 text-blue-700",
          processing:
            "bg-purple-50 text-purple-700",
          shipped:
            "bg-indigo-50 text-indigo-700",
          delivered:
            "bg-green-50 text-green-700",
          cancelled:
            "bg-red-50 text-red-700",
        };

        const statusClass =
          statusStyles[order.status] ||
          "bg-gray-50 text-gray-700";

        return (
          <div
            key={order._id}
            className="p-4 transition hover:bg-gray-50"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              
              {/* Customer + Order */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-bold text-gray-900">
                    {order.customer?.name ||
                      "Unknown Customer"}
                  </h4>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusClass}`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Order #
                  {order._id?.slice(-8).toUpperCase()}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {orderDate}
                </p>
              </div>

              {/* Amount + View */}
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-black text-gray-900">
                    ৳
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-BD")}
                  </p>

                  <p className="mt-1 text-[11px] capitalize text-gray-400">
                    {order.paymentMethod ||
                      "Payment pending"}
                  </p>
                </div>

                <Link
                  href={`/admin/orders/${order._id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                  View
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
          </section>
        </main>
      </div>
    </div>
  );
}