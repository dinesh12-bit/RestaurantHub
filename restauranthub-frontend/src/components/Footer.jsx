import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {

    return (

        <footer
            id="contact-footer"
            className="site-footer"
        >

            <div className="footer-container">


                {/* =========================
                    BRAND
                ========================= */}

                <div className="footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                    >
                        Restaurant<span>Hub</span>
                    </Link>

                    <p>
                        Fresh food, quality ingredients and
                        a better dining experience delivered
                        right to your doorstep.
                    </p>

                    <div className="footer-socials">

                        <a
                            href="#"
                            aria-label="Facebook"
                        >
                            f
                        </a>

                        <a
                            href="#"
                            aria-label="Instagram"
                        >
                            ig
                        </a>

                        <a
                            href="#"
                            aria-label="Twitter"
                        >
                            x
                        </a>

                        <a
                            href="#"
                            aria-label="LinkedIn"
                        >
                            in
                        </a>

                    </div>

                </div>


                {/* =========================
                    QUICK LINKS
                ========================= */}

                <div className="footer-column">

                    <h3>
                        Quick Links
                    </h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/menu">
                        Menu
                    </Link>

                    <Link to="/offers">
                        Offers
                    </Link>

                    <Link to="/account">
                        My Account
                    </Link>

                    <Link to="/orders">
                        My Orders
                    </Link>

                </div>


                {/* =========================
                    INFORMATION
                ========================= */}

                <div className="footer-column">

                    <h3>
                        Information
                    </h3>

                    <a href="#">
                        About Us
                    </a>

                    <a href="#contact-footer">
                        Contact Us
                    </a>

                    <a href="#">
                        Privacy Policy
                    </a>

                    <a href="#">
                        Terms & Conditions
                    </a>

                    <a href="#">
                        Refund Policy
                    </a>

                </div>


                {/* =========================
                    CONTACT
                ========================= */}

                <div className="footer-column footer-contact">

                    <h3>
                        Contact Us
                    </h3>

                    <div className="footer-contact-item">

                        <span>
                            Address
                        </span>

                        <p>
                            Bhopal, Madhya Pradesh, India
                        </p>

                    </div>

                    <div className="footer-contact-item">

                        <span>
                            Phone
                        </span>

                        <p>
                            +91 98765 43210
                        </p>

                    </div>

                    <div className="footer-contact-item">

                        <span>
                            Email
                        </span>

                        <p>
                            support@restauranthub.com
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                BOTTOM
            ========================= */}

            <div className="footer-bottom">

                <div className="footer-bottom-container">

                    <p>
                        © {new Date().getFullYear()}
                        {" "}
                        RestaurantHub. All rights reserved.
                    </p>

                    <p>
                        Made for better food experiences.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;