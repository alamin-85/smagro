"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Copy,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, cartTotal, clearCart } = useCart();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [transactionId, setTransactionId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PAYMENT METHODS
  // ==========================================

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setPaymentLoading(true);
        setPaymentError("");

        const response = await fetch(
          `${API_URL}/api/payments/methods`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load payment methods."
          );
        }

        setPaymentMethods(data.methods || []);
      } catch (error) {
        console.error("Payment methods error:", error);

        setPaymentError(
          "Payment methods could not be loaded. Please try again."
        );
      } finally {
        setPaymentLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SELECT PAYMENT
  // ==========================================

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);

    if (method === "cod") {
      setTransactionId("");
    }

    setError("");
  };

  // ==========================================
  // COPY NUMBER
  // ==========================================

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      alert("Payment number copied!");
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  // ==========================================
  // CREATE PAYMENT REQUEST
  // ==========================================

  const createPaymentRequest = async () => {
    const response = await fetch(
      `${API_URL}/api/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: selectedPayment,
          amount: cartTotal,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to create payment request."
      );
    }

    return data.payment;
  };

  // ==========================================
  // SUBMIT ORDER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your city or district.");
      return;
    }

    // Transaction ID required for online payment
    if (
      selectedPayment !== "cod" &&
      !transactionId.trim()
    ) {
      setError(
        "Please enter your payment Transaction ID."
      );
      return;
    }

    try {
      setSubmitting(true);

      let paymentStatus = "pending";
      let paymentData = null;

      // ==========================================
      // ONLINE PAYMENT
      // ==========================================

      if (selectedPayment !== "cod") {
        paymentData = await createPaymentRequest();

        paymentStatus = "pending";
      }

      // ==========================================
      // PAYMENT METHOD NAME
      // ==========================================

      let paymentMethodName = "Cash on Delivery";

      if (selectedPayment !== "cod") {
        const selectedMethod = paymentMethods.find(
          (method) => method.id === selectedPayment
        );

        paymentMethodName =
          selectedMethod?.name || selectedPayment;
      }

      // ==========================================
      // ORDER DATA
      // ==========================================

      const orderData = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: "",
        },

        items: cart.map((item) => ({
          productId:
            item._id ||
            item.id ||
            item.productId ||
            null,

          name: item.name,

          price: Number(item.price) || 0,

          quantity: Number(item.quantity) || 1,

          image: item.image || "",
        })),

        subtotal: Number(cartTotal) || 0,

        deliveryCharge: 0,

        total: Number(cartTotal) || 0,

        paymentMethod: selectedPayment,

        paymentMethodName,

        paymentStatus,

        transactionId:
          selectedPayment === "cod"
            ? ""
            : transactionId.trim(),

        paymentDetails:
          paymentData || null,

        status: "pending",

        shippingAddress:
          `${formData.address.trim()}, ${formData.city.trim()}`,

        notes: formData.notes.trim(),

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      };

      // ==========================================
      // CREATE ORDER
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      // ==========================================
      // SAVE LAST ORDER
      // ==========================================

      localStorage.setItem(
        "smagro-last-order",
        JSON.stringify(data.order)
      );

      // ==========================================
      // CLEAR CART
      // ==========================================

      clearCart();

      // ==========================================
      // SUCCESS
      // ==========================================

      router.push("/order-success");
    } catch (error) {
      console.error("Checkout error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-6">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500">
              Add some products before checking out.
            </p>

            <Link
              href="/medicines"
              className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Browse Products
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedPayment
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="mb-8">
            <p className="text-sm font-semibold text-green-600">
              SMAGRO CHECKOUT
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">
              Complete Your Order
            </h1>

            <p className="mt-2 text-gray-500">
              Provide your delivery information and select
              your preferred payment method.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* =====================================
                  LEFT
              ====================================== */}

              <div className="space-y-6 lg:col-span-2">
                {/* CUSTOMER INFORMATION */}

                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Customer Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter your delivery information.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* NAME */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Mobile Number
                      </label>

                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="01XXXXXXXXX"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    {/* ADDRESS */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Delivery Address
                      </label>

                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />

                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows={4}
                          placeholder="House, Road, Area..."
                          className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    {/* CITY */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        City / District
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Dhaka"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    {/* NOTES */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Order Notes
                      </label>

                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </section>

                {/* =====================================
                    PAYMENT
                ====================================== */}

                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Payment Method
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Choose how you want to pay.
                    </p>
                  </div>

                  {/* COD */}

                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentChange("cod")
                    }
                    className={`mb-3 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selectedPayment === "cod"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selectedPayment === "cod"
                          ? "border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPayment === "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when your order arrives.
                      </p>
                    </div>
                  </button>

                  {/* ONLINE METHODS */}

                  {paymentLoading ? (
                    <div className="flex items-center justify-center rounded-xl border border-gray-200 p-6">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin text-green-600" />

                      <span className="text-sm text-gray-500">
                        Loading payment methods...
                      </span>
                    </div>
                  ) : paymentError ? (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                      {paymentError}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          type="button"
                          key={method.id}
                          onClick={() =>
                            handlePaymentChange(method.id)
                          }
                          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                            selectedPayment === method.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                selectedPayment ===
                                method.id
                                  ? "border-green-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPayment ===
                                method.id && (
                                <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {method.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {method.number}
                              </p>
                            </div>
                          </div>

                          {selectedPayment ===
                            method.id && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* PAYMENT INSTRUCTIONS */}

                  {selectedPayment !== "cod" &&
                    selectedMethod && (
                      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-green-800">
                              {selectedMethod.name} Payment Number
                            </p>

                            <p className="mt-1 text-2xl font-bold tracking-wide text-green-900">
                              {selectedMethod.number}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              copyNumber(
                                selectedMethod.number
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        </div>

                        <div className="mt-5 space-y-2 text-sm text-green-800">
                          <p>
                            1. Open your{" "}
                            <strong>
                              {selectedMethod.name}
                            </strong>{" "}
                            app.
                          </p>

                          <p>
                            2. Send{" "}
                            <strong>
                              ৳{Number(cartTotal).toFixed(2)}
                            </strong>{" "}
                            to the number above.
                          </p>

                          <p>
                            3. Complete the payment and save
                            your Transaction ID.
                          </p>

                          <p>
                            4. Enter the Transaction ID below.
                          </p>
                        </div>

                        {/* TRANSACTION ID */}

                        <div className="mt-5">
                          <label className="mb-2 block text-sm font-semibold text-green-900">
                            Transaction ID
                          </label>

                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) =>
                              setTransactionId(
                                e.target.value
                              )
                            }
                            placeholder="Enter your Transaction ID"
                            className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                      </div>
                    )}
                </section>
              </div>

              {/* =====================================
                  RIGHT - ORDER SUMMARY
              ====================================== */}

              <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={
                        item._id ||
                        item.id ||
                        item.productId
                      }
                      className="flex justify-between gap-4 border-b border-gray-100 pb-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-semibold text-gray-900">
                        ৳
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>

                    <span>
                      ৳{Number(cartTotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>

                    <span>Free</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-4 text-lg font-bold">
                    <span>Total</span>

                    <span className="text-green-700">
                      ৳{Number(cartTotal).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                  By placing this order, you agree to
                  SMAGRO's order and payment terms.
                </p>
              </aside>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}