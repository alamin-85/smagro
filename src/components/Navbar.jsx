"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Phone,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">

      {/* Top Announcement Bar */}
      <div className="hidden bg-green-700 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">

          <p>
            🌱 Quality products for better farming & livestock care
          </p>

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

            <NavLink href="/">
              Home
            </NavLink>

            <NavLink href="/medicines">
              Medicines
            </NavLink>

            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700">
                Categories
                <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </button>

              {/* Dropdown */}
              <div className="invisible absolute left-0 top-full mt-2 w-56 translate-y-2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                <Link
                  href="/medicines?category=Poultry"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  🐔 Poultry
                </Link>

                <Link
                  href="/medicines?category=Livestock"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  🐄 Livestock
                </Link>

                <Link
                  href="/medicines?category=Fish"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  🐟 Fish
                </Link>

                <Link
                  href="/medicines?category=Supplements"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  💊 Supplements
                </Link>

              </div>
            </div>

            <NavLink href="/about">
              About
            </NavLink>

            <NavLink href="/contact">
              Contact
            </NavLink>

          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500 sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>

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

            {/* Login */}
            <Link
              href="/login"
              className="ml-1 hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 sm:flex"
            >
              <User className="h-4 w-4" />
              Login
            </Link>

            {/* Mobile Menu */}
            <button
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
                onClick={() => setMobileOpen(false)}
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                href="/medicines"
                onClick={() => setMobileOpen(false)}
              >
                Medicines
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Poultry"
                onClick={() => setMobileOpen(false)}
              >
                🐔 Poultry
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Livestock"
                onClick={() => setMobileOpen(false)}
              >
                🐄 Livestock
              </MobileNavLink>

              <MobileNavLink
                href="/medicines?category=Fish"
                onClick={() => setMobileOpen(false)}
              >
                🐟 Fish
              </MobileNavLink>

              <MobileNavLink
                href="/about"
                onClick={() => setMobileOpen(false)}
              >
                About
              </MobileNavLink>

              <MobileNavLink
                href="/contact"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </MobileNavLink>

              {/* Mobile Login */}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                <User className="h-4 w-4" />
                Login / Register
              </Link>

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


/* Mobile Nav Link */
function MobileNavLink({
  href,
  children,
  onClick,
}) {
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