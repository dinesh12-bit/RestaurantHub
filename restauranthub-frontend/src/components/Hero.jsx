import {
    Truck,
    Award,
    RotateCcw,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { useEffect, useState } from "react";

import "./Hero.css";


function Hero() {

    const slides = [

        {
            image: "/images/hero1-pizza.png",
            smallTitle: "WELCOME TO RESTAURANTHUB",
            title: "Good Food",
            highlight: "Great Mood",
            description: (
                <>
                    Delicious food, fast delivery
                    <br />
                    at your doorstep
                </>
            )
        },

        {
            image: "/images/hero-burger.png",
            smallTitle: "FRESH • JUICY • DELICIOUS",
            title: "Bite Into",
            highlight: "Happiness",
            description: (
                <>
                    Fresh burgers, amazing taste
                    <br />
                    delivered to your doorstep
                </>
            )
        },

        {
            image: "/images/hero-pasta.png",
            smallTitle: "AUTHENTIC TASTE",
            title: "Taste That",
            highlight: "Feels Like Home",
            description: (
                <>
                    Delicious pasta made with
                    <br />
                    fresh quality ingredients
                </>
            )
        }

    ];


    const [currentSlide, setCurrentSlide] = useState(0);


    /* =========================================
       AUTO CAROUSEL
    ========================================= */

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentSlide((previous) =>
                (previous + 1) % slides.length
            );

        }, 5000);


        return () => {
            clearInterval(interval);
        };

    }, [slides.length]);


    /* =========================================
       NEXT SLIDE
    ========================================= */

    const nextSlide = () => {

        setCurrentSlide((previous) =>
            (previous + 1) % slides.length
        );

    };


    /* =========================================
       PREVIOUS SLIDE
    ========================================= */

    const previousSlide = () => {

        setCurrentSlide((previous) =>
            previous === 0
                ? slides.length - 1
                : previous - 1
        );

    };


    const slide = slides[currentSlide];


    return (

        <section className="hero">


            {/* =====================================
                HERO IMAGE
            ===================================== */}

            <img
                src={slide.image}
                alt="RestaurantHub food"
                className="hero-background-image"
            />


            {/* =====================================
                DARK OVERLAY
            ===================================== */}

            <div className="hero-overlay"></div>


            {/* =====================================
                HERO CONTENT
            ===================================== */}

            <div className="hero-content">


                <p className="hero-small-title">
                    {slide.smallTitle}
                </p>


                <h1 className="hero-title">

                    {slide.title}

                    <br />

                    <span>
                        {slide.highlight}
                    </span>

                </h1>


                <p className="hero-description">
                    {slide.description}
                </p>


                {/* =================================
                    FEATURES
                ================================= */}

                <div className="hero-features">


                    {/* Fast Delivery */}

                    <div className="hero-feature">

                        <div className="feature-icon">
                            <Truck size={21} />
                        </div>

                        <div className="feature-text">

                            <strong>
                                Fast Delivery
                            </strong>

                            <span>
                                30-40 mins
                            </span>

                        </div>

                    </div>


                    {/* Best Quality */}

                    <div className="hero-feature">

                        <div className="feature-icon">
                            <Award size={21} />
                        </div>

                        <div className="feature-text">

                            <strong>
                                Best Quality
                            </strong>

                            <span>
                                100% Guaranteed
                            </span>

                        </div>

                    </div>


                    {/* Easy Returns */}

                    <div className="hero-feature">

                        <div className="feature-icon">
                            <RotateCcw size={21} />
                        </div>

                        <div className="feature-text">

                            <strong>
                                Easy Returns
                            </strong>

                            <span>
                                No Questions Asked
                            </span>

                        </div>

                    </div>


                </div>


            </div>


            {/* =====================================
                PREVIOUS BUTTON
            ===================================== */}

            <button
                type="button"
                className="hero-carousel-btn hero-prev"
                onClick={previousSlide}
                aria-label="Previous slide"
            >

                <ChevronLeft size={22} />

            </button>


            {/* =====================================
                NEXT BUTTON
            ===================================== */}

            <button
                type="button"
                className="hero-carousel-btn hero-next"
                onClick={nextSlide}
                aria-label="Next slide"
            >

                <ChevronRight size={22} />

            </button>


            {/* =====================================
                CAROUSEL DOTS
            ===================================== */}

            <div className="hero-dots">

                {slides.map((_, index) => (

                    <button
                        key={index}
                        type="button"
                        className={
                            currentSlide === index
                                ? "hero-dot active"
                                : "hero-dot"
                        }
                        onClick={() =>
                            setCurrentSlide(index)
                        }
                        aria-label={`Go to slide ${index + 1}`}
                    />

                ))}

            </div>


        </section>

    );
}


export default Hero;