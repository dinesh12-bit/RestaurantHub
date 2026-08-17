import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="admin-layout">

            {/* ================= SIDEBAR ================= */}

            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <span>Restaurant</span>Hub
                </div>


                {/* PROFILE */}

                <div className="admin-profile">

                    <div className="admin-avatar">
                        {user?.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : "A"}
                    </div>

                    <div className="admin-profile-info">
                        <strong>
                            {user?.fullName || "Admin"}
                        </strong>

                        <small>
                            Administrator
                        </small>
                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="admin-nav">

                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Orders
                    </NavLink>


                    <NavLink
                        to="/admin/foods"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Foods
                    </NavLink>


                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Categories
                    </NavLink>


                    <NavLink
                        to="/admin/coupons"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Coupons
                    </NavLink>


                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Users
                    </NavLink>


                    <NavLink
                        to="/admin/sales"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Sales
                    </NavLink>


                    <NavLink
                        to="/admin/reviews"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Reviews
                    </NavLink>

                </nav>


                {/* BOTTOM */}

                <div className="admin-sidebar-bottom">

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        View Website
                    </button>


                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="admin-main">

                <header className="admin-topbar">

                    <div className="admin-topbar-title">

                        <h1>
                            Admin Panel
                        </h1>

                        <p>
                            Manage your restaurant
                        </p>

                    </div>


                    <div className="admin-topbar-user">

                        <div className="topbar-avatar">
                            {user?.fullName
                                ? user.fullName.charAt(0).toUpperCase()
                                : "A"}
                        </div>

                        <div>
                            <strong>
                                {user?.fullName || "Admin"}
                            </strong>

                            <span>
                                Administrator
                            </span>
                        </div>

                    </div>

                </header>


                <section className="admin-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

export default AdminLayout;