import { useEffect, useState } from "react";
import api from "../services/api";
import "./Offers.css";

function Offers() {

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState("");


    // =====================================================
    // LOAD COUPONS
    // =====================================================

    useEffect(() => {
        loadCoupons();
    }, []);


    const loadCoupons = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/coupons");

            console.log(
                "Coupons from backend:",
                response.data
            );

            const now = new Date();

            const validCoupons =
                (response.data || []).filter(coupon => {

                    const isActive =
                        coupon.active === true;

                    const notExpired =
                        !coupon.expiryDate ||
                        new Date(coupon.expiryDate) > now;

                    return isActive && notExpired;
                });

            setCoupons(validCoupons);

        } catch (error) {

            console.error(
                "Failed to load offers:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // COPY COUPON
    // =====================================================

    const copyCode = async (code) => {

        try {

            await navigator.clipboard.writeText(code);

            setCopiedCode(code);

            setTimeout(() => {

                setCopiedCode(current =>
                    current === code
                        ? ""
                        : current
                );

            }, 1500);

        } catch (error) {

            console.error(
                "Failed to copy coupon:",
                error
            );

        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <main className="offers-page">

                <div className="offers-container">

                    <div className="offers-loading">
                        Loading offers...
                    </div>

                </div>

            </main>

        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="offers-page">

            <div className="offers-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="offers-header">

                    <p className="offers-label">
                        RESTAURANTHUB OFFERS
                    </p>

                    <h1>
                        Exclusive <span>Offers</span>
                    </h1>

                    <p className="offers-description">
                        Save more on your favourite food with
                        our latest discount offers.
                    </p>

                </section>


                {/* =================================================
                    NO OFFERS
                ================================================= */}

                {coupons.length === 0 ? (

                    <section className="offers-empty">

                        <div className="offers-empty-mark">
                            %
                        </div>

                        <h2>
                            No Offers Available
                        </h2>

                        <p>
                            There are no active offers available
                            right now. Please check again later.
                        </p>

                    </section>

                ) : (

                    <>

                        {/* =================================================
                            FEATURED OFFER
                        ================================================= */}

                        <section className="featured-offer">

                            <div className="featured-content">

                                <p className="featured-label">
                                    FEATURED OFFER
                                </p>

                                <h2>
                                    {coupons[0].discountPercentage}% OFF
                                </h2>

                                <p>
                                    Get a special discount on your
                                    next food order.
                                </p>


                                <div className="featured-code">

                                    <span>
                                        {coupons[0].code}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyCode(
                                                coupons[0].code
                                            )
                                        }
                                    >
                                        {copiedCode ===
                                        coupons[0].code
                                            ? "Copied"
                                            : "Copy Code"}
                                    </button>

                                </div>

                            </div>


                            <div className="featured-discount">

                                <strong>
                                    {coupons[0].discountPercentage}%
                                </strong>

                                <span>
                                    OFF
                                </span>

                            </div>

                        </section>


                        {/* =================================================
                            OFFERS
                        ================================================= */}

                        <section className="offers-section">

                            <div className="offers-section-header">

                                <div>

                                    <h2>
                                        Available Offers
                                    </h2>

                                    <p>
                                        Choose an offer and save on
                                        your order.
                                    </p>

                                </div>

                                <span>
                                    {coupons.length}
                                    {" "}
                                    {coupons.length === 1
                                        ? "Offer"
                                        : "Offers"}
                                </span>

                            </div>


                            <div className="offers-grid">

                                {coupons.map(coupon => (

                                    <article
                                        className="offer-card"
                                        key={coupon.id}
                                    >


                                        {/* TOP */}

                                        <div className="offer-card-top">

                                            <div className="offer-discount">

                                                <strong>
                                                    {coupon.discountPercentage}%
                                                    {" "}
                                                    OFF
                                                </strong>

                                                <span>
                                                    Special discount
                                                </span>

                                            </div>


                                            <span className="offer-status">
                                                ACTIVE
                                            </span>

                                        </div>


                                        {/* DESCRIPTION */}

                                        <p className="offer-card-description">

                                            Get{" "}
                                            {coupon.discountPercentage}%
                                            {" "}
                                            off on your order.
                                            Maximum discount up to{" "}
                                            ₹
                                            {Number(
                                                coupon.maxDiscountAmount || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                            .

                                        </p>


                                        {/* DETAILS */}

                                        <div className="offer-details">

                                            <div>

                                                <span>
                                                    Minimum Order
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        coupon.minimumOrderAmount || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Max Discount
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        coupon.maxDiscountAmount || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Usage Limit
                                                </span>

                                                <strong>
                                                    {coupon.usageLimit}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* EXPIRY */}

                                        <div className="offer-expiry">

                                            <span>
                                                Valid Till
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    coupon.expiryDate
                                                )}
                                            </strong>

                                        </div>


                                        {/* COUPON CODE */}

                                        <div className="offer-code-box">

                                            <div>

                                                <span>
                                                    Coupon Code
                                                </span>

                                                <strong>
                                                    {coupon.code}
                                                </strong>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyCode(
                                                        coupon.code
                                                    )
                                                }
                                            >
                                                {copiedCode ===
                                                coupon.code
                                                    ? "Copied"
                                                    : "Copy"}
                                            </button>

                                        </div>


                                        {/* APPLY */}

                                        <button
                                            type="button"
                                            className="apply-offer-btn"
                                            onClick={() =>
                                                copyCode(
                                                    coupon.code
                                                )
                                            }
                                        >

                                            {copiedCode ===
                                            coupon.code
                                                ? "Coupon Copied"
                                                : "Copy & Apply"}

                                            <span>
                                                →
                                            </span>

                                        </button>

                                    </article>

                                ))}

                            </div>

                        </section>


                        {/* =================================================
                            HOW TO USE
                        ================================================= */}

                        <section className="offer-info">

                            <div>

                                <h3>
                                    How to use an offer
                                </h3>

                                <p>
                                    Copy the coupon code and apply
                                    it during checkout to receive
                                    your discount.
                                </p>

                            </div>


                            <div className="offer-info-steps">

                                <div>

                                    <strong>
                                        01
                                    </strong>

                                    <span>
                                        Choose an offer
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        02
                                    </strong>

                                    <span>
                                        Copy coupon code
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        03
                                    </strong>

                                    <span>
                                        Apply at checkout
                                    </span>

                                </div>

                            </div>

                        </section>

                    </>

                )}

            </div>

        </main>
    );
}

export default Offers;