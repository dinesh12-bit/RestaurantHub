import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    Search,
    ShoppingCart,
    User,
    MapPin,
    Menu,
    X
} from "lucide-react";

import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchText, setSearchText] = useState("");


    // ==============================
    // GET LOGGED IN USER
    // ==============================

    const getUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            return storedUser
                ? JSON.parse(storedUser)
                : null;

        } catch {

            return null;
        }
    };


    const user = getUser();


    // ==============================
    // USER FIRST LETTER
    // ==============================

    const userInitial =
        user?.fullName
            ? user.fullName
                .trim()
                .charAt(0)
                .toUpperCase()
            : null;


    // ==============================
    // FETCH CART COUNT
    // ==============================

    const fetchCartCount = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const currentUser = getUser();


            if (!token || !currentUser?.userId) {

                setCartCount(0);

                return;
            }


            const response = await api.get(
                `/cart/${currentUser.userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const items =
                response.data?.items || [];


            const totalQuantity =
                items.reduce(
                    (total, item) =>
                        total + (item.quantity || 0),
                    0
                );


            setCartCount(totalQuantity);

        } catch (error) {

            console.error(
                "Failed to load cart count:",
                error
            );

            setCartCount(0);
        }
    };


    // ==============================
    // LOAD CART
    // ==============================

    useEffect(() => {

        fetchCartCount();

    }, [location.pathname]);


    // ==============================
    // LISTEN CART UPDATE
    // ==============================

    useEffect(() => {

        const handleCartUpdate = () => {

            fetchCartCount();
        };


        window.addEventListener(
            "cartUpdated",
            handleCartUpdate
        );


        window.addEventListener(
            "storage",
            handleCartUpdate
        );


        return () => {

            window.removeEventListener(
                "cartUpdated",
                handleCartUpdate
            );


            window.removeEventListener(
                "storage",
                handleCartUpdate
            );
        };

    }, []);


    // ==============================
    // SEARCH
    // ==============================

    const handleSearch = (event) => {

        event.preventDefault();

        const query =
            searchText.trim();


        if (!query) {

            navigate("/menu");

            return;
        }


        setMenuOpen(false);

        navigate(
            `/menu?search=${encodeURIComponent(query)}`
        );
    };


    // ==============================
    // ACCOUNT
    // ==============================

    const handleAccount = () => {

        setMenuOpen(false);

        const token =
            localStorage.getItem("token");

        const storedUser =
            localStorage.getItem("user");


        if (token && storedUser) {

            navigate("/account");

        } else {

            navigate("/login");
        }
    };


    // ==============================
    // NORMAL NAVIGATION
    // ==============================

    const goTo = (path) => {

        setMenuOpen(false);

        navigate(path);
    };


    // ==============================
    // CONTACT / FOOTER
    // ==============================

    const goToContact = () => {

        setMenuOpen(false);


        /*
         * Agar already Home page par hain,
         * directly footer par scroll karo.
         */

        if (location.pathname === "/") {

            const footer =
                document.getElementById("contact-footer");

            if (footer) {

                footer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }


        /*
         * Agar kisi doosre page par hain,
         * pehle Home par jao.
         */

        navigate("/");


        /*
         * Home render hone ke baad footer
         * tak scroll karo.
         */

        setTimeout(() => {

            const footer =
                document.getElementById("contact-footer");

            if (footer) {

                footer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        }, 400);
    };


    return (

        <nav className="navbar">


            {/* =================================
                LOGO
            ================================= */}

            <div
                className="navbar-logo"
                onClick={() => goTo("/")}
            >

                <span className="logo-icon">
                    🍴
                </span>

                <span className="logo-text">
                    Restaurant<span>Hub</span>
                </span>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

            <form
                className="navbar-search"
                onSubmit={handleSearch}
            >

                <Search
                    size={18}
                    className="navbar-search-icon"
                />

                <input
                    type="text"
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(
                            event.target.value
                        )
                    }
                    placeholder="Search for dishes, cuisines..."
                    aria-label="Search food"
                />

                {searchText && (

                    <button
                        type="button"
                        className="navbar-search-clear"
                        onClick={() =>
                            setSearchText("")
                        }
                    >
                        <X size={15} />
                    </button>

                )}

            </form>


            {/* =================================
                LOCATION
            ================================= */}

            <div className="navbar-location">

                <MapPin size={18} />

                <div>

                    <small>
                        Deliver to
                    </small>

                    <p>
                        Bhopal, MP
                    </p>

                </div>

            </div>


            {/* =================================
                DESKTOP NAVIGATION
            ================================= */}

            <div className="navbar-links">

                <button
                    type="button"
                    className="navbar-link"
                    onClick={() => goTo("/")}
                >
                    Home
                </button>

                <button
                    type="button"
                    className="navbar-link"
                    onClick={() => goTo("/menu")}
                >
                    Menu
                </button>

                <button
                    type="button"
                    className="navbar-link"
                    onClick={() => goTo("/offers")}
                >
                    Offers
                </button>

                <button
                    type="button"
                    className="navbar-link"
                    onClick={() => goTo("/about")}
                >
                    About Us
                </button>

                <button
                    type="button"
                    className="navbar-link"
                    onClick={goToContact}
                >
                    Contact
                </button>

            </div>


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="navbar-actions">


                {/* CART */}

                <button
                    type="button"
                    className="icon-button cart-button"
                    onClick={() => goTo("/cart")}
                    title="Cart"
                >

                    <ShoppingCart size={20} />

                    {cartCount > 0 && (

                        <span className="cart-count">

                            {cartCount > 99
                                ? "99+"
                                : cartCount}

                        </span>

                    )}

                </button>


                {/* ACCOUNT */}

                <button
                    type="button"
                    className={
                        userInitial
                            ? "profile-button profile-logged"
                            : "profile-button"
                    }
                    onClick={handleAccount}
                    title={
                        user?.fullName ||
                        "Account"
                    }
                >

                    {userInitial ? (

                        <span className="profile-initial">
                            {userInitial}
                        </span>

                    ) : (

                        <User size={19} />

                    )}

                </button>


                {/* MOBILE MENU */}

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() =>
                        setMenuOpen(
                            !menuOpen
                        )
                    }
                    aria-label="Open menu"
                >

                    {menuOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}

                </button>

            </div>


            {/* =================================
                MOBILE MENU
            ================================= */}

            {menuOpen && (

                <div className="mobile-menu">

                    <button
                        type="button"
                        onClick={() => goTo("/")}
                    >
                        Home
                    </button>


                    <button
                        type="button"
                        onClick={() => goTo("/menu")}
                    >
                        Menu
                    </button>


                    <button
                        type="button"
                        onClick={() => goTo("/offers")}
                    >
                        Offers
                    </button>


                    <button
                        type="button"
                        onClick={() => goTo("/about")}
                    >
                        About Us
                    </button>


                    <button
                        type="button"
                        onClick={goToContact}
                    >
                        Contact
                    </button>


                    <div className="mobile-menu-divider"></div>


                    <button
                        type="button"
                        className="mobile-account-link"
                        onClick={handleAccount}
                    >

                        {userInitial ? (

                            <span className="mobile-user-circle">
                                {userInitial}
                            </span>

                        ) : (

                            <User size={18} />

                        )}

                        <span>
                            {user?.fullName ||
                                "My Account"}
                        </span>

                    </button>

                </div>

            )}

        </nav>
    );
}

export default Navbar;