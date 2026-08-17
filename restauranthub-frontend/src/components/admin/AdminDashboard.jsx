import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);


    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await api.get(
                "/admin/dashboard",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setDashboard(response.data);

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-dashboard-state">
                Loading dashboard...
            </div>
        );

    }


    if (error) {

        return (
            <div className="admin-dashboard-state error">
                {error}
            </div>
        );

    }


    return (

        <main className="admin-dashboard">


            {/* ==============================
                HEADER
            ============================== */}

            <header className="dashboard-header">

                <div>

                    <div className="dashboard-eyebrow">
                        RESTAURANT HUB
                    </div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Overview of your restaurant
                        activity and performance.
                    </p>

                </div>


                <button
                    type="button"
                    className="dashboard-refresh"
                    onClick={fetchDashboard}
                >
                    Refresh
                </button>

            </header>



            {/* ==============================
                STATISTICS
            ============================== */}

            <section className="dashboard-stats">


                <StatCard
                    label="Total Users"
                    value={dashboard.totalUsers}
                    code="USR"
                />


                <StatCard
                    label="Total Foods"
                    value={dashboard.totalFoods}
                    code="FOOD"
                />


                <StatCard
                    label="Categories"
                    value={dashboard.totalCategories}
                    code="CAT"
                />


                <StatCard
                    label="Total Orders"
                    value={dashboard.totalOrders}
                    code="ORD"
                />


                <StatCard
                    label="Total Revenue"
                    value={
                        `₹${Number(
                            dashboard.totalRevenue || 0
                        ).toLocaleString("en-IN")}`
                    }
                    code="REV"
                    highlight
                />

            </section>



            {/* ==============================
                ORDER OVERVIEW
            ============================== */}

            <section className="dashboard-panel">

                <div className="panel-header">

                    <div>

                        <h2>
                            Order Overview
                        </h2>

                        <p>
                            Current status of restaurant
                            orders.
                        </p>

                    </div>

                </div>


                <div className="order-status-list">


                    <OrderStatus
                        label="Placed"
                        value={
                            dashboard.pendingOrders
                        }
                    />


                    <OrderStatus
                        label="Confirmed"
                        value={
                            dashboard.confirmedOrders
                        }
                    />


                    <OrderStatus
                        label="Preparing"
                        value={
                            dashboard.preparingOrders
                        }
                    />


                    <OrderStatus
                        label="Out for Delivery"
                        value={
                            dashboard.outForDeliveryOrders
                        }
                    />


                    <OrderStatus
                        label="Delivered"
                        value={
                            dashboard.deliveredOrders
                        }
                    />


                    <OrderStatus
                        label="Cancelled"
                        value={
                            dashboard.cancelledOrders
                        }
                    />

                </div>

            </section>



            {/* ==============================
                QUICK INFORMATION
            ============================== */}

            <section className="dashboard-quick">


                <QuickCard
                    value={dashboard.totalOrders}
                    label="Total orders received"
                    code="ORDERS"
                />


                <QuickCard
                    value={dashboard.totalFoods}
                    label="Food items available"
                    code="FOODS"
                />


                <QuickCard
                    value={dashboard.totalUsers}
                    label="Registered users"
                    code="USERS"
                />

            </section>


        </main>

    );

}


/* =========================================
   STAT CARD
========================================= */

function StatCard({
                      label,
                      value,
                      code,
                      highlight = false
                  }) {

    return (

        <div
            className={
                highlight
                    ? "stat-card highlight"
                    : "stat-card"
            }
        >

            <div className="stat-top">

                <span>
                    {code}
                </span>

            </div>

            <p>
                {label}
            </p>

            <strong>
                {value}
            </strong>

        </div>

    );

}


/* =========================================
   ORDER STATUS
========================================= */

function OrderStatus({
                         label,
                         value
                     }) {

    return (

        <div className="order-status">

            <div className="status-marker"></div>

            <div className="status-content">

                <span>
                    {label}
                </span>

                <strong>
                    {value ?? 0}
                </strong>

            </div>

        </div>

    );

}


/* =========================================
   QUICK CARD
========================================= */

function QuickCard({
                       value,
                       label,
                       code
                   }) {

    return (

        <div className="quick-card">

            <div className="quick-code">
                {code}
            </div>

            <div>

                <strong>
                    {value ?? 0}
                </strong>

                <span>
                    {label}
                </span>

            </div>

        </div>

    );

}


export default AdminDashboard;