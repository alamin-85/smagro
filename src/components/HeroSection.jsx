import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left Content */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Smart Agriculture Solutions
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Better Care.
            <span className="block text-green-600">
              Better Growth.
            </span>
            Better Farming.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            Discover quality agricultural, poultry, livestock and
            fish-care products designed to help you maintain healthier
            animals and improve farm productivity.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/medicines"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              Shop Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
            >
              Learn More
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniBenefit
              icon={<CheckCircle2 />}
              title="Quality"
              text="Trusted products"
            />

            <MiniBenefit
              icon={<Truck />}
              title="Delivery"
              text="Fast & reliable"
            />

            <MiniBenefit
              icon={<ShieldCheck />}
              title="Secure"
              text="Safe shopping"
            />
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-xl">
          {/* Main Image/Visual Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-green-600 to-emerald-800 p-3 shadow-2xl shadow-green-900/20">
            <div className="relative min-h-[390px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-900">
              {/* Decorative circles */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="flex h-42 w-42 items-center justify-center rounded-full bg-white/20 text-white">
                  {/* <Logo/> */}
                  <img src="/logo.png" alt="SMAGRO" className="rounded-full h-full w-full object-contain" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-100">
                  {/* SMAGRO */}
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                  Smart Agriculture
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-green-100">
                  Quality solutions for poultry, livestock, fish and
                  modern farming.
                </p>
              </div>

              {/* Floating Product Card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
                    💊
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-medium text-gray-500">
                      Featured Product
                    </p>

                    <h3 className="truncate font-bold text-gray-900">
                      AMINO MIX
                    </h3>

                    <p className="text-sm text-green-600">
                      Poultry & Livestock
                    </p>
                  </div>

                  <Link
                    href="/medicines/amino-mix"
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stat */}
          <div className="absolute -right-2 top-10 hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:block lg:-right-6">
            <p className="text-2xl font-extrabold text-green-600">
              100%
            </p>
            <p className="text-xs font-semibold text-gray-500">
              Quality Focus
            </p>
          </div>

          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xl sm:block lg:-left-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Trusted Shopping
                </p>
                <p className="text-xs text-gray-500">
                  Safe & reliable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniBenefit({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{text}</p>
      </div>
    </div>
  );
}