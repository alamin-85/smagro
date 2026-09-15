"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Phone,
  Package,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { cartCount } = useCart();

  // Check logged-in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Navbar Auth Error:", error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setAccountOpen(false);
      setMobileOpen(false);

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="hidden bg-green-700 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <p>🌱 Quality products for better farming & livestock care</p>

          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className="transition hover:text-green-200"
            >
              Contact Support
            </Link>

            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              +880 1XXX-XXXXXX
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-5">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/">Home</NavLink>

            <NavLink href="/medicines">Medicines</NavLink>

            {/* Categories */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              >
                Categories

                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full mt-2 w-56 translate-y-2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <CategoryLink
                  href="/medicines?category=Poultry"
                  icon="🐔"
                  label="Poultry"
                />

                <CategoryLink
                  href="/medicines?category=Livestock"
                  icon="🐄"
                  label="Livestock"
                />

                <CategoryLink
                  href="/medicines?category=Fish"
                  icon="🐟"
                  label="Fish"
                />

                <CategoryLink
                  href="/medicines?category=Supplements"
                  icon="💊"
                  label="Supplements"
                />
              </div>
            </div>

            <NavLink href="/about">About</NavLink>

            <NavLink href="/contact">Contact</NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500 sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {authLoading ? (
              <div className="ml-1 hidden h-10 w-10 items-center justify-center sm:flex">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              </div>
            ) : user ? (
              <div className="relative ml-1 hidden sm:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition hover:border-green-200 hover:bg-green-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <User className="h-4 w-4" />
                  </div>

                  <div className="hidden max-w-[110px] text-left xl:block">
                    <p className="truncate text-xs font-medium text-gray-500">
                      Welcome
                    </p>

                    <p className="truncate text-sm font-bold text-gray-800">
                      {user.name || "Account"}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Account Dropdown */}
                {accountOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close account menu"
                      className="fixed inset-0 z-40 h-full w-full cursor-default"
                      onClick={() => setAccountOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                      {/* User Info */}
                      <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                            <User className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-gray-900">
                              {user.name || "User"}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {user.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <AccountLink
                          href="/account"
                          icon={<UserCircle className="h-4 w-4" />}
                          label="My Account"
                          onClick={() => setAccountOpen(false)}
                        />

                        <AccountLink
                          href="/account/orders"
                          icon={<Package className="h-4 w-4" />}
                          label="My Orders"
                          onClick={() => setAccountOpen(false)}
                        />

                        {user.role === "admin" && (
                          <AccountLink
                            href="/admin"
                            icon={<LayoutDashboard className="h-4 w-4" />}
                            label="Admin Dashboard"
                            onClick={() => setAccountOpen(false)}
                          />
                        )}

                        <div className="my-2 border-t border-gray-100" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}

                          {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 sm:flex"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Box */}
        {searchOpen && (
          <div className="border-t border-gray-100 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search medicines, supplements, products..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <nav className="space-y-1">
              <MobileNavLink
                href="/"
                onClick={closeMobile}
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                href="/medicines"
                onClick={closeMobile}
              >
                Medicines
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Poultry"
                onClick={closeMobile}
              >
                🐔 Poultry
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Livestock"
                onClick={closeMobile}
              >
                🐄 Livestock
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Fish"
                onClick={closeMobile}
              >
                🐟 Fish
              </MobileNavLink>

              <MobileNavLink
                href="/about"
                onClick={closeMobile}
              >
                About
              </MobileNavLink>

              <MobileNavLink
                href="/contact"
                onClick={closeMobile}
              >
                Contact
              </MobileNavLink>

              {/* Mobile Account */}
              {authLoading ? (
                <div className="mt-3 flex items-center justify-center rounded-xl bg-gray-50 px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                </div>
              ) : user ? (
                <div className="mt-3 space-y-1 rounded-2xl border border-green-100 bg-green-50/50 p-2">
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                      <User className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">
                        {user.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>

                  <MobileAccountLink
                    href="/account"
                    icon={<UserCircle className="h-4 w-4" />}
                    label="My Account"
                    onClick={closeMobile}
                  />

                  <MobileAccountLink
                    href="/account/orders"
                    icon={<Package className="h-4 w-4" />}
                    label="My Orders"
                    onClick={closeMobile}
                  />

                  {user.role === "admin" && (
                    <MobileAccountLink
                      href="/admin"
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      label="Admin Dashboard"
                      onClick={closeMobile}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}

                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <User className="h-4 w-4" />
                  Login / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* Desktop Nav Link */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
    >
      {children}
    </Link>
  );
}

/* Category Link */
function CategoryLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

/* Account Dropdown Link */
function AccountLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
    >
      {icon}
      {label}
    </Link>
  );
}

/* Mobile Account Link */
function MobileAccountLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-green-700"
    >
      {icon}
      {label}
    </Link>
  );
}

/* Mobile Nav Link */
function MobileNavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
    >
      {children}
    </Link>
  );
}

