import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminSales.css";

function AdminSales() {

    const [sales, setSales] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadSales();
    }, []);


    const loadSales = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/admin/sales");

            setSales(response.data);

        } catch (error) {

            console.error(
                "Failed to load sales:",
                error
            );

            if (error.response?.status === 403) {

                setError(
                    "You are not allowed to view sales information."
                );

            } else if (error.response?.status === 401) {

                setError(
                    "Your login session has expired."
                );

            } else {

                setError(
                    "Unable to load sales information."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    const formatMoney = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };


    const formatDate = (date) => {

        const parts = date.split("-");

        return parts[2];
    };


    const getMaxRevenue = () => {

        if (
            !sales ||
            !sales.dailyRevenue ||
            sales.dailyRevenue.length === 0
        ) {
            return 0;
        }

        return Math.max(
            ...sales.dailyRevenue.map(
                item => Number(item.revenue || 0)
            )
        );
    };


    const maxRevenue = getMaxRevenue();


    if (loading) {

        return (
            <div className="sales-page">

                <div className="sales-loading">

                    <div className="sales-loader"></div>

                    <p>
                        Loading sales...
                    </p>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="sales-page">

                <div className="sales-error">

                    <div className="sales-error-icon">
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={loadSales}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    if (!sales) {

        return (
            <div className="sales-page">

                <div className="sales-empty">

                    <h2>
                        No sales data
                    </h2>

                    <p>
                        There is no sales information to display.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="sales-page">

            <div className="sales-container">


                {/* Header */}

                <div className="sales-header">

                    <div>

                        <h1>
                            Sales & Revenue
                        </h1>

                        <p>
                            Check your restaurant's sales
                            and payment summary.
                        </p>

                    </div>


                    <button
                        className="sales-refresh"
                        onClick={loadSales}
                    >
                        Refresh
                    </button>

                </div>


                {/* Summary cards */}

                <div className="sales-cards">


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Total Revenue
                            </span>

                            <div className="sales-icon orange">
                                ₹
                            </div>

                        </div>

                        <h2>
                            {formatMoney(
                                sales.totalRevenue
                            )}
                        </h2>

                        <p>
                            From successful payments
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Total Orders
                            </span>

                            <div className="sales-icon blue">
                                #
                            </div>

                        </div>

                        <h2>
                            {sales.totalOrders}
                        </h2>

                        <p>
                            All orders
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Today's Sales
                            </span>

                            <div className="sales-icon green">
                                ↑
                            </div>

                        </div>

                        <h2>
                            {formatMoney(
                                sales.todaySales
                            )}
                        </h2>

                        <p>
                            Successful payments today
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Monthly Sales
                            </span>

                            <div className="sales-icon purple">
                                M
                            </div>

                        </div>

                        <h2>
                            {formatMoney(
                                sales.monthlySales
                            )}
                        </h2>

                        <p>
                            Current month
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Successful Payments
                            </span>

                            <div className="sales-icon green">
                                ✓
                            </div>

                        </div>

                        <h2>
                            {sales.successfulPayments}
                        </h2>

                        <p>
                            Payments received
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Pending Payments
                            </span>

                            <div className="sales-icon yellow">
                                !
                            </div>

                        </div>

                        <h2>
                            {sales.pendingPayments}
                        </h2>

                        <p>
                            Waiting for payment
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Cancelled Orders
                            </span>

                            <div className="sales-icon red">
                                ×
                            </div>

                        </div>

                        <h2>
                            {sales.cancelledOrders}
                        </h2>

                        <p>
                            Cancelled orders
                        </p>

                    </div>


                    <div className="sales-card">

                        <div className="sales-card-top">

                            <span>
                                Average Order
                            </span>

                            <div className="sales-icon orange">
                                ₹
                            </div>

                        </div>

                        <h2>
                            {formatMoney(
                                sales.averageOrderValue
                            )}
                        </h2>

                        <p>
                            Per successful order
                        </p>

                    </div>

                </div>


                {/* Revenue chart */}

                <div className="revenue-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Daily Revenue
                            </h2>

                            <p>
                                Successful sales during this month
                            </p>

                        </div>

                        <strong>
                            {formatMoney(
                                sales.monthlySales
                            )}
                        </strong>

                    </div>


                    {sales.dailyRevenue &&
                    sales.dailyRevenue.length > 0 ? (

                        <div className="chart-area">

                            <div className="chart-y-labels">

                                <span>
                                    {formatMoney(
                                        maxRevenue
                                    )}
                                </span>

                                <span>
                                    {formatMoney(
                                        maxRevenue / 2
                                    )}
                                </span>

                                <span>
                                    ₹0
                                </span>

                            </div>


                            <div className="chart">

                                <div className="chart-grid top"></div>

                                <div className="chart-grid middle"></div>

                                <div className="chart-grid bottom"></div>


                                <div className="chart-bars">

                                    {sales.dailyRevenue.map(
                                        (item) => {

                                            const revenue =
                                                Number(
                                                    item.revenue || 0
                                                );


                                            let height = 0;


                                            if (
                                                maxRevenue > 0
                                            ) {

                                                height =
                                                    (
                                                        revenue /
                                                        maxRevenue
                                                    ) * 100;

                                            }


                                            return (

                                                <div
                                                    className="bar-column"
                                                    key={item.date}
                                                >

                                                    <div className="bar-value">

                                                        {revenue > 0
                                                            ? formatMoney(
                                                                revenue
                                                            )
                                                            : ""}

                                                    </div>


                                                    <div className="bar-holder">

                                                        <div
                                                            className="revenue-bar"
                                                            style={{
                                                                height:
                                                                    `${Math.max(
                                                                        height,
                                                                        revenue > 0
                                                                            ? 3
                                                                            : 0
                                                                    )}%`
                                                            }}
                                                        ></div>

                                                    </div>


                                                    <span className="bar-date">

                                                        {formatDate(
                                                            item.date
                                                        )}

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="no-sales">

                            <div>
                                ₹
                            </div>

                            <p>
                                No successful sales this month.
                            </p>

                        </div>

                    )}

                </div>


            </div>

        </div>
    );
}

export default AdminSales;