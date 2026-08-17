import { useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Agar user logged in nahi hai
    if (!user) {
        navigate("/login");
        return null;
    }

    const firstLetter =
        user.fullName?.charAt(0)?.toUpperCase() || "U";


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    return (
        <div className="account-page">

            <div className="account-card">

                {/* Avatar */}

                <div className="account-avatar">
                    {firstLetter}
                </div>


                {/* User Name */}

                <h1>
                    {user.fullName}
                </h1>

                <p className="account-email">
                    {user.email}
                </p>


                {/* User Information */}

                <div className="account-info">

                    <div className="account-info-row">

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {user.fullName}
                        </strong>

                    </div>


                    <div className="account-info-row">

                        <span>
                            Email
                        </span>

                        <strong>
                            {user.email}
                        </strong>

                    </div>


                    <div className="account-info-row">

                        <span>
                            Account Type
                        </span>

                        <strong>
                            {user.role}
                        </strong>

                    </div>

                </div>


                {/* My Orders */}

                <button
                    className="account-action-button"
                    onClick={() => navigate("/orders")}
                >
                    My Orders
                </button>


                {/* Logout */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Account;