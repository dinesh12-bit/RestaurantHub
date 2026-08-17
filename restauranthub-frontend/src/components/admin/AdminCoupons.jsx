import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminCoupons.css";

function AdminCoupons() {

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [form, setForm] = useState({
        code: "",
        discountPercentage: "",
        maxDiscountAmount: "",
        minimumOrderAmount: "",
        active: true,
        expiryDate: "",
        usageLimit: 100
    });


    useEffect(() => {
        fetchCoupons();
    }, []);


    const fetchCoupons = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/coupons");

            setCoupons(response.data);

        } catch (error) {

            console.error(
                "Failed to load coupons:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load coupons"
            );

        } finally {

            setLoading(false);
        }
    };


    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    const resetForm = () => {

        setForm({
            code: "",
            discountPercentage: "",
            maxDiscountAmount: "",
            minimumOrderAmount: "",
            active: true,
            expiryDate: "",
            usageLimit: 100
        });
    };


    const openAddForm = () => {

        setEditingCoupon(null);
        resetForm();
        setShowForm(true);
    };


    const openEditForm = (coupon) => {

        setEditingCoupon(coupon);

        setForm({
            code: coupon.code || "",
            discountPercentage:
                coupon.discountPercentage || "",
            maxDiscountAmount:
                coupon.maxDiscountAmount || "",
            minimumOrderAmount:
                coupon.minimumOrderAmount || "",
            active:
                coupon.active !== false,
            expiryDate:
                coupon.expiryDate
                    ? coupon.expiryDate.slice(0, 16)
                    : "",
            usageLimit:
                coupon.usageLimit ?? 100
        });

        setShowForm(true);
    };


    const closeForm = () => {

        if (saving) return;

        setShowForm(false);
        setEditingCoupon(null);
        resetForm();
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.code.trim()) {
            alert("Coupon code is required");
            return;
        }

        if (
            !form.discountPercentage ||
            Number(form.discountPercentage) <= 0
        ) {
            alert("Enter valid discount percentage");
            return;
        }

        if (
            Number(form.discountPercentage) > 100
        ) {
            alert("Discount cannot be more than 100%");
            return;
        }

        if (
            form.maxDiscountAmount === "" ||
            Number(form.maxDiscountAmount) < 0
        ) {
            alert("Enter valid maximum discount");
            return;
        }

        if (
            form.minimumOrderAmount === "" ||
            Number(form.minimumOrderAmount) < 0
        ) {
            alert("Enter valid minimum order amount");
            return;
        }

        if (!form.expiryDate) {
            alert("Expiry date is required");
            return;
        }


        const data = {

            code:
                form.code.trim().toUpperCase(),

            discountPercentage:
                Number(form.discountPercentage),

            maxDiscountAmount:
                Number(form.maxDiscountAmount),

            minimumOrderAmount:
                Number(form.minimumOrderAmount),

            active:
            form.active,

            expiryDate:
                form.expiryDate.length === 16
                    ? `${form.expiryDate}:00`
                    : form.expiryDate,

            usageLimit:
                Number(form.usageLimit || 100)
        };


        try {

            setSaving(true);

            let response;


            if (editingCoupon) {

                response =
                    await api.put(
                        `/coupons/${editingCoupon.id}`,
                        data
                    );

                setCoupons(previous =>
                    previous.map(coupon =>
                        coupon.id === editingCoupon.id
                            ? response.data
                            : coupon
                    )
                );

            } else {

                response =
                    await api.post(
                        "/coupons",
                        data
                    );

                setCoupons(previous => [
                    response.data,
                    ...previous
                ]);
            }


            closeForm();

        } catch (error) {

            console.error(
                "Coupon save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save coupon"
            );

        } finally {

            setSaving(false);
        }
    };


    const deleteCoupon = async (coupon) => {

        const confirmed =
            window.confirm(
                `Delete coupon "${coupon.code}"?`
            );

        if (!confirmed) return;


        try {

            await api.delete(
                `/coupons/${coupon.id}`
            );

            setCoupons(previous =>
                previous.filter(
                    item =>
                        item.id !== coupon.id
                )
            );

        } catch (error) {

            console.error(
                "Delete coupon error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete coupon"
            );
        }
    };


    const filteredCoupons =
        coupons.filter(coupon => {

            const keyword =
                search.toLowerCase().trim();

            return (
                coupon.code
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });


    if (loading) {

        return (
            <div className="admin-coupon-loading">
                Loading coupons...
            </div>
        );
    }


    return (

        <div className="admin-coupons">

            {/* HEADER */}

            <div className="admin-coupon-header">

                <div>

                    <h2>
                        Coupon Management
                    </h2>

                    <p>
                        Create and manage discount coupons
                    </p>

                </div>


                <button
                    className="add-coupon-btn"
                    onClick={openAddForm}
                >
                    <span>+</span>
                    Add Coupon
                </button>

            </div>


            {/* TOOLBAR */}

            <div className="coupon-toolbar">

                <div className="coupon-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search coupon code..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <span className="coupon-count">

                    {filteredCoupons.length}
                    {" "}
                    {filteredCoupons.length === 1
                        ? "Coupon"
                        : "Coupons"}

                </span>

            </div>


            {/* EMPTY */}

            {filteredCoupons.length === 0 ? (

                <div className="empty-coupons">

                    <div className="empty-coupon-icon">
                        🎟️
                    </div>

                    <h3>
                        No Coupons Found
                    </h3>

                    <p>
                        Create your first discount coupon.
                    </p>

                    <button
                        onClick={openAddForm}
                    >
                        + Add Coupon
                    </button>

                </div>

            ) : (

                <div className="coupon-grid">

                    {filteredCoupons.map(coupon => (

                        <div
                            className="coupon-card"
                            key={coupon.id}
                        >

                            <div className="coupon-card-top">

                                <div className="coupon-icon">
                                    %
                                </div>

                                <span
                                    className={
                                        coupon.active
                                            ? "coupon-active"
                                            : "coupon-inactive"
                                    }
                                >
                                    {coupon.active
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>


                            <div className="coupon-code">

                                {coupon.code}

                            </div>


                            <div className="coupon-discount">

                                {coupon.discountPercentage}% OFF

                            </div>


                            <div className="coupon-details">

                                <div>
                                    <span>
                                        Max Discount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            coupon.maxDiscountAmount || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Min Order
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            coupon.minimumOrderAmount || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Usage Limit
                                    </span>

                                    <strong>
                                        {coupon.usageLimit}
                                    </strong>
                                </div>

                            </div>


                            <div className="coupon-expiry">

                                <span>
                                    Expires
                                </span>

                                <strong>
                                    {coupon.expiryDate
                                        ? new Date(
                                            coupon.expiryDate
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )
                                        : "-"}
                                </strong>

                            </div>


                            <div className="coupon-actions">

                                <button
                                    className="coupon-edit"
                                    onClick={() =>
                                        openEditForm(coupon)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="coupon-delete"
                                    onClick={() =>
                                        deleteCoupon(coupon)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* MODAL */}

            {showForm && (

                <div
                    className="coupon-modal-overlay"
                    onClick={closeForm}
                >

                    <div
                        className="coupon-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="coupon-modal-header">

                            <div>

                                <span>
                                    COUPON MANAGEMENT
                                </span>

                                <h3>
                                    {editingCoupon
                                        ? "Edit Coupon"
                                        : "Create Coupon"}
                                </h3>

                            </div>


                            <button
                                className="coupon-close"
                                onClick={closeForm}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="coupon-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="coupon-form-group">

                                <label>
                                    Coupon Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    placeholder="e.g. SAVE20"
                                />

                            </div>


                            <div className="coupon-form-row">

                                <div className="coupon-form-group">

                                    <label>
                                        Discount %
                                    </label>

                                    <input
                                        type="number"
                                        name="discountPercentage"
                                        value={
                                            form.discountPercentage
                                        }
                                        onChange={handleChange}
                                        min="0.1"
                                        max="100"
                                        step="0.1"
                                        placeholder="20"
                                    />

                                </div>


                                <div className="coupon-form-group">

                                    <label>
                                        Max Discount ₹
                                    </label>

                                    <input
                                        type="number"
                                        name="maxDiscountAmount"
                                        value={
                                            form.maxDiscountAmount
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="500"
                                    />

                                </div>

                            </div>


                            <div className="coupon-form-row">

                                <div className="coupon-form-group">

                                    <label>
                                        Minimum Order ₹
                                    </label>

                                    <input
                                        type="number"
                                        name="minimumOrderAmount"
                                        value={
                                            form.minimumOrderAmount
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="999"
                                    />

                                </div>


                                <div className="coupon-form-group">

                                    <label>
                                        Usage Limit
                                    </label>

                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={
                                            form.usageLimit
                                        }
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="100"
                                    />

                                </div>

                            </div>


                            <div className="coupon-form-group">

                                <label>
                                    Expiry Date *
                                </label>

                                <input
                                    type="datetime-local"
                                    name="expiryDate"
                                    value={
                                        form.expiryDate
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            <label className="coupon-active-check">

                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleChange}
                                />

                                <span>
                                    Coupon is active
                                </span>

                            </label>


                            <div className="coupon-form-actions">

                                <button
                                    type="button"
                                    className="coupon-cancel"
                                    onClick={closeForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="coupon-save"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCoupon
                                            ? "Update Coupon"
                                            : "Create Coupon"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminCoupons;