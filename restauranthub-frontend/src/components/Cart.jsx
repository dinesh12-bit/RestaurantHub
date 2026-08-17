import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Cart.css";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD CART
    // =========================

    const loadCart = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!token || !user?.userId) {

                setCart({
                    items: [],
                    totalAmount: 0
                });

                return;
            }

            const response = await api.get(
                `/cart/${user.userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCart(response.data);

        } catch (err) {

            console.error(
                "Failed to load cart:",
                err
            );

            if (err.response?.status === 404) {

                setCart({
                    items: [],
                    totalAmount: 0
                });

            } else {

                setError(
                    "Unable to load your cart."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCart();

    }, []);


    // =========================
    // USER ID
    // =========================

    const getUserId = () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        return user?.userId;

    };


    // =========================
    // TOKEN
    // =========================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity = async (
        foodId,
        quantity
    ) => {

        if (quantity < 1) {
            return;
        }

        try {

            const userId = getUserId();
            const token = getToken();

            if (!userId || !token) {

                navigate("/login");

                return;
            }

            const response = await api.patch(
                `/cart/${userId}/${foodId}`,
                null,
                {
                    params: {
                        quantity
                    },

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCart(response.data);

        } catch (err) {

            console.error(
                "Failed to update quantity:",
                err
            );

        }

    };


    // =========================
    // REMOVE ITEM
    // =========================

    const removeItem = async (foodId) => {

        try {

            const userId = getUserId();
            const token = getToken();

            if (!userId || !token) {

                navigate("/login");

                return;
            }

            await api.delete(
                `/cart/${userId}/${foodId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await loadCart();

        } catch (err) {

            console.error(
                "Failed to remove item:",
                err
            );

        }

    };


    // =========================
    // CLEAR CART
    // =========================

    const clearCart = async () => {

        try {

            const userId = getUserId();
            const token = getToken();

            if (!userId || !token) {

                navigate("/login");

                return;
            }

            await api.delete(
                `/cart/${userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCart({
                items: [],
                totalAmount: 0
            });

        } catch (err) {

            console.error(
                "Failed to clear cart:",
                err
            );

        }

    };


    // =========================
    // CHECKOUT
    // =========================

    const handleCheckout = () => {

        navigate("/checkout");

    };


    // =========================
    // TOTAL ITEMS
    // =========================

    const totalItems =
        cart?.items?.reduce(
            (total, item) =>
                total + item.quantity,
            0
        ) || 0;


    // =========================
    // DELIVERY FEE
    // =========================

    const deliveryFee =
        totalItems > 0 ? 40 : 0;


    // =========================
    // SUBTOTAL
    // =========================

    const subtotal =
        Number(cart?.totalAmount || 0);


    // =========================
    // GRAND TOTAL
    // =========================

    const grandTotal =
        subtotal + deliveryFee;


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="cart-page">

                <div className="cart-loading">
                    Loading your cart...
                </div>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="cart-page">

                <div className="cart-error">
                    {error}
                </div>

            </div>
        );

    }


    // =========================
    // EMPTY CART
    // =========================

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        return (
            <div className="cart-page">

                <div className="cart-container">

                    <div className="cart-header">

                        <div>

                            <p className="cart-label">
                                YOUR ORDER
                            </p>

                            <h1>
                                My <span>Cart</span>
                            </h1>

                            <p className="cart-description">
                                Your selected food items
                                will appear here.
                            </p>

                        </div>

                    </div>


                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            <span></span>
                        </div>

                        <h2>
                            Your cart is empty
                        </h2>

                        <p>
                            Add some delicious food
                            to your cart and place
                            your order.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/menu")
                            }
                        >
                            Browse Menu
                        </button>

                    </div>

                </div>

            </div>
        );

    }


    // =========================
    // CART PAGE
    // =========================

    return (

        <div className="cart-page">

            <div className="cart-container">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="cart-header">

                    <div>

                        <p className="cart-label">
                            YOUR ORDER
                        </p>

                        <h1>
                            My <span>Cart</span>
                        </h1>

                        <p className="cart-description">
                            Review your selected
                            food before checkout.
                        </p>

                    </div>


                    <div className="cart-item-count">
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}
                    </div>

                </div>


                {/* =========================
                    CART CONTENT
                ========================= */}

                <div className="cart-layout">


                    {/* =========================
                        LEFT FOOD LIST
                    ========================= */}

                    <section className="cart-items-section">

                        <div className="cart-section-title">
                            <span>YOUR ITEMS</span>

                            <strong>
                                {cart.items.length}{" "}
                                {cart.items.length === 1
                                    ? "dish"
                                    : "dishes"}
                            </strong>
                        </div>


                        {cart.items.map((item) => (

                            <div
                                className="cart-item"
                                key={item.foodId}
                            >


                                {/* IMAGE */}

                                <div className="cart-food-image-wrapper">

                                    <img
                                        src={
                                            item.imageUrl ||
                                            "/images/food-placeholder.png"
                                        }
                                        alt={item.foodName}
                                        className="cart-food-image"
                                    />

                                </div>


                                {/* DETAILS */}

                                <div className="cart-food-info">

                                    <h3>
                                        {item.foodName}
                                    </h3>

                                    <p className="cart-food-price">
                                        ₹
                                        {Number(
                                            item.price || 0
                                        ).toFixed(0)}
                                    </p>


                                    <div className="cart-quantity">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.foodId,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                item.quantity <= 1
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.foodId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                {/* ITEM TOTAL */}

                                <div className="cart-item-total">

                                    <strong>
                                        ₹
                                        {Number(
                                            item.subtotal || 0
                                        ).toFixed(0)}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() =>
                                            removeItem(
                                                item.foodId
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </section>


                    {/* =========================
                        MY CART / SUMMARY
                    ========================= */}

                    <aside className="cart-summary">

                        <div className="summary-heading">

                            <div>

                                <p>
                                    ORDER SUMMARY
                                </p>

                                <h2>
                                    My <span>Cart</span>
                                </h2>

                            </div>

                            <strong>
                                {totalItems} items
                            </strong>

                        </div>


                        {/* MINI CART ITEMS */}

                        <div className="summary-cart-items">

                            {cart.items.map((item) => (

                                <div
                                    className="summary-cart-item"
                                    key={item.foodId}
                                >

                                    <div className="summary-food-image">

                                        <img
                                            src={
                                                item.imageUrl ||
                                                "/images/food-placeholder.png"
                                            }
                                            alt={item.foodName}
                                        />

                                    </div>


                                    <div className="summary-food-info">

                                        <h4>
                                            {item.foodName}
                                        </h4>

                                        <p>
                                            ₹
                                            {Number(
                                                item.price || 0
                                            ).toFixed(0)}
                                        </p>

                                        <div className="summary-quantity">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.foodId,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.foodId,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    <strong className="summary-food-total">
                                        ₹
                                        {Number(
                                            item.subtotal || 0
                                        ).toFixed(0)}
                                    </strong>

                                </div>

                            ))}

                        </div>


                        {/* PRICE DETAILS */}

                        <div className="summary-items">

                            <div>

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toFixed(0)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Delivery Fee
                                </span>

                                <strong>
                                    ₹
                                    {deliveryFee}
                                </strong>

                            </div>

                        </div>


                        {/* TOTAL */}

                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {grandTotal.toFixed(0)}
                            </strong>

                        </div>


                        {/* CHECKOUT */}

                        <button
                            type="button"
                            className="checkout-button"
                            onClick={handleCheckout}
                        >

                            <span>
                                Checkout
                            </span>

                            <span>
                                →
                            </span>

                        </button>


                        {/* CLEAR */}

                        <button
                            type="button"
                            className="clear-cart-button"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>


                        <p className="secure-text">
                            Secure &amp; safe payment
                        </p>

                    </aside>

                </div>

            </div>

        </div>

    );

}

export default Cart;