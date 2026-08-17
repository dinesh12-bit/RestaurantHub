import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [cancellingOrderId, setCancellingOrderId] =
        useState(null);


    // =====================================================
    // GET USER
    // =====================================================

    const getUser = () => {

        try {

            return JSON.parse(
                localStorage.getItem("user")
            );

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            return null;
        }
    };


    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const user = getUser();

            if (!user?.userId) {

                navigate("/login");

                return;
            }


            const response = await api.get(
                `/orders/${user.userId}`
            );


            console.log(
                "MY ORDERS:",
                response.data
            );


            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load orders:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load orders."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchOrders();

    }, []);


    // =====================================================
    // VIEW DETAILS
    // =====================================================

    const handleViewDetails = async (
        orderId
    ) => {

        try {

            setDetailsLoading(true);
            setError("");

            const response = await api.get(
                `/orders/details/${orderId}`
            );


            console.log(
                "ORDER DETAILS:",
                response.data
            );


            setSelectedOrder(
                response.data
            );


        } catch (error) {

            console.error(
                "Failed to load order details:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load order details."
            );


        } finally {

            setDetailsLoading(false);

        }

    };


    // =====================================================
    // CLOSE DETAILS
    // =====================================================

    const closeDetails = () => {

        setSelectedOrder(null);

    };


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async (
        orderId
    ) => {

        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );


        if (!confirmCancel) {
            return;
        }


        try {

            setCancellingOrderId(
                orderId
            );

            setError("");


            const response = await api.patch(
                `/orders/${orderId}/cancel`
            );


            console.log(
                "CANCELLED ORDER:",
                response.data
            );


            // Update order list

            setOrders((previousOrders) =>

                previousOrders.map((order) => {

                    if (
                        order.orderId === orderId
                    ) {

                        return response.data;

                    }

                    return order;

                })

            );


            // Update details modal

            if (
                selectedOrder &&
                selectedOrder.orderId === orderId
            ) {

                setSelectedOrder(
                    response.data
                );

            }


        } catch (error) {

            console.error(
                "Failed to cancel order:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to cancel order."
            );


        } finally {

            setCancellingOrderId(
                null
            );

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Date unavailable";
        }


        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "PLACED":
                return "status-placed";

            case "CONFIRMED":
                return "status-confirmed";

            case "PREPARING":
                return "status-preparing";

            case "OUT_FOR_DELIVERY":
                return "status-out";

            case "DELIVERED":
                return "status-delivered";

            case "CANCELLED":
                return "status-cancelled";

            default:
                return "status-placed";
        }

    };


    // =====================================================
    // PAYMENT STATUS CLASS
    // =====================================================

    const getPaymentStatusClass = (
        status
    ) => {

        if (status === "PAID") {
            return "payment-paid";
        }

        if (
            status === "FAILED"
        ) {
            return "payment-failed";
        }

        return "payment-pending";

    };


    // =====================================================
    // CAN CANCEL
    // =====================================================

    const canCancel = (order) => {

        return (
            order.orderStatus === "PLACED" ||
            order.orderStatus === "CONFIRMED"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="orders-page">

                <div className="orders-loading">

                    <div className="orders-spinner">
                    </div>

                    <p>
                        Loading your orders...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="orders-page">

            <div className="orders-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="orders-header">

                    <div>

                        <h1>
                            My <span>Orders</span>
                        </h1>

                        <p>
                            Track and manage your
                            recent orders
                        </p>

                    </div>


                    <div className="orders-header-actions">

                        <button
                            className="refresh-orders-btn"
                            onClick={fetchOrders}
                        >
                            ↻ Refresh
                        </button>


                        <button
                            className="continue-shopping-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            ← Continue Shopping
                        </button>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="orders-error">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {orders.length === 0 ? (

                    <div className="orders-empty">

                        <div className="orders-empty-icon">
                            📦
                        </div>

                        <h2>
                            No Orders Yet
                        </h2>

                        <p>
                            You haven't placed any
                            orders yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Start Ordering
                        </button>

                    </div>

                ) : (

                    <div className="orders-list">

                        {orders.map((order) => (

                            <div
                                className="order-card"
                                key={order.orderId}
                            >


                                {/* =================================================
                                    ORDER HEADER
                                ================================================= */}

                                <div className="order-top">

                                    <div>

                                        <span className="order-label">
                                            ORDER
                                        </span>

                                        <h2>
                                            #{order.orderId}
                                        </h2>

                                    </div>


                                    <span
                                        className={`order-status ${getStatusClass(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus
                                            ?.replaceAll(
                                                "_",
                                                " "
                                            )}
                                    </span>

                                </div>


                                {/* =================================================
                                    DATE + PAYMENT
                                ================================================= */}

                                <div className="order-meta">

                                    <span>
                                        🕒{" "}
                                        {formatDate(
                                            order.orderDate
                                        )}
                                    </span>


                                    <span
                                        className={`payment-status ${getPaymentStatusClass(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        Payment:{" "}
                                        {order.paymentStatus
                                            ?.replaceAll(
                                                "_",
                                                " "
                                            )}
                                    </span>

                                </div>


                                {/* =================================================
                                    ITEMS
                                ================================================= */}

                                <div className="order-items">

                                    {order.items?.map(
                                        (item) => (

                                            <div
                                                className="order-item"
                                                key={
                                                    item.foodId
                                                }
                                            >

                                                <div className="order-item-info">

                                                    <strong>
                                                        {
                                                            item.foodName
                                                        }
                                                    </strong>

                                                    <span>
                                                        ₹
                                                        {
                                                            item.price
                                                        }{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                </div>


                                                <strong className="order-item-price">

                                                    ₹
                                                    {
                                                        Number(
                                                            item.subtotal
                                                        ).toFixed(
                                                            2
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* =================================================
                                    BOTTOM
                                ================================================= */}

                                <div className="order-bottom">

                                    <div className="order-total">

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                Number(
                                                    order.totalAmount
                                                ).toFixed(
                                                    2
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div className="order-actions">

                                        <button
                                            className="view-order-btn"
                                            onClick={() =>
                                                handleViewDetails(
                                                    order.orderId
                                                )
                                            }
                                        >
                                            View Details
                                        </button>


                                        {canCancel(
                                            order
                                        ) && (

                                            <button
                                                className="cancel-order-btn"
                                                disabled={
                                                    cancellingOrderId ===
                                                    order.orderId
                                                }
                                                onClick={() =>
                                                    handleCancelOrder(
                                                        order.orderId
                                                    )
                                                }
                                            >

                                                {
                                                    cancellingOrderId ===
                                                    order.orderId
                                                        ? "Cancelling..."
                                                        : "Cancel Order"
                                                }

                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =====================================================
                ORDER DETAILS MODAL
            ===================================================== */}

            {selectedOrder && (

                <div
                    className="order-modal-overlay"
                    onClick={closeDetails}
                >

                    <div
                        className="order-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="order-modal-header">

                            <div>

                                <span>
                                    ORDER DETAILS
                                </span>

                                <h2>
                                    #
                                    {
                                        selectedOrder.orderId
                                    }
                                </h2>

                            </div>


                            <button
                                className="close-modal-btn"
                                onClick={closeDetails}
                            >
                                ×
                            </button>

                        </div>


                        {detailsLoading ? (

                            <div className="details-loading">
                                Loading order details...
                            </div>

                        ) : (

                            <>

                                {/* STATUS */}

                                <div className="details-status-row">

                                    <span>
                                        Order Status
                                    </span>

                                    <span
                                        className={`order-status ${getStatusClass(
                                            selectedOrder.orderStatus
                                        )}`}
                                    >
                                        {
                                            selectedOrder
                                                .orderStatus
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }
                                    </span>

                                </div>


                                {/* PAYMENT */}

                                <div className="details-status-row">

                                    <span>
                                        Payment Status
                                    </span>

                                    <span
                                        className={`payment-status ${getPaymentStatusClass(
                                            selectedOrder.paymentStatus
                                        )}`}
                                    >
                                        {
                                            selectedOrder
                                                .paymentStatus
                                                ?.replaceAll(
                                                    "_",
                                                    " "
                                                )
                                        }
                                    </span>

                                </div>


                                {/* ORDER INFO */}

                                <div className="details-info">

                                    <div>

                                        <span>
                                            Order Date
                                        </span>

                                        <strong>
                                            {
                                                formatDate(
                                                    selectedOrder.orderDate
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong className="details-total">

                                            ₹
                                            {
                                                Number(
                                                    selectedOrder.totalAmount
                                                ).toFixed(
                                                    2
                                                )
                                            }

                                        </strong>

                                    </div>

                                </div>


                                {/* ITEMS */}

                                <div className="details-section">

                                    <h3>
                                        Ordered Items
                                    </h3>


                                    <div className="details-items">

                                        {selectedOrder.items?.map(
                                            (item) => (

                                                <div
                                                    className="details-item"
                                                    key={
                                                        item.foodId
                                                    }
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                item.foodName
                                                            }
                                                        </strong>

                                                        <span>
                                                            ₹
                                                            {
                                                                item.price
                                                            }{" "}
                                                            ×{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                    </div>


                                                    <strong>

                                                        ₹
                                                        {
                                                            Number(
                                                                item.subtotal
                                                            ).toFixed(
                                                                2
                                                            )
                                                        }

                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* CANCEL */}

                                {canCancel(
                                    selectedOrder
                                ) && (

                                    <button
                                        className="modal-cancel-btn"
                                        disabled={
                                            cancellingOrderId ===
                                            selectedOrder.orderId
                                        }
                                        onClick={() =>
                                            handleCancelOrder(
                                                selectedOrder.orderId
                                            )
                                        }
                                    >

                                        {
                                            cancellingOrderId ===
                                            selectedOrder.orderId
                                                ? "Cancelling..."
                                                : "Cancel Order"
                                        }

                                    </button>

                                )}

                            </>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}

export default Orders;