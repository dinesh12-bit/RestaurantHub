import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./Payment.css";

function Payment() {

    const navigate = useNavigate();
    const location = useLocation();

    const orderId = location.state?.orderId;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // LOAD RAZORPAY SCRIPT
    // =====================================================

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            if (
                document.getElementById(
                    "razorpay-checkout-js"
                )
            ) {
                resolve(true);
                return;
            }

            const script =
                document.createElement("script");

            script.id =
                "razorpay-checkout-js";

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };


    // =====================================================
    // START PAYMENT
    // =====================================================

    const startPayment = async () => {

        if (loading) {
            return;
        }

        try {

            setLoading(true);
            setError("");
            setMessage("");


            // ---------------------------------------------
            // CHECK ORDER ID
            // ---------------------------------------------

            if (!orderId) {

                setError(
                    "Order ID not found. Please place the order again."
                );

                setLoading(false);
                return;
            }


            // ---------------------------------------------
            // LOAD RAZORPAY
            // ---------------------------------------------

            const razorpayLoaded =
                await loadRazorpayScript();

            if (!razorpayLoaded) {

                setError(
                    "Unable to load Razorpay. Please check your internet connection."
                );

                setLoading(false);
                return;
            }


            // ---------------------------------------------
            // CREATE RAZORPAY ORDER
            // ---------------------------------------------

            console.log(
                "Creating payment for order:",
                orderId
            );

            const response =
                await api.post(
                    `/payment/create/${orderId}`
                );

            console.log(
                "PAYMENT CREATE RESPONSE:",
                response.data
            );

            const paymentData =
                response.data;


            // ---------------------------------------------
            // VALIDATE PAYMENT RESPONSE
            // ---------------------------------------------

            if (
                !paymentData ||
                !paymentData.key ||
                !paymentData.razorpayOrderId ||
                !paymentData.amount
            ) {

                throw new Error(
                    "Invalid payment response from server."
                );
            }


            // ---------------------------------------------
            // RAZORPAY OPTIONS
            // ---------------------------------------------

            const options = {

                key: paymentData.key,

                amount:
                paymentData.amount,

                currency:
                    paymentData.currency || "INR",

                name:
                    "RestaurantHub",

                description:
                    `Payment for Order #${orderId}`,

                order_id:
                paymentData.razorpayOrderId,


                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                handler: async function (
                    razorpayResponse
                ) {

                    try {

                        console.log(
                            "===== RAZORPAY SUCCESS ====="
                        );

                        console.log(
                            "Razorpay Order ID:",
                            razorpayResponse.razorpay_order_id
                        );

                        console.log(
                            "Razorpay Payment ID:",
                            razorpayResponse.razorpay_payment_id
                        );

                        console.log(
                            "Razorpay Signature:",
                            razorpayResponse.razorpay_signature
                        );


                        setLoading(true);

                        setError("");

                        setMessage(
                            "Payment successful. Verifying payment..."
                        );


                        // ---------------------------------
                        // VERIFY PAYMENT
                        // ---------------------------------

                        const verifyResponse =
                            await api.post(
                                "/payment/verify",
                                {
                                    razorpayOrderId:
                                    razorpayResponse
                                        .razorpay_order_id,

                                    razorpayPaymentId:
                                    razorpayResponse
                                        .razorpay_payment_id,

                                    razorpaySignature:
                                    razorpayResponse
                                        .razorpay_signature,

                                    orderId:
                                        Number(orderId)
                                }
                            );


                        console.log(
                            "VERIFY RESPONSE:",
                            verifyResponse.data
                        );


                        // ---------------------------------
                        // CHECK BACKEND RESPONSE
                        // ---------------------------------

                        const verifyMessage =
                            typeof verifyResponse.data === "string"
                                ? verifyResponse.data
                                : verifyResponse.data?.message;


                        if (
                            verifyMessage ===
                            "Payment verified successfully"
                        ) {

                            setMessage(
                                "Payment verified successfully! Order confirmed."
                            );

                            setTimeout(() => {

                                navigate("/orders");

                            }, 1500);

                        } else {

                            setError(
                                verifyMessage ||
                                "Payment verification failed."
                            );

                            setMessage("");
                        }


                    } catch (error) {

                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        setMessage("");

                        setError(
                            error.response?.data?.message ||
                            error.response?.data ||
                            "Payment verification failed."
                        );

                    } finally {

                        setLoading(false);
                    }
                },


                // -----------------------------------------
                // PREFILL
                // -----------------------------------------

                prefill: {

                    name: "",

                    email: "",

                    contact: ""
                },


                // -----------------------------------------
                // NOTES
                // -----------------------------------------

                notes: {

                    orderId:
                        String(orderId)
                },


                // -----------------------------------------
                // THEME
                // -----------------------------------------

                theme: {

                    color:
                        "#ff6900"
                },


                // -----------------------------------------
                // MODAL
                // -----------------------------------------

                modal: {

                    ondismiss: function () {

                        setLoading(false);

                        setMessage(
                            "Payment cancelled."
                        );
                    }
                }
            };


            // ---------------------------------------------
            // CREATE RAZORPAY INSTANCE
            // ---------------------------------------------

            const razorpay =
                new window.Razorpay(
                    options
                );


            // ---------------------------------------------
            // PAYMENT FAILED
            // ---------------------------------------------

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "===== RAZORPAY PAYMENT FAILED ====="
                    );

                    console.error(
                        response
                    );

                    setError(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setMessage("");

                    setLoading(false);
                }
            );


            // ---------------------------------------------
            // OPEN RAZORPAY
            // ---------------------------------------------

            razorpay.open();

            setLoading(false);


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to start payment."
            );

            setMessage("");

            setLoading(false);
        }
    };


    // =====================================================
    // NO ORDER ID
    // =====================================================

    if (!orderId) {

        return (

            <div className="payment-page">

                <div className="payment-container">

                    <div className="payment-error-card">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Order Not Found
                        </h2>

                        <p>
                            We could not find the order for payment.
                        </p>

                        <button
                            className="error-back-button"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            Go to My Orders
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAYMENT PAGE
    // =====================================================

    return (

        <div className="payment-page">

            <div className="payment-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="payment-header">

                    <div className="payment-label">
                        RESTAURANTHUB
                    </div>

                    <h1>
                        Complete <span>Payment</span>
                    </h1>

                    <p>
                        Securely complete your order payment
                    </p>

                </div>


                {/* =================================================
                    MAIN PAYMENT CARD
                ================================================= */}

                <div className="payment-card">


                    {/* TOP ICON */}

                    <div className="payment-card-icon">
                        <span>₹</span>
                    </div>


                    {/* ORDER INFO */}

                    <div className="payment-card-header">

                        <h2>
                            Order Payment
                        </h2>

                        <div className="payment-order-id">
                            Order <strong>#{orderId}</strong>
                        </div>

                    </div>


                    {/* =================================================
                        SECURE PAYMENT BOX
                    ================================================= */}

                    <div className="payment-security-box">

                        <div className="security-icon">
                            ✓
                        </div>

                        <div className="security-content">

                            <strong>
                                Secure Payment
                            </strong>

                            <p>
                                Your payment is securely processed by Razorpay.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="payment-message error">
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {message && (

                        <div className="payment-message success">
                            {message}
                        </div>

                    )}


                    {/* =================================================
                        PAY BUTTON
                    ================================================= */}

                    <button
                        className="pay-now-button"
                        onClick={startPayment}
                        disabled={loading}
                    >

                        <span>
                            {loading
                                ? "Processing..."
                                : "Pay Securely"
                            }
                        </span>

                        {!loading && (
                            <span className="button-arrow">
                                →
                            </span>
                        )}

                    </button>


                    {/* =================================================
                        BACK BUTTON
                    ================================================= */}

                    <button
                        className="back-orders-button"
                        onClick={() =>
                            navigate("/orders")
                        }
                        disabled={loading}
                    >
                        ← Back to Orders
                    </button>


                    {/* =================================================
                        PAYMENT METHODS
                    ================================================= */}

                    <div className="payment-methods">

                        <div className="payment-method">
                            <span className="method-icon">
                                ✓
                            </span>
                            <span>Secure</span>
                        </div>

                        <div className="payment-method">
                            <span className="method-icon">
                                ▭
                            </span>
                            <span>Cards</span>
                        </div>

                        <div className="payment-method">
                            <span className="method-icon">
                                U
                            </span>
                            <span>UPI</span>
                        </div>

                        <div className="payment-method">
                            <span className="method-icon">
                                ▦
                            </span>
                            <span>Net Banking</span>
                        </div>

                    </div>


                    <div className="payment-footer">
                        Payments are securely handled by Razorpay
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;