"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 select-none"
      aria-label="SMAGRO Home"
    >
      {/* Logo Image */}
      <div
        className="
          relative flex h-11 w-11 items-center justify-center
          overflow-hidden rounded-xl
          bg-white
          shadow-sm ring-1 ring-slate-200
          transition-all duration-300
          group-hover:scale-105
          group-hover:shadow-md
          dark:bg-slate-900
          dark:ring-slate-700
        "
      >
        <Image
          src="/logo.png"
          alt="SMAGRO Logo"
          width={44}
          height={44}
          priority
          className="h-full w-full object-contain p-1"
        />
      </div>

      {/* Brand Name */}
      <div className="flex flex-col leading-none">
        <span
          className="
            text-xl font-extrabold tracking-tight
            text-emerald-700
            transition-colors duration-300
            group-hover:text-emerald-600
            dark:text-emerald-400
            dark:group-hover:text-emerald-300
          "
        >
          SMAGRO
        </span>

        <span
          className="
            mt-1 text-[9px] font-semibold uppercase
            tracking-[0.18em]
            text-slate-500
            dark:text-slate-400
          "
        >
          Agro Health
        </span>
      </div>
    </Link>
  );
};

export default Logo;