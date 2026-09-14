
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  ChevronRight,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          window.location.href = "/login";
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Account user error:",
          error
        );

        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-green-600"
          />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-700 to-green-500">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <User size={38} />
            </div>

            <div className="text-white">
              <p className="text-sm font-medium text-green-100">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-black md:text-4xl">
                {user?.name || "Customer"}
              </h1>

              <p className="mt-2 text-sm text-green-50">
                Manage your SMAGRO account and orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {/* User Info */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-black text-gray-900">
                Account Information
              </h2>

              <p className="text-xs text-gray-500">
                Your personal account details
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400">
                Name
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {user?.name || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all font-bold text-gray-900">
                {user?.email || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400">
                Phone
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {user?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Menu */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* My Orders */}
          <Link
            href="/account/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
                <Package size={23} />
              </div>

              <ChevronRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600"
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-gray-900">
              My Orders
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              View your orders, track status and check
              order details.
            </p>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                <Heart size={23} />
              </div>

              <ChevronRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-red-500"
              />
            </div>

            <h3 className="mt-5 text-lg font-black text-gray-900">
              Wishlist
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              View products you have saved for later.
            </p>
          </Link>

          {/* Addresses */}
          <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:border-blue-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={23} />
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase text-gray-500">
                Coming Soon
              </span>
            </div>

            <h3 className="mt-5 text-lg font-black text-gray-900">
              Saved Addresses
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Save and manage your delivery addresses.
            </p>
          </div>

          {/* Profile */}
          <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:border-purple-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <User size={23} />
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase text-gray-500">
                Coming Soon
              </span>
            </div>

            <h3 className="mt-5 text-lg font-black text-gray-900">
              Profile Settings
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Update your name, phone and account details.
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loggingOut ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={17} />
                Logout
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
}

