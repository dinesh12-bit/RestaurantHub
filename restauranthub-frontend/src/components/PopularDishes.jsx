import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import FoodReviews from "./FoodReviews";

import "./PopularDishes.css";


function PopularDishes() {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [foods, setFoods] = useState([]);

    const [ratings, setRatings] = useState({});

    const [addingFood, setAddingFood] = useState(null);

    const [addedFoods, setAddedFoods] = useState({});

    const [openReviews, setOpenReviews] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH FOODS
    // =====================================================

    useEffect(() => {

        fetchFoods();

    }, []);


    const fetchFoods = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/foods");

            const foodList = Array.isArray(response.data)
                ? response.data
                : [];


            console.log("Foods:", foodList);

            setFoods(foodList);


            // =================================================
            // FETCH RATINGS
            // =================================================

            foodList.forEach((food) => {

                if (food?.id) {

                    fetchRating(food.id);

                }

            });


        } catch (err) {

            console.error(
                "Failed to load foods:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load foods."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH RATING
    // =====================================================

    const fetchRating = async (foodId) => {

        try {

            const response = await api.get(
                `/reviews/food/${foodId}/rating`
            );


            setRatings((prev) => ({
                ...prev,
                [foodId]: response.data
            }));


        } catch (err) {

            console.error(
                `Rating error for food ${foodId}:`,
                err
            );


            setRatings((prev) => ({
                ...prev,
                [foodId]: {
                    averageRating: 0,
                    reviewCount: 0
                }
            }));

        }

    };


    // =====================================================
    // VIEW / HIDE REVIEWS
    // =====================================================

    const toggleReviews = (foodId) => {

        setOpenReviews((current) =>
            current === foodId
                ? null
                : foodId
        );

    };


    // =====================================================
    // ADD TO CART
    // =====================================================

    const handleAddToCart = async (foodId) => {

        try {

            const token =
                localStorage.getItem("token");


            const storedUser =
                localStorage.getItem("user");


            let user = null;


            try {

                user = storedUser
                    ? JSON.parse(storedUser)
                    : null;

            } catch {

                user = null;

            }


            // -------------------------------------------------
            // LOGIN CHECK
            // -------------------------------------------------

            if (!token || !user?.userId) {

                alert(
                    "Please login first to add food to cart."
                );

                navigate("/login");

                return;

            }


            setAddingFood(foodId);


            // -------------------------------------------------
            // ADD TO CART
            // -------------------------------------------------

            await api.post(

                `/cart/${user.userId}`,

                {
                    foodId: foodId,
                    quantity: 1
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            setAddedFoods((prev) => ({
                ...prev,
                [foodId]: true
            }));


            // Reset after 2 seconds
            setTimeout(() => {

                setAddedFoods((prev) => ({
                    ...prev,
                    [foodId]: false
                }));

            }, 2000);


        } catch (err) {

            console.error(
                "Failed to add food:",
                err
            );


            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                alert(
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");

            } else {

                alert(
                    err.response?.data?.message ||
                    "Failed to add food to cart."
                );

            }

        } finally {

            setAddingFood(null);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section className="popular-dishes">

                <div className="popular-heading">

                    <h2>
                        Popular <span>Dishes</span>
                    </h2>

                </div>

                <div className="popular-loading">
                    Loading dishes...
                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <section className="popular-dishes">

                <div className="popular-heading">

                    <h2>
                        Popular <span>Dishes</span>
                    </h2>

                </div>

                <div className="popular-error">
                    {error}
                </div>

            </section>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <section className="popular-dishes">


            {/* =================================================
                HEADING
            ================================================= */}

            <div className="popular-heading">

                <div>

                    <h2>
                        Popular <span>Dishes</span>
                    </h2>

                    <p className="popular-subtitle">
                        Delicious food made fresh for you
                    </p>

                </div>


                <button
                    type="button"
                    className="view-all-btn"
                >
                    View All
                    <span>›</span>
                </button>

            </div>


            {/* =================================================
                FOOD LIST
            ================================================= */}

            {foods.length === 0 ? (

                <div className="popular-empty">
                    No dishes available.
                </div>

            ) : (

                <div className="dish-list">

                    {foods.map((food, index) => {


                        // =================================================
                        // RATING
                        // =================================================

                        const rating =
                            ratings[food.id];


                        const averageRating =
                            rating?.averageRating != null
                                ? Number(
                                    rating.averageRating
                                ).toFixed(1)
                                : "0.0";


                        const reviewCount =
                            rating?.reviewCount ?? 0;


                        // =================================================
                        // BADGE
                        // =================================================

                        let badge = "Popular";


                        if (index === 0) {

                            badge = "Bestseller";

                        } else if (index === 1) {

                            badge = "Popular";

                        } else if (index === 2) {

                            badge = "New";

                        }


                        // =================================================
                        // IMAGE LOADING STRATEGY
                        //
                        // First 3 cards:
                        //   Eager loading
                        //
                        // Remaining cards:
                        //   Lazy loading
                        //
                        // This prevents every carousel image from
                        // loading immediately.
                        // =================================================

                        const isInitialImage =
                            index < 3;


                        return (

                            <article
                                className="dish-card"
                                key={food.id}
                            >


                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div className="dish-image">

                                    <img
                                        src={food.imageUrl}
                                        alt={
                                            food.name ||
                                            "Food item"
                                        }

                                        /*
                                         * First 3 images are visible/
                                         * near-visible on desktop/tablet.
                                         */
                                        loading={
                                            isInitialImage
                                                ? "eager"
                                                : "lazy"
                                        }

                                        /*
                                         * First image gets the highest
                                         * loading priority.
                                         */
                                        fetchPriority={
                                            index === 0
                                                ? "high"
                                                : "auto"
                                        }

                                        /*
                                         * Decode images without blocking
                                         * the main page rendering.
                                         */
                                        decoding="async"

                                        /*
                                         * Prevent broken image icon
                                         * from looking bad.
                                         */
                                        onError={(e) => {

                                            e.currentTarget.style.display =
                                                "none";

                                        }}
                                    />


                                    <span className="dish-badge">
                                        {badge}
                                    </span>

                                </div>


                                {/* =================================================
                                    CONTENT
                                ================================================= */}

                                <div className="dish-content">


                                    <h3>
                                        {food.name}
                                    </h3>


                                    <p className="dish-description">

                                        {food.description ||
                                            "Delicious food prepared with fresh ingredients."}

                                    </p>


                                    {/* =================================================
                                        PRICE + RATING
                                    ================================================= */}

                                    <div className="dish-bottom">

                                        <strong>
                                            ₹{food.price}
                                        </strong>


                                        <button
                                            type="button"
                                            className="dish-rating"

                                            onClick={() =>
                                                toggleReviews(
                                                    food.id
                                                )
                                            }
                                        >

                                            <span className="star">
                                                ★
                                            </span>

                                            <span>
                                                {averageRating}
                                            </span>

                                            <span className="review-count">
                                                ({reviewCount})
                                            </span>

                                        </button>

                                    </div>


                                    {/* =================================================
                                        ADD TO CART
                                    ================================================= */}

                                    <button
                                        type="button"
                                        className="add-cart-btn"

                                        onClick={() =>
                                            handleAddToCart(
                                                food.id
                                            )
                                        }

                                        disabled={
                                            addingFood ===
                                            food.id
                                        }
                                    >

                                        <span>

                                            {addingFood ===
                                            food.id

                                                ? "Adding..."

                                                : addedFoods[
                                                    food.id
                                                    ]

                                                    ? "Added ✓"

                                                    : "Add to Cart"
                                            }

                                        </span>


                                        <span className="cart-plus">

                                            {addingFood ===
                                            food.id

                                                ? ""

                                                : addedFoods[
                                                    food.id
                                                    ]

                                                    ? ""

                                                    : "+"
                                            }

                                        </span>

                                    </button>


                                    {/* =================================================
                                        VIEW REVIEWS
                                    ================================================= */}

                                    <button
                                        type="button"
                                        className="view-reviews-btn"

                                        onClick={() =>
                                            toggleReviews(
                                                food.id
                                            )
                                        }
                                    >

                                        {openReviews ===
                                        food.id

                                            ? "Hide Reviews ↑"

                                            : "View Reviews ↓"
                                        }

                                    </button>

                                </div>

                            </article>

                        );

                    })}

                </div>

            )}


            {/* =================================================
                REVIEWS
            ================================================= */}

            {openReviews !== null && (

                <div className="food-reviews-wrapper">

                    <FoodReviews
                        foodId={openReviews}
                    />

                </div>

            )}

        </section>

    );

}


/* =========================================
   STATLESS COMPONENTS NOT REQUIRED
========================================= */

export default PopularDishes;