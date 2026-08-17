import {
    Utensils,
    Truck,
    Heart,
    ShieldCheck
} from "lucide-react";

import "./About.css";

function About() {

    return (
        <main className="about-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="about-hero">

                <div className="about-hero-content">

                    <p className="about-small-title">
                        ABOUT RESTAURANTHUB
                    </p>

                    <h1>
                        Good Food.
                        <br />
                        <span>Great Experiences.</span>
                    </h1>

                    <p className="about-hero-description">
                        We bring delicious food, quality ingredients
                        and a seamless ordering experience right
                        to your doorstep.
                    </p>

                </div>

            </section>


            {/* =================================================
                OUR STORY
            ================================================= */}

            <section className="about-story">

                <div className="about-story-content">

                    <p className="about-section-label">
                        OUR STORY
                    </p>

                    <h2>
                        Food made with
                        <span> passion</span>
                    </h2>

                    <p>
                        RestaurantHub was created with a simple idea —
                        make great food easy to discover and order.
                    </p>

                    <p>
                        From delicious meals to convenient delivery,
                        we focus on making every step of your food
                        journey simple, reliable and enjoyable.
                    </p>

                    <p>
                        Whether you're ordering a quick meal for
                        yourself or sharing food with friends and
                        family, RestaurantHub is here to make the
                        experience better.
                    </p>

                </div>


                <div className="about-story-card">

                    <div className="story-card-icon">
                        <Utensils size={30} />
                    </div>

                    <h3>
                        Made for Food Lovers
                    </h3>

                    <p>
                        Discover food you love and enjoy it
                        without the hassle.
                    </p>

                </div>

            </section>


            {/* =================================================
                WHY RESTAURANTHUB
            ================================================= */}

            <section className="about-values">

                <div className="about-section-heading">

                    <p>
                        WHY RESTAURANTHUB
                    </p>

                    <h2>
                        More than just
                        <span> food delivery</span>
                    </h2>

                </div>


                <div className="about-value-grid">


                    {/* Fast Delivery */}

                    <div className="about-value-card">

                        <div className="about-value-icon">
                            <Truck size={24} />
                        </div>

                        <h3>
                            Fast Delivery
                        </h3>

                        <p>
                            Get your favourite meals delivered
                            quickly and conveniently.
                        </p>

                    </div>


                    {/* Quality */}

                    <div className="about-value-card">

                        <div className="about-value-icon">
                            <Heart size={24} />
                        </div>

                        <h3>
                            Quality Food
                        </h3>

                        <p>
                            We believe great food starts with
                            quality ingredients and care.
                        </p>

                    </div>


                    {/* Secure */}

                    <div className="about-value-card">

                        <div className="about-value-icon">
                            <ShieldCheck size={24} />
                        </div>

                        <h3>
                            Safe & Reliable
                        </h3>

                        <p>
                            A simple and reliable ordering
                            experience from start to finish.
                        </p>

                    </div>


                    {/* Experience */}

                    <div className="about-value-card">

                        <div className="about-value-icon">
                            <Utensils size={24} />
                        </div>

                        <h3>
                            Better Experience
                        </h3>

                        <p>
                            Everything is designed around
                            making your food experience better.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                CTA
            ================================================= */}

            <section className="about-cta">

                <div>

                    <p>
                        READY TO ORDER?
                    </p>

                    <h2>
                        Your next great meal
                        <span> is waiting.</span>
                    </h2>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        window.location.href = "/menu"
                    }
                >
                    Explore Menu
                </button>

            </section>

        </main>
    );
}

export default About;