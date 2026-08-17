import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminUsers.css";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            setUsers(response.data || []);

        } catch (error) {
            console.error("Users error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (user) => {

        try {

            setUpdatingId(user.id);

            const response = await api.patch(
                `/admin/users/${user.id}/status`
            );

            setUsers(prev =>
                prev.map(item =>
                    item.id === user.id
                        ? response.data
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user status"
            );

        } finally {
            setUpdatingId(null);
        }
    };


    const filteredUsers = users.filter(user => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return true;
        }

        return (
            user.fullName
                ?.toLowerCase()
                .includes(keyword) ||

            user.email
                ?.toLowerCase()
                .includes(keyword) ||

            user.phone
                ?.toLowerCase()
                .includes(keyword) ||

            user.role
                ?.toLowerCase()
                .includes(keyword)
        );
    });


    if (loading) {
        return (
            <div className="admin-users-loading">
                Loading users...
            </div>
        );
    }


    if (error) {
        return (
            <div className="admin-users-error">

                <p>{error}</p>

                <button
                    onClick={fetchUsers}
                    className="retry-users-btn"
                >
                    Retry
                </button>

            </div>
        );
    }


    return (

        <div className="admin-users">

            {/* ================= HEADER ================= */}

            <div className="admin-users-header">

                <div className="users-heading">

                    <h2>
                        User Management
                    </h2>

                    <p>
                        Manage registered users
                    </p>

                </div>


                <div className="users-header-right">

                    <span className="user-count">
                        {filteredUsers.length}{" "}
                        {filteredUsers.length === 1
                            ? "User"
                            : "Users"}
                    </span>

                    <button
                        type="button"
                        className="refresh-users-btn"
                        onClick={fetchUsers}
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="users-toolbar">

                <div className="users-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search by name, email, phone or role..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (

                        <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>

                    )}

                </div>

            </div>


            {/* ================= TABLE ================= */}

            <div className="users-table-container">

                <table className="users-table">

                    <thead>

                    <tr>

                        <th>ID</th>

                        <th>User</th>

                        <th>Email</th>

                        <th>Phone</th>

                        <th>Role</th>

                        <th>Status</th>

                    </tr>

                    </thead>


                    <tbody>

                    {filteredUsers.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="no-users"
                            >

                                <div className="no-users-icon">
                                    👥
                                </div>

                                <strong>
                                    No users found
                                </strong>

                                <span>
                                        Try another search.
                                    </span>

                            </td>

                        </tr>

                    ) : (

                        filteredUsers.map(user => (

                            <tr key={user.id}>

                                {/* ID */}

                                <td>

                                        <span className="user-id">
                                            #{user.id}
                                        </span>

                                </td>


                                {/* USER */}

                                <td>

                                    <div className="user-info">

                                        <div className="user-avatar">

                                            {user.fullName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}

                                        </div>

                                        <strong className="user-name">
                                            {user.fullName}
                                        </strong>

                                    </div>

                                </td>


                                {/* EMAIL */}

                                <td>

                                        <span className="user-email">
                                            {user.email}
                                        </span>

                                </td>


                                {/* PHONE */}

                                <td>

                                        <span className="user-phone">
                                            {user.phone || "-"}
                                        </span>

                                </td>


                                {/* ROLE */}

                                <td>

                                        <span
                                            className={
                                                user.role === "ADMIN"
                                                    ? "role-badge admin"
                                                    : "role-badge customer"
                                            }
                                        >
                                            {user.role}
                                        </span>

                                </td>


                                {/* STATUS */}

                                <td>

                                    <button
                                        type="button"
                                        className={
                                            user.enabled
                                                ? "user-status-btn active"
                                                : "user-status-btn disabled"
                                        }
                                        onClick={() =>
                                            toggleUserStatus(user)
                                        }
                                        disabled={
                                            updatingId === user.id
                                        }
                                    >

                                        {updatingId === user.id
                                            ? "Updating..."
                                            : user.enabled
                                                ? "Active"
                                                : "Disabled"}

                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AdminUsers;