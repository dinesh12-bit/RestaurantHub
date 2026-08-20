import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./Menu.css";

function Menu() {

    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ratings, setRatings] = useState({});

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [loading, setLoading] = useState(true);

    const [addingFoodId, setAddingFoodId] =
        useState(null);

    const [addedFoodId, setAddedFoodId] =
        useState(null);


    /* =====================================================
       LOAD FOODS + CATEGORIES
    ===================================================== */

    useEffect(() => {
        loadMenuData();
    }, []);


    const loadMenuData = async () => {

        try {

            setLoading(true);

            const [
                foodResponse,
                categoryResponse
            ] = await Promise.all([
                api.get("/foods"),
                api.get("/categories")
            ]);


            const foodData =
                foodResponse.data || [];

            setFoods(foodData);

            setCategories(
                categoryResponse.data || []
            );


            /* =================================================
               LOAD REAL RATINGS
            ================================================= */

            const ratingMap = {};

            await Promise.all(
                foodData.map(async food => {

                    try {

                        const response =
                            await api.get(
                                `/reviews/food/${food.id}/rating`
                            );

                        ratingMap[food.id] =
                            response.data;

                    } catch (error) {

                        console.log(
                            `No rating available for food ${food.id}`
                        );

                        ratingMap[food.id] = null;
                    }

                })
            );


            setRatings(ratingMap);


        } catch (error) {

            console.error(
                "Failed to load menu:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const menuCategories = useMemo(() => {

        return [
            "All",
            ...categories.map(
                category => category.name
            )
        ];

    }, [categories]);


    /* =====================================================
       FILTER FOODS
    ===================================================== */

    const filteredFoods = useMemo(() => {

        const availableFoods =
            foods.filter(
                food =>
                    food.available !== false
            );


        if (selectedCategory === "All") {

            return availableFoods;
        }


        return availableFoods.filter(
            food =>
                food.categoryName ===
                selectedCategory
        );

    }, [
        foods,
        selectedCategory
    ]);


    /* =====================================================
       ADD TO CART
    ===================================================== */

    const addToCart = async food => {

        try {

            const token =
                localStorage.getItem("token");

            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );


            if (!token || !user?.userId) {

                alert("Please login first.");

                return;
            }


            setAddingFoodId(food.id);


            await api.post(
                `/cart/${user.userId}`,
                {
                    foodId: food.id,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setAddedFoodId(food.id);


            setTimeout(() => {

                setAddedFoodId(current =>
                    current === food.id
                        ? null
                        : current
                );

            }, 1500);


        } catch (error) {

            console.error(
                "Failed to add food:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to add item to cart"
            );


        } finally {

            setAddingFoodId(null);
        }
    };


    /* =====================================================
       RATING
    ===================================================== */

    const renderRating = foodId => {

        const rating =
            ratings[foodId];


        /*
         * No review yet
         */

        if (
            !rating ||
            !rating.reviewCount ||
            Number(rating.reviewCount) === 0
        ) {

            return (
                <span className="food-no-rating">
                    No reviews yet
                </span>
            );
        }


        const average =
            Number(
                rating.averageRating || 0
            );


        const rounded =
            Math.round(average);


        return (
            <div className="food-rating">

                <div className="rating-stars">

                    {[1, 2, 3, 4, 5].map(
                        star => (

                            <span
                                key={star}
                                className={
                                    star <= rounded
                                        ? "star filled"
                                        : "star"
                                }
                            >
                                ★
                            </span>

                        )
                    )}

                </div>


                <span className="rating-number">
                    {average.toFixed(1)}
                </span>


                <span className="rating-count">
                    ({rating.reviewCount})
                </span>

            </div>
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <section className="menu-page">

                <div className="menu-wrapper">

                    <div className="menu-loading">
                        Loading menu...
                    </div>

                </div>

            </section>
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <section className="menu-page">

            <div className="menu-wrapper">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="menu-header">

                    <p className="menu-label">
                        RESTAURANTHUB
                    </p>

                    <h1>
                        Our <span>Menu</span>
                    </h1>

                    <p className="menu-subtitle">
                        Delicious food made fresh for you
                    </p>

                </div>


                {/* =================================================
                    CATEGORY FILTER
                ================================================= */}

                <div className="menu-categories">

                    {menuCategories.map(
                        category => (

                            <button
                                key={category}
                                type="button"
                                className={
                                    selectedCategory === category
                                        ? "menu-category active"
                                        : "menu-category"
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }
                            >
                                {category}
                            </button>

                        )
                    )}

                </div>


                {/* =================================================
                    FOOD HEADER
                ================================================= */}

                <div className="food-list-header">

                    <div>

                        <h2>
                            {selectedCategory === "All"
                                ? "All Dishes"
                                : selectedCategory}
                        </h2>

                        <p>
                            Fresh and delicious dishes
                        </p>

                    </div>


                    <span>
                        {filteredFoods.length} items
                    </span>

                </div>


                {/* =================================================
                    FOOD LIST
                ================================================= */}

                {filteredFoods.length === 0 ? (

                    <div className="empty-food">

                        <h3>
                            No food available
                        </h3>

                        <p>
                            No dishes are available in this category.
                        </p>

                    </div>

                ) : (

                    <div className="food-list">

                        {filteredFoods.map(
                            food => (

                                <article
                                    className="food-row"
                                    key={food.id}
                                >


                                    {/* IMAGE */}

                                    <div className="food-image-box">

                                        <img
                                            src={
                                                food.imageUrl ||
                                                "/images/food-placeholder.webp"
                                            }
                                            alt={food.name}
                                            onError={event => {

                                                event.currentTarget.src =
                                                    "/images/food-placeholder.webp";

                                            }}
                                        />

                                    </div>


                                    {/* DETAILS */}

                                    <div className="food-details">


                                        <div className="food-main">


                                            <div className="food-name-rating">

                                                <h3>
                                                    {food.name}
                                                </h3>

                                                {renderRating(
                                                    food.id
                                                )}

                                            </div>


                                            <p className="food-description">

                                                {food.description ||
                                                    "Delicious food prepared with fresh ingredients."}

                                            </p>

                                        </div>


                                        {/* BOTTOM */}

                                        <div className="food-bottom">


                                            <strong className="food-price">
                                                ₹{food.price}
                                            </strong>


                                            <button
                                                type="button"
                                                className="add-food-btn"
                                                disabled={
                                                    addingFoodId ===
                                                    food.id
                                                }
                                                onClick={() =>
                                                    addToCart(food)
                                                }
                                            >

                                                {addingFoodId ===
                                                food.id

                                                    ? "Adding..."

                                                    : addedFoodId ===
                                                    food.id

                                                        ? "Added ✓"

                                                        : (
                                                            <>
                                                                Add
                                                                <span>
                                                                    +
                                                                </span>
                                                            </>
                                                        )}

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}

export default Menu;
