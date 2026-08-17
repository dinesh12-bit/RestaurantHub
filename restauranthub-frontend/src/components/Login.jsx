import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(
                "Login response:",
                response.data
            );


            // =================================================
            // SAVE TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                response.data.token
            );


            // =================================================
            // SAVE USER
            // =================================================

            const loggedInUser = {

                userId: response.data.userId,

                fullName: response.data.fullName,

                email: response.data.email,

                role: response.data.role
            };


            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );


            setSuccess(
                "Login successful."
            );


            // =================================================
            // GO HOME
            // =================================================

            setTimeout(() => {

                navigate("/");

            }, 700);


        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            <div className="login-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="login-header">

                    <div className="login-brand">
                        RESTAURANT<span>HUB</span>
                    </div>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Login to your account and continue
                        ordering your favourite food.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="login-field">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="login-field">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="login-password-wrapper">

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="login-message login-error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="login-message login-success">
                            {success}
                        </div>

                    )}


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* =================================================
                    REGISTER LINK
                ================================================= */}

                <div className="login-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;