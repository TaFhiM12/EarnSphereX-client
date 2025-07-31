import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../Components/Loading";
import useUserRole from "../../hooks/userUserRole";

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { userInfo } = useUserRole();
  const role = userInfo?.role || "user";
  const { data: paymentsCardData = {}, isPending } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/pay/coins/${id}`);
      return response.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        setError(error.message);
      } else {
        setError("");
        const res = await axiosSecure.post("/create-payment-intent", {
          amountInCents: paymentsCardData.price * 100,
          parcelId: id,
        });
        const clientSecret = res.data.clientSecret;
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            },
          },
        });

        if (result.error) {
          setError(result.error.message);
        } else {
          setError("");
          if (result.paymentIntent.status === "succeeded") {
            // mark parcel paid
            const paymentData = {
              paymentId: id,
              email: user?.email,
              coins : paymentsCardData.coins,
              amount: paymentsCardData.price,
              transactionId: result.paymentIntent.id,
              paymentMethod: result.paymentIntent.payment_method_types[0],
            };

            const paymentRes = await axiosSecure.post("/payments", paymentData);
            // console.log(paymentRes.data.acknowledged);
            if (paymentRes.data.success && paymentRes.data.acknowledged) {
              await Swal.fire({
                icon: "success",
                title: "Payment Successfully",
                html: `<strong>Transaction ID</strong><code>${result.paymentIntent.id}</code>`,
                confirmButtonText: "Go to Dashboard",
              });
              navigate(`/dashboard/${role}`);
            }
          }
        }
      }
    } catch (error) {
      setError("Payment processing failed");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-xl p-8 shadow-lg w-full max-w-md mx-auto border border-gray-100"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
          <p className="text-gray-600">
            Total amount:{" "}
            <span className="font-semibold">${paymentsCardData.price.toFixed(2)}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:border-primary transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    "::placeholder": { color: "#9ca3af" },
                    ":-webkit-autofill": { color: "#1e40af" },
                  },
                  invalid: { color: "#dc2626" },
                },
                hidePostalCode: true,
              }}
              className="p-2"
            />
          </div>

          <button
            className={`btn w-full ${
              loading ? "btn-disabled" : "btn-primary bg-gradient-to-b from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
            } transition-all`}
            type="submit"
            disabled={!stripe || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Pay ${paymentsCardData.price.toFixed(2)}
              </span>
            )}
          </button>

          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-teal-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Encrypted Data
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;