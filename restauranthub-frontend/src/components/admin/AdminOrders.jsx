import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingOrder, setUpdatingOrder] = useState(null);


    useEffect(() => {
        fetchOrders();
    }, []);


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    const fetchOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError("Admin login required");
                return;
            }

            const response = await api.get(
                "/admin/orders",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load orders"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    const fetchOrderDetails = async (orderId) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await api.get(
                `/admin/orders/${orderId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSelectedOrder(response.data);

        } catch (error) {

            console.error(
                "Failed to load order details:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load order details"
            );

        }
    };


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateOrderStatus = async (
        orderId,
        newStatus
    ) => {

        try {

            setUpdatingOrder(orderId);

            const token =
                localStorage.getItem("token");

            const response = await api.patch(
                `/admin/orders/${orderId}/status`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setOrders(previousOrders =>
                previousOrders.map(order =>
                    order.orderId === orderId
                        ? response.data
                        : order
                )
            );


            if (
                selectedOrder &&
                selectedOrder.orderId === orderId
            ) {

                setSelectedOrder(response.data);

            }

        } catch (error) {

            console.error(
                "Failed to update order:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update order status"
            );

        } finally {

            setUpdatingOrder(null);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-orders-loading">
                Loading orders...
            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="admin-orders-error">

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={fetchOrders}
                >
                    Try Again
                </button>

            </div>
        );

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalOrders =
        orders.length;

    const deliveredOrders =
        orders.filter(
            order =>
                order.orderStatus === "DELIVERED"
        ).length;

    const pendingOrders =
        orders.filter(
            order =>
                order.orderStatus === "PLACED"
        ).length;

    const totalRevenue =
        orders.reduce(
            (total, order) =>
                total +
                Number(order.totalAmount || 0),
            0
        );


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="admin-orders">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-orders-header">

                <div>

                    <h2>
                        Orders
                    </h2>

                    <p>
                        Manage and track customer orders.
                    </p>

                </div>


                <button
                    type="button"
                    className="orders-refresh-btn"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="orders-summary">


                <div className="order-summary-card">

                    <span>
                        TOTAL ORDERS
                    </span>

                    <strong>
                        {totalOrders}
                    </strong>

                </div>


                <div className="order-summary-card">

                    <span>
                        PENDING
                    </span>

                    <strong>
                        {pendingOrders}
                    </strong>

                </div>


                <div className="order-summary-card">

                    <span>
                        DELIVERED
                    </span>

                    <strong>
                        {deliveredOrders}
                    </strong>

                </div>


                <div className="order-summary-card">

                    <span>
                        REVENUE
                    </span>

                    <strong className="summary-revenue">
                        ₹
                        {totalRevenue.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>

            </div>


            {/* =================================================
                ORDERS TABLE
            ================================================= */}

            {orders.length === 0 ? (

                <div className="no-orders">

                    <div>
                        —
                    </div>

                    <h3>
                        No Orders Found
                    </h3>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>

            ) : (

                <div className="orders-table-wrapper">

                    <table className="orders-table">

                        <thead>

                        <tr>

                            <th>
                                Order
                            </th>

                            <th>
                                Customer
                            </th>

                            <th>
                                Items
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Payment
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {orders.map(order => (

                            <tr
                                key={order.orderId}
                            >


                                {/* ORDER */}

                                <td>

                                    <div className="order-number">
                                        #{order.orderId}
                                    </div>

                                    <div className="order-date">
                                        {formatDate(
                                            order.orderDate
                                        )}
                                    </div>

                                </td>


                                {/* CUSTOMER */}

                                <td>

                                    <div className="customer-info">

                                        <strong>
                                            {order.customerName ||
                                                "Customer"}
                                        </strong>

                                        <span>
                                                {order.customerEmail ||
                                                    "No email"}
                                            </span>

                                        <small>
                                            {order.customerPhone ||
                                                ""}
                                        </small>

                                    </div>

                                </td>


                                {/* ITEMS */}

                                <td>

                                    <div className="order-items-count">

                                        {order.items?.length || 0}
                                        {" "}
                                        item
                                        {(order.items?.length || 0) !== 1
                                            ? "s"
                                            : ""}

                                    </div>

                                    <div className="order-items-preview">

                                        {order.items
                                            ?.map(item =>
                                                `${item.foodName} × ${item.quantity}`
                                            )
                                            .join(", ")}

                                    </div>

                                </td>


                                {/* AMOUNT */}

                                <td>

                                    <strong className="order-amount">

                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </strong>

                                </td>


                                {/* PAYMENT */}

                                <td>

                                        <span
                                            className={`payment-badge ${getPaymentClass(
                                                order.paymentStatus
                                            )}`}
                                        >
                                            {formatStatus(
                                                order.paymentStatus
                                            )}
                                        </span>

                                </td>


                                {/* STATUS */}

                                <td>

                                        <span
                                            className={`order-status-badge ${getOrderStatusClass(
                                                order.orderStatus
                                            )}`}
                                        >
                                            {formatStatus(
                                                order.orderStatus
                                            )}
                                        </span>

                                </td>


                                {/* ACTION */}

                                <td>

                                    <div className="order-actions">

                                        <button
                                            type="button"
                                            className="details-btn"
                                            onClick={() =>
                                                fetchOrderDetails(
                                                    order.orderId
                                                )
                                            }
                                        >
                                            View
                                        </button>


                                        <select
                                            value={
                                                order.orderStatus
                                            }
                                            disabled={
                                                updatingOrder ===
                                                order.orderId ||
                                                order.orderStatus ===
                                                "DELIVERED" ||
                                                order.orderStatus ===
                                                "CANCELLED"
                                            }
                                            onChange={event =>
                                                updateOrderStatus(
                                                    order.orderId,
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="PLACED">
                                                Placed
                                            </option>

                                            <option value="CONFIRMED">
                                                Confirmed
                                            </option>

                                            <option value="PREPARING">
                                                Preparing
                                            </option>

                                            <option value="OUT_FOR_DELIVERY">
                                                Out for Delivery
                                            </option>

                                            <option value="DELIVERED">
                                                Delivered
                                            </option>

                                            <option value="CANCELLED">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =================================================
                ORDER DETAILS MODAL
            ================================================= */}

            {selectedOrder && (

                <div
                    className="admin-order-modal-overlay"
                    onClick={() =>
                        setSelectedOrder(null)
                    }
                >

                    <div
                        className="admin-order-modal"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="order-modal-header">

                            <div>

                                <span>
                                    ORDER DETAILS
                                </span>

                                <h3>
                                    #
                                    {selectedOrder.orderId}
                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* CUSTOMER */}

                        <div className="modal-customer">

                            <h4>
                                Customer
                            </h4>

                            <strong>
                                {selectedOrder.customerName}
                            </strong>

                            <p>
                                {selectedOrder.customerEmail}
                                {" · "}
                                {selectedOrder.customerPhone}
                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="modal-status-row">

                            <div>

                                <span>
                                    ORDER STATUS
                                </span>

                                <strong
                                    className={`order-status-badge ${getOrderStatusClass(
                                        selectedOrder.orderStatus
                                    )}`}
                                >
                                    {formatStatus(
                                        selectedOrder.orderStatus
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    PAYMENT
                                </span>

                                <strong
                                    className={`payment-badge ${getPaymentClass(
                                        selectedOrder.paymentStatus
                                    )}`}
                                >
                                    {formatStatus(
                                        selectedOrder.paymentStatus
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* ITEMS */}

                        <div className="modal-items">

                            <h4>
                                Items
                            </h4>


                            {selectedOrder.items?.map(
                                item => (

                                    <div
                                        className="modal-item"
                                        key={item.foodId}
                                    >

                                        <div>

                                            <strong>
                                                {item.foodName}
                                            </strong>

                                            <span>
                                                ₹
                                                {Number(
                                                    item.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                                {" × "}
                                                {item.quantity}
                                            </span>

                                        </div>


                                        <strong>
                                            ₹
                                            {Number(
                                                item.subtotal || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>


                        {/* TOTAL */}

                        <div className="modal-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    selectedOrder.totalAmount || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>


                        {/* UPDATE */}

                        <div className="modal-update">

                            <label>
                                Update Order Status
                            </label>

                            <select
                                value={
                                    selectedOrder.orderStatus
                                }
                                disabled={
                                    updatingOrder ===
                                    selectedOrder.orderId ||
                                    selectedOrder.orderStatus ===
                                    "DELIVERED" ||
                                    selectedOrder.orderStatus ===
                                    "CANCELLED"
                                }
                                onChange={event =>
                                    updateOrderStatus(
                                        selectedOrder.orderId,
                                        event.target.value
                                    )
                                }
                            >

                                <option value="PLACED">
                                    Placed
                                </option>

                                <option value="CONFIRMED">
                                    Confirmed
                                </option>

                                <option value="PREPARING">
                                    Preparing
                                </option>

                                <option value="OUT_FOR_DELIVERY">
                                    Out for Delivery
                                </option>

                                <option value="DELIVERED">
                                    Delivered
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}


/* =========================================================
   HELPERS
========================================================= */

function formatStatus(status) {

    if (!status) {
        return "Unknown";
    }

    return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


function getPaymentClass(status) {

    switch (status) {

        case "PAID":
            return "payment-success";

        case "PENDING":
            return "payment-pending";

        case "FAILED":
            return "payment-failed";

        case "REFUNDED":
            return "payment-refunded";

        default:
            return "payment-pending";
    }
}


function getOrderStatusClass(status) {

    switch (status) {

        case "PLACED":
            return "status-placed";

        case "CONFIRMED":
            return "status-confirmed";

        case "PREPARING":
            return "status-preparing";

        case "OUT_FOR_DELIVERY":
            return "status-delivery";

        case "DELIVERED":
            return "status-delivered";

        case "CANCELLED":
            return "status-cancelled";

        default:
            return "status-placed";
    }
}


function formatDate(date) {

    if (!date) {
        return "—";
    }

    try {

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

    } catch {

        return date;
    }
}


export default AdminOrders;