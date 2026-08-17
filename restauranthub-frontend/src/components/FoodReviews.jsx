import { useEffect, useState } from "react";
import api from "../services/api";
import "./FoodReviews.css";


function FoodReviews({ foodId }) {

    const [reviews, setReviews] = useState([]);

    const [ratingData, setRatingData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editRating, setEditRating] = useState(0);

    const [editComment, setEditComment] = useState("");

    const [submitting, setSubmitting] = useState(false);


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const getUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch {

            return null;
        }
    };


    /* =====================================================
       LOAD REVIEWS FOR SELECTED FOOD
    ===================================================== */

    const loadReviews = async () => {

        if (!foodId) {
            return;
        }

        try {

            setLoading(true);

            setError("");

            /*
             * Important:
             * Every time foodId changes, old review data
             * is cleared before loading the new food.
             */

            setReviews([]);

            setRatingData(null);

            setEditingId(null);

            const selectedFoodId =
                Number(foodId);


            const reviewsResponse =
                await api.get(
                    `/reviews/food/${selectedFoodId}`
                );


            const ratingResponse =
                await api.get(
                    `/reviews/food/${selectedFoodId}/rating`
                );


            setReviews(
                Array.isArray(
                    reviewsResponse.data
                )
                    ? reviewsResponse.data
                    : []
            );


            setRatingData(
                ratingResponse.data || {
                    averageRating: 0,
                    reviewCount: 0
                }
            );


        } catch (error) {

            console.error(
                "Failed to load reviews:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load reviews."
            );


        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       FOOD ID CHANGE
    ===================================================== */

    useEffect(() => {

        /*
         * Reset form whenever another food is selected.
         */

        setRating(0);

        setComment("");

        setEditingId(null);

        setEditRating(0);

        setEditComment("");

        loadReviews();

    }, [foodId]);


    /* =====================================================
       ADD REVIEW
    ===================================================== */

    const submitReview = async (e) => {

        e.preventDefault();


        const user = getUser();


        if (!user?.userId) {

            alert(
                "Please login to write a review."
            );

            return;
        }


        if (!foodId) {

            alert(
                "Food information is missing."
            );

            return;
        }


        if (rating < 1 || rating > 5) {

            alert(
                "Please select a rating."
            );

            return;
        }


        if (!comment.trim()) {

            alert(
                "Please write a comment."
            );

            return;
        }


        /*
         * Existing backend flow requires
         * delivered Order ID.
         */

        const orderId =
            window.prompt(
                "Enter your delivered Order ID:"
            );


        if (!orderId) {
            return;
        }


        try {

            setSubmitting(true);


            await api.post(
                `/reviews/${user.userId}`,
                {
                    foodId: Number(foodId),

                    orderId: Number(orderId),

                    rating: rating,

                    comment: comment.trim()
                }
            );


            setRating(0);

            setComment("");


            await loadReviews();


            alert(
                "Review added successfully!"
            );


        } catch (error) {

            console.error(
                "Failed to add review:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to add review."
            );


        } finally {

            setSubmitting(false);
        }
    };


    /* =====================================================
       START EDIT
    ===================================================== */

    const startEdit = (review) => {

        setEditingId(review.id);

        setEditRating(
            Number(review.rating) || 0
        );

        setEditComment(
            review.comment || ""
        );
    };


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    const cancelEdit = () => {

        setEditingId(null);

        setEditRating(0);

        setEditComment("");
    };


    /* =====================================================
       UPDATE REVIEW
    ===================================================== */

    const updateReview = async (reviewId) => {

        const user = getUser();


        if (!user?.userId) {

            alert(
                "Please login first."
            );

            return;
        }


        if (
            editRating < 1 ||
            editRating > 5
        ) {

            alert(
                "Please select a rating."
            );

            return;
        }


        if (!editComment.trim()) {

            alert(
                "Please write a comment."
            );

            return;
        }


        try {

            setSubmitting(true);


            const review =
                reviews.find(
                    item =>
                        item.id === reviewId
                );


            if (!review) {

                alert(
                    "Review not found."
                );

                return;
            }


            await api.put(
                `/reviews/${user.userId}/${reviewId}`,
                {
                    foodId: Number(foodId),

                    orderId: review.orderId,

                    rating: editRating,

                    comment: editComment.trim()
                }
            );


            cancelEdit();


            await loadReviews();


            alert(
                "Review updated successfully!"
            );


        } catch (error) {

            console.error(
                "Failed to update review:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to update review."
            );


        } finally {

            setSubmitting(false);
        }
    };


    /* =====================================================
       DELETE REVIEW
    ===================================================== */

    const deleteReview = async (reviewId) => {

        const user = getUser();


        if (!user?.userId) {

            alert(
                "Please login first."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setSubmitting(true);


            await api.delete(
                `/reviews/${user.userId}/${reviewId}`
            );


            await loadReviews();


            alert(
                "Review deleted successfully!"
            );


        } catch (error) {

            console.error(
                "Failed to delete review:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete review."
            );


        } finally {

            setSubmitting(false);
        }
    };


    /* =====================================================
       STARS
    ===================================================== */

    const Stars = ({
                       value = 0,
                       clickable = false,
                       onChange
                   }) => {

        return (

            <div
                className={
                    clickable
                        ? "review-stars clickable-stars"
                        : "review-stars"
                }
            >

                {[1, 2, 3, 4, 5].map(
                    star => (

                        <button
                            type="button"
                            key={star}
                            className={
                                star <= Number(value)
                                    ? "star active"
                                    : "star"
                            }
                            disabled={!clickable}
                            onClick={() => {

                                if (
                                    clickable &&
                                    onChange
                                ) {
                                    onChange(star);
                                }

                            }}
                            aria-label={
                                `${star} star`
                            }
                        >
                            ★
                        </button>

                    )
                )}

            </div>
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <section className="reviews-section">

                <div className="reviews-container">

                    <div className="reviews-loading">

                        <span className="reviews-loading-dot">
                            ●
                        </span>

                        Loading reviews...

                    </div>

                </div>

            </section>
        );
    }


    /* =====================================================
       UI
    ===================================================== */

    return (

        <section className="reviews-section">

            <div className="reviews-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="reviews-header">

                    <div className="reviews-title">

                        <span className="reviews-label">
                            CUSTOMER FEEDBACK
                        </span>

                        <h2>
                            Customer Reviews
                        </h2>

                        <p>
                            See what customers think about this food.
                        </p>

                    </div>


                    {ratingData && (

                        <div className="rating-summary">

                            <strong>
                                {Number(
                                    ratingData.averageRating || 0
                                ).toFixed(1)}
                            </strong>

                            <Stars
                                value={Math.round(
                                    Number(
                                        ratingData.averageRating || 0
                                    )
                                )}
                            />

                            <span>
                                {ratingData.reviewCount || 0}
                                {" "}
                                Reviews
                            </span>

                        </div>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="review-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                    ADD REVIEW
                ================================================= */}

                <div className="add-review-card">

                    <div className="review-card-heading">

                        <div>

                            <h3>
                                Write a Review
                            </h3>

                            <p>
                                Your feedback helps other customers.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={submitReview}
                    >

                        <label>
                            Your Rating
                        </label>


                        <Stars
                            value={rating}
                            clickable={true}
                            onChange={setRating}
                        />


                        <textarea
                            value={comment}
                            onChange={e =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Write your review..."
                            maxLength={1000}
                        />


                        <div className="review-form-footer">

                            <span>
                                {comment.length}/1000
                            </span>


                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    REVIEW LIST
                ================================================= */}

                <div className="reviews-list">

                    {reviews.length === 0 ? (

                        <div className="no-reviews">

                            <div className="no-reviews-icon">
                                ★
                            </div>

                            <h3>
                                No Reviews Yet
                            </h3>

                            <p>
                                Be the first customer to review this food.
                            </p>

                        </div>

                    ) : (

                        reviews.map(review => {

                            const user =
                                getUser();


                            const isOwner =
                                user?.userId &&
                                Number(user.userId) ===
                                Number(review.userId);


                            return (

                                <div
                                    className="review-card"
                                    key={review.id}
                                >

                                    <div className="review-top">

                                        <div className="review-user">

                                            <div className="review-avatar">

                                                {(
                                                    review.userName ||
                                                    "C"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div>

                                                <strong>
                                                    {review.userName ||
                                                        "Customer"}
                                                </strong>

                                                <Stars
                                                    value={
                                                        Number(
                                                            review.rating
                                                        ) || 0
                                                    }
                                                />

                                            </div>

                                        </div>


                                        <small>

                                            {review.createdAt
                                                ? new Date(
                                                    review.createdAt
                                                ).toLocaleDateString()
                                                : ""}

                                        </small>

                                    </div>


                                    {/* EDIT */}

                                    {editingId === review.id ? (

                                        <div className="edit-review">

                                            <Stars
                                                value={
                                                    editRating
                                                }
                                                clickable={true}
                                                onChange={
                                                    setEditRating
                                                }
                                            />


                                            <textarea
                                                value={
                                                    editComment
                                                }
                                                onChange={e =>
                                                    setEditComment(
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={1000}
                                            />


                                            <div className="edit-actions">

                                                <button
                                                    type="button"
                                                    className="save-edit"
                                                    onClick={() =>
                                                        updateReview(
                                                            review.id
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                >
                                                    Save
                                                </button>


                                                <button
                                                    type="button"
                                                    className="cancel-edit"
                                                    onClick={
                                                        cancelEdit
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <>

                                            <p className="review-comment">
                                                {review.comment ||
                                                    "No comment provided."}
                                            </p>


                                            {isOwner && (

                                                <div className="review-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startEdit(
                                                                review
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteReview(
                                                                review.id
                                                            )
                                                        }
                                                        disabled={
                                                            submitting
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            )}

                                        </>

                                    )}

                                </div>

                            );

                        })

                    )}

                </div>

            </div>

        </section>

    );
}


export default FoodReviews;