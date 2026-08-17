import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminReviews.css";

function AdminReviews() {

    const [reviews, setReviews] = useState([]);
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {

        try {

            setLoading(true);
            setError("");

            const foodResponse =
                await api.get("/admin/foods");

            const foodList =
                foodResponse.data || [];

            setFoods(foodList);

            const reviewRequests =
                foodList.map(food =>
                    api.get(`/reviews/food/${food.id}`)
                );

            const responses =
                await Promise.all(reviewRequests);

            const allReviews =
                responses.flatMap(
                    response => response.data || []
                );

            allReviews.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            setReviews(allReviews);

        } catch (err) {

            console.error(
                "Reviews error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load reviews"
            );

        } finally {

            setLoading(false);
        }
    };


    const filteredReviews =
        reviews.filter(review => {

            const text = `
                ${review.userName || ""}
                ${review.foodName || ""}
                ${review.comment || ""}
                ${review.rating || ""}
            `.toLowerCase();

            return text.includes(
                search.toLowerCase()
            );
        });


    const deleteReview = async (review) => {

        if (!window.confirm(
            "Are you sure you want to delete this review?"
        )) {
            return;
        }

        try {

            /*
             * Current backend delete API requires
             * userId + reviewId.
             */
            await api.delete(
                `/reviews/${review.userId}/${review.id}`
            );

            setReviews(
                prev =>
                    prev.filter(
                        item => item.id !== review.id
                    )
            );

        } catch (err) {

            console.error(
                "Delete review error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete review"
            );
        }
    };


    const renderStars = (rating) => {

        return (
            <div className="review-stars">

                {[1, 2, 3, 4, 5].map(star => (

                    <span
                        key={star}
                        className={
                            star <= rating
                                ? "star active"
                                : "star"
                        }
                    >
                        ★
                    </span>

                ))}

            </div>
        );
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    if (loading) {

        return (
            <div className="reviews-loading">
                Loading reviews...
            </div>
        );
    }


    if (error) {

        return (
            <div className="reviews-error">
                {error}

                <button
                    onClick={loadReviews}
                >
                    ↻ Retry
                </button>
            </div>
        );
    }


    return (

        <div className="admin-reviews">

            {/* ================= HEADER ================= */}

            <div className="reviews-header">

                <div>

                    <h2>
                        Review Management
                    </h2>

                    <p>
                        Manage customer food reviews
                    </p>

                </div>

                <button
                    className="reviews-refresh"
                    onClick={loadReviews}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* ================= SUMMARY ================= */}

            <div className="review-summary">

                <div className="review-summary-card">

                    <div className="summary-icon">
                        ⭐
                    </div>

                    <div>

                        <span>
                            Total Reviews
                        </span>

                        <strong>
                            {reviews.length}
                        </strong>

                    </div>

                </div>


                <div className="review-summary-card">

                    <div className="summary-icon">
                        🍔
                    </div>

                    <div>

                        <span>
                            Reviewed Foods
                        </span>

                        <strong>
                            {new Set(
                                reviews.map(
                                    review => review.foodId
                                )
                            ).size}
                        </strong>

                    </div>

                </div>


                <div className="review-summary-card">

                    <div className="summary-icon">
                        👥
                    </div>

                    <div>

                        <span>
                            Customers
                        </span>

                        <strong>
                            {new Set(
                                reviews.map(
                                    review => review.userId
                                )
                            ).size}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="reviews-toolbar">

                <div className="review-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by customer, food or review..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <span className="review-count">
                    {filteredReviews.length} Reviews
                </span>

            </div>


            {/* ================= EMPTY ================= */}

            {filteredReviews.length === 0 ? (

                <div className="reviews-empty">

                    <div>
                        ⭐
                    </div>

                    <h3>
                        No Reviews Found
                    </h3>

                    <p>
                        There are no customer reviews to display.
                    </p>

                </div>

            ) : (

                /* ================= REVIEW LIST ================= */

                <div className="reviews-list">

                    {filteredReviews.map(review => (

                        <div
                            className="review-card"
                            key={review.id}
                        >

                            <div className="review-card-top">

                                <div className="review-user">

                                    <div className="review-avatar">

                                        {review.userName
                                            ? review.userName
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}

                                    </div>

                                    <div>

                                        <strong>
                                            {review.userName ||
                                                "Unknown User"}
                                        </strong>

                                        <span>
                                            Order #{review.orderId}
                                        </span>

                                    </div>

                                </div>


                                <div className="review-date">

                                    {formatDate(
                                        review.createdAt
                                    )}

                                </div>

                            </div>


                            <div className="review-food">

                                <span className="food-icon">
                                    🍔
                                </span>

                                <strong>
                                    {review.foodName ||
                                        "Unknown Food"}
                                </strong>

                                <span className="food-id">
                                    Food #{review.foodId}
                                </span>

                            </div>


                            <div className="review-rating">

                                {renderStars(
                                    review.rating
                                )}

                                <strong>
                                    {review.rating}/5
                                </strong>

                            </div>


                            {review.comment && (

                                <div className="review-comment">

                                    "{review.comment}"

                                </div>

                            )}


                            <div className="review-card-bottom">

                                <span className="review-id">
                                    Review #{review.id}
                                </span>

                                <button
                                    className="delete-review"
                                    onClick={() =>
                                        deleteReview(review)
                                    }
                                >
                                    🗑 Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminReviews;