import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [cart, setCart] = useState(null);

    const [addresses, setAddresses] = useState([]);

    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [showAddressForm, setShowAddressForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [savingAddress, setSavingAddress] = useState(false);

    const [placingOrder, setPlacingOrder] = useState(false);

    const [deletingAddressId, setDeletingAddressId] = useState(null);

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("");

    // =====================================================
    // COUPON
    // =====================================================

    const [couponCode, setCouponCode] = useState("");

    const [couponLoading, setCouponLoading] = useState(false);

    const [couponApplied, setCouponApplied] = useState(false);

    const [discount, setDiscount] = useState(0);

    const [couponMessage, setCouponMessage] = useState("");

    const [couponError, setCouponError] = useState("");

    // =====================================================
    // ADDRESS FORM
    // =====================================================

    const [addressForm, setAddressForm] = useState({
        fullName: "",
        mobile: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        addressType: "HOME",
        defaultAddress: false
    });

    // =====================================================
    // GET USER
    // =====================================================

    const getUser = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return user;
        } catch (error) {
            console.error("Invalid user data:", error);
            return null;
        }
    };

    // =====================================================
    // FETCH CART
    // =====================================================

    const fetchCart = async () => {
        try {
            const user = getUser();

            if (!user?.userId) {
                navigate("/login");
                return;
            }

            const response = await api.get(
                `/cart/${user.userId}`
            );

            console.log("CHECKOUT CART:", response.data);

            setCart(response.data);
        } catch (error) {
            console.error("Failed to load cart:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load cart."
            );

            setMessageType("error");
        }
    };

    // =====================================================
    // FETCH ADDRESSES
    // =====================================================

    const fetchAddresses = async () => {
        try {
            const user = getUser();

            if (!user?.userId) {
                navigate("/login");
                return;
            }

            const response = await api.get(
                `/addresses/${user.userId}`
            );

            console.log("ADDRESSES:", response.data);

            const addressList = response.data || [];

            setAddresses(addressList);

            // Automatically select default address
            const defaultAddress = addressList.find(
                (address) => address.defaultAddress === true
            );

            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else if (addressList.length > 0) {
                setSelectedAddressId(addressList[0].id);
            } else {
                setSelectedAddressId(null);
            }
        } catch (error) {
            console.error(
                "Failed to load addresses:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to load addresses."
            );

            setMessageType("error");
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        const loadCheckout = async () => {
            setLoading(true);

            await Promise.all([
                fetchCart(),
                fetchAddresses()
            ]);

            setLoading(false);
        };

        loadCheckout();
    }, []);

    // =====================================================
    // ADDRESS FORM CHANGE
    // =====================================================

    const handleAddressChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        // Mobile validation
        if (name === "mobile") {
            const onlyNumbers = value
                .replace(/\D/g, "")
                .slice(0, 10);

            setAddressForm((previous) => ({
                ...previous,
                mobile: onlyNumbers
            }));

            return;
        }

        // Pincode validation
        if (name === "pincode") {
            const onlyNumbers = value
                .replace(/\D/g, "")
                .slice(0, 6);

            setAddressForm((previous) => ({
                ...previous,
                pincode: onlyNumbers
            }));

            return;
        }

        setAddressForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // =====================================================
    // ADD ADDRESS
    // =====================================================

    const handleAddAddress = async (event) => {
        event.preventDefault();

        setMessage("");
        setMessageType("");

        // Mobile validation
        if (addressForm.mobile.length !== 10) {
            setMessage(
                "Mobile number must contain exactly 10 digits."
            );

            setMessageType("error");

            return;
        }

        // Pincode validation
        if (addressForm.pincode.length !== 6) {
            setMessage(
                "Pincode must contain exactly 6 digits."
            );

            setMessageType("error");

            return;
        }

        try {
            setSavingAddress(true);

            const user = getUser();

            if (!user?.userId) {
                navigate("/login");
                return;
            }

            const response = await api.post(
                `/addresses/${user.userId}`,
                addressForm
            );

            console.log(
                "ADDRESS CREATED:",
                response.data
            );

            setMessage(
                "Address added successfully."
            );

            setMessageType("success");

            setShowAddressForm(false);

            setAddressForm({
                fullName: "",
                mobile: "",
                addressLine: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
                addressType: "HOME",
                defaultAddress: false
            });

            await fetchAddresses();

            // Select newly created address
            if (response.data?.id) {
                setSelectedAddressId(
                    response.data.id
                );
            }
        } catch (error) {
            console.error(
                "Failed to add address:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to add address."
            );

            setMessageType("error");
        } finally {
            setSavingAddress(false);
        }
    };

    // =====================================================
    // DELETE ADDRESS
    // =====================================================

    const handleDeleteAddress = async (addressId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingAddressId(addressId);

            setMessage("");
            setMessageType("");

            await api.delete(
                `/addresses/${addressId}`
            );

            const remainingAddresses =
                addresses.filter(
                    (address) =>
                        address.id !== addressId
                );

            setAddresses(remainingAddresses);

            // If deleted address was selected
            if (selectedAddressId === addressId) {
                const defaultAddress =
                    remainingAddresses.find(
                        (address) =>
                            address.defaultAddress === true
                    );

                if (defaultAddress) {
                    setSelectedAddressId(
                        defaultAddress.id
                    );
                } else if (
                    remainingAddresses.length > 0
                ) {
                    setSelectedAddressId(
                        remainingAddresses[0].id
                    );
                } else {
                    setSelectedAddressId(null);
                }
            }

            setMessage(
                "Address deleted successfully."
            );

            setMessageType("success");
        } catch (error) {
            console.error(
                "Failed to delete address:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to delete address."
            );

            setMessageType("error");
        } finally {
            setDeletingAddressId(null);
        }
    };

    // =====================================================
    // SELECT ADDRESS
    // =====================================================

    const handleSelectAddress = (addressId) => {
        setSelectedAddressId(addressId);

        setMessage("");
        setMessageType("");
    };

    // =====================================================
    // SET DEFAULT ADDRESS
    // =====================================================

    const handleSetDefault = async (addressId) => {
        try {
            const response = await api.patch(
                `/addresses/${addressId}/default`
            );

            console.log(
                "DEFAULT ADDRESS:",
                response.data
            );

            setAddresses((previous) =>
                previous.map((address) => ({
                    ...address,
                    defaultAddress:
                        address.id === addressId
                }))
            );

            setSelectedAddressId(addressId);

            setMessage(
                "Default address updated."
            );

            setMessageType("success");
        } catch (error) {
            console.error(
                "Failed to set default address:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to set default address."
            );

            setMessageType("error");
        }
    };

    // =====================================================
    // APPLY COUPON
    // =====================================================

    const handleApplyCoupon = async () => {
        setCouponError("");
        setCouponMessage("");

        const code = couponCode
            .trim()
            .toUpperCase();

        if (!code) {
            setCouponError(
                "Please enter a coupon code."
            );

            return;
        }

        if (!cart?.totalAmount) {
            setCouponError(
                "Cart total is not available."
            );

            return;
        }

        try {
            setCouponLoading(true);

            const response = await api.get(
                "/coupons/apply",
                {
                    params: {
                        code: code,
                        orderAmount:
                        cart.totalAmount
                    }
                }
            );

            console.log(
                "COUPON RESPONSE:",
                response.data
            );

            const coupon = response.data;

            let calculatedDiscount = 0;

            // Fixed discount amount
            if (
                coupon.discountAmount !== undefined
            ) {
                calculatedDiscount =
                    Number(
                        coupon.discountAmount
                    );
            }

            // Alternative discount field
            else if (
                coupon.discount !== undefined
            ) {
                calculatedDiscount =
                    Number(
                        coupon.discount
                    );
            }

            // Percentage discount
            else if (
                coupon.discountPercentage !== undefined
            ) {
                calculatedDiscount =
                    (
                        Number(cart.totalAmount) *
                        Number(
                            coupon.discountPercentage
                        )
                    ) / 100;

                // Maximum discount
                if (
                    coupon.maxDiscountAmount !==
                    undefined &&
                    coupon.maxDiscountAmount !==
                    null
                ) {
                    calculatedDiscount =
                        Math.min(
                            calculatedDiscount,
                            Number(
                                coupon.maxDiscountAmount
                            )
                        );
                }
            }

            // Never discount more than cart total
            calculatedDiscount = Math.min(
                calculatedDiscount,
                Number(cart.totalAmount)
            );

            setDiscount(calculatedDiscount);

            setCouponApplied(true);

            setCouponCode(code);

            setCouponMessage(
                `Coupon ${code} applied successfully.`
            );
        } catch (error) {
            console.error(
                "Failed to apply coupon:",
                error
            );

            setCouponApplied(false);

            setDiscount(0);

            setCouponError(
                error.response?.data?.message ||
                "Invalid or expired coupon."
            );
        } finally {
            setCouponLoading(false);
        }
    };

    // =====================================================
    // REMOVE COUPON
    // =====================================================

    const handleRemoveCoupon = () => {
        setCouponCode("");

        setCouponApplied(false);

        setDiscount(0);

        setCouponMessage("");

        setCouponError("");
    };

    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {
        setMessage("");
        setMessageType("");

        // Address validation
        if (!selectedAddressId) {
            setMessage(
                "Please select a delivery address."
            );

            setMessageType("error");

            return;
        }

        // Cart validation
        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {
            setMessage(
                "Your cart is empty."
            );

            setMessageType("error");

            return;
        }

        try {
            setPlacingOrder(true);

            const user = getUser();

            if (!user?.userId) {
                navigate("/login");
                return;
            }

            const requestBody = {
                addressId: selectedAddressId,

                couponCode:
                    couponApplied
                        ? couponCode
                            .trim()
                            .toUpperCase()
                        : null
            };

            console.log(
                "PLACE ORDER REQUEST:",
                requestBody
            );

            const response = await api.post(
                `/orders/${user.userId}`,
                requestBody
            );

            console.log(
                "ORDER CREATED:",
                response.data
            );

            setMessage(
                "Order created successfully. Redirecting to payment..."
            );

            setMessageType("success");

            setTimeout(() => {
                navigate("/payment", {
                    state: {
                        orderId: response.data.orderId
                    }
                });
            }, 500);
        } catch (error) {
            console.error(
                "Failed to place order:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to place order."
            );

            setMessageType("error");
        } finally {
            setPlacingOrder(false);
        }
    };

    // =====================================================
    // CALCULATIONS
    // =====================================================

    const subtotal = Number(
        cart?.totalAmount || 0
    );

    const finalTotal = Math.max(
        0,
        subtotal - discount
    );

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="checkout-loading">
                    Loading checkout...
                </div>
            </div>
        );
    }

    // =====================================================
    // EMPTY CART
    // =====================================================

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-empty">

                        <div className="checkout-empty-icon">
                            🛒
                        </div>

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            Add some delicious food
                            before checkout.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <div className="checkout-page">

            <div className="checkout-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="checkout-header">

                    <div>
                        <h1>
                            Check<span>out</span>
                        </h1>

                        <p>
                            Complete your order
                        </p>
                    </div>

                    <button
                        className="checkout-back"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        ← Back to Cart
                    </button>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (
                    <div
                        className={`checkout-message ${messageType}`}
                    >
                        {message}
                    </div>
                )}

                {/* =================================================
                    GRID
                ================================================= */}

                <div className="checkout-grid">

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="checkout-left">

                        {/* =================================================
                            DELIVERY ADDRESS
                        ================================================= */}

                        <div className="checkout-card">

                            <div className="card-title-row">

                                <div>
                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Where should we
                                        deliver your food?
                                    </p>
                                </div>

                                {!showAddressForm && (
                                    <button
                                        type="button"
                                        className="add-address-btn"
                                        onClick={() =>
                                            setShowAddressForm(
                                                true
                                            )
                                        }
                                    >
                                        + Add Address
                                    </button>
                                )}

                            </div>

                            {/* =================================================
                                ADDRESS LIST
                            ================================================= */}

                            {!showAddressForm && (
                                <>
                                    {addresses.length === 0 ? (

                                        <div className="no-address">

                                            <p>
                                                No saved address found.
                                            </p>

                                            <button
                                                type="button"
                                                className="add-address-btn"
                                                onClick={() =>
                                                    setShowAddressForm(
                                                        true
                                                    )
                                                }
                                            >
                                                + Add Address
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="address-list">

                                            {addresses.map(
                                                (address) => (

                                                    <div
                                                        key={
                                                            address.id
                                                        }
                                                        className={`address-card ${
                                                            selectedAddressId ===
                                                            address.id
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleSelectAddress(
                                                                address.id
                                                            )
                                                        }
                                                    >

                                                        {/* RADIO */}

                                                        <div className="address-radio">

                                                            <input
                                                                type="radio"
                                                                name="selectedAddress"
                                                                checked={
                                                                    selectedAddressId ===
                                                                    address.id
                                                                }
                                                                onChange={() =>
                                                                    handleSelectAddress(
                                                                        address.id
                                                                    )
                                                                }
                                                            />

                                                        </div>

                                                        {/* ADDRESS CONTENT */}

                                                        <div className="address-content">

                                                            <div className="address-top">

                                                                <strong>
                                                                    {
                                                                        address.fullName
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        address.addressType
                                                                    }
                                                                </span>

                                                                {address.defaultAddress && (
                                                                    <small>
                                                                        Default
                                                                    </small>
                                                                )}

                                                            </div>

                                                            <p>
                                                                {
                                                                    address.addressLine
                                                                }
                                                            </p>

                                                            <p>
                                                                {
                                                                    address.city
                                                                }
                                                                ,{" "}
                                                                {
                                                                    address.state
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    address.pincode
                                                                }
                                                            </p>

                                                            <p>
                                                                <strong>
                                                                    Mobile:
                                                                </strong>{" "}
                                                                {
                                                                    address.mobile
                                                                }
                                                            </p>

                                                            {address.landmark && (
                                                                <p>
                                                                    <strong>
                                                                        Landmark:
                                                                    </strong>{" "}
                                                                    {
                                                                        address.landmark
                                                                    }
                                                                </p>
                                                            )}

                                                            {/* SET DEFAULT */}

                                                            {!address.defaultAddress && (
                                                                <button
                                                                    type="button"
                                                                    className="set-default-btn"
                                                                    onClick={(
                                                                        event
                                                                    ) => {
                                                                        event.stopPropagation();

                                                                        handleSetDefault(
                                                                            address.id
                                                                        );
                                                                    }}
                                                                >
                                                                    Set as Default
                                                                </button>
                                                            )}

                                                        </div>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            className="delete-address-btn"
                                                            disabled={
                                                                deletingAddressId ===
                                                                address.id
                                                            }
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();

                                                                handleDeleteAddress(
                                                                    address.id
                                                                );
                                                            }}
                                                        >
                                                            {deletingAddressId ===
                                                            address.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    )}
                                </>
                            )}

                            {/* =================================================
                                ADD ADDRESS FORM
                            ================================================= */}

                            {showAddressForm && (

                                <form
                                    className="address-form"
                                    onSubmit={
                                        handleAddAddress
                                    }
                                >

                                    {/* NAME + MOBILE */}

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={
                                                    addressForm.fullName
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                placeholder="Enter full name"
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                Mobile Number
                                            </label>

                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={
                                                    addressForm.mobile
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                placeholder="Enter 10 digit mobile number"
                                                inputMode="numeric"
                                                autoComplete="tel"
                                                maxLength={10}
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group">

                                        <label>
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            name="addressLine"
                                            value={
                                                addressForm.addressLine
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="House No, Street, Area"
                                            required
                                        />

                                    </div>

                                    {/* CITY + STATE */}

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="city"
                                                value={
                                                    addressForm.city
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                placeholder="Enter city"
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                State
                                            </label>

                                            <input
                                                type="text"
                                                name="state"
                                                value={
                                                    addressForm.state
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                placeholder="Enter state"
                                                required
                                            />

                                        </div>

                                    </div>

                                    {/* PINCODE + ADDRESS TYPE */}

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>
                                                Pincode
                                            </label>

                                            <input
                                                type="text"
                                                name="pincode"
                                                value={
                                                    addressForm.pincode
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                placeholder="Enter 6 digit pincode"
                                                inputMode="numeric"
                                                maxLength={6}
                                                required
                                            />

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                Address Type
                                            </label>

                                            <select
                                                name="addressType"
                                                value={
                                                    addressForm.addressType
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                                required
                                            >
                                                <option value="HOME">
                                                    Home
                                                </option>

                                                <option value="OFFICE">
                                                    Office
                                                </option>

                                                <option value="HOSTEL">
                                                    Hostel
                                                </option>

                                                <option value="OTHER">
                                                    Other
                                                </option>
                                            </select>

                                        </div>

                                    </div>

                                    {/* LANDMARK */}

                                    <div className="form-group">

                                        <label>
                                            Landmark
                                        </label>

                                        <input
                                            type="text"
                                            name="landmark"
                                            value={
                                                addressForm.landmark
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="Optional"
                                        />

                                    </div>

                                    {/* DEFAULT */}

                                    <label className="default-checkbox">

                                        <input
                                            type="checkbox"
                                            name="defaultAddress"
                                            checked={
                                                addressForm.defaultAddress
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                        />

                                        <span>
                                            Set as default address
                                        </span>

                                    </label>

                                    {/* FORM BUTTONS */}

                                    <div className="address-form-actions">

                                        <button
                                            type="button"
                                            className="cancel-address-btn"
                                            onClick={() => {
                                                setShowAddressForm(
                                                    false
                                                );

                                                setMessage("");
                                                setMessageType("");
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="save-address-btn"
                                            disabled={
                                                savingAddress
                                            }
                                        >
                                            {savingAddress
                                                ? "Saving..."
                                                : "Save Address"}
                                        </button>

                                    </div>

                                </form>
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div className="checkout-right">

                        {/* =================================================
                            ORDER SUMMARY
                        ================================================= */}

                        <div className="checkout-card">

                            <h2>
                                Order Summary
                            </h2>

                            <div className="checkout-items">

                                {cart.items.map(
                                    (item) => (

                                        <div
                                            className="checkout-item"
                                            key={
                                                item.foodId
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        item.foodName
                                                    }
                                                </strong>

                                                <p>
                                                    ₹
                                                    {
                                                        item.price
                                                    }{" "}
                                                    ×{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>

                                            </div>

                                            <strong>
                                                ₹
                                                {
                                                    item.subtotal
                                                }
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>

                            {/* SUBTOTAL */}

                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toFixed(2)}
                                </strong>

                            </div>

                            {/* DISCOUNT */}

                            {couponApplied && (
                                <div className="summary-row discount-row">

                                    <span>
                                        Coupon Discount
                                    </span>

                                    <strong>
                                        - ₹
                                        {discount.toFixed(2)}
                                    </strong>

                                </div>
                            )}

                            {/* TOTAL */}

                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {finalTotal.toFixed(2)}
                                </strong>

                            </div>

                        </div>

                        {/* =================================================
                            COUPON
                        ================================================= */}

                        <div className="checkout-card">

                            <h2>
                                Coupon
                            </h2>

                            <p>
                                Try coupon:{" "}
                                <strong>
                                    SAVE10
                                </strong>
                            </p>

                            {!couponApplied ? (

                                <div className="coupon-row">

                                    <input
                                        type="text"
                                        value={
                                            couponCode
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCouponCode(
                                                event.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="Enter coupon code"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleApplyCoupon
                                        }
                                        disabled={
                                            couponLoading
                                        }
                                    >
                                        {couponLoading
                                            ? "..."
                                            : "Apply"}
                                    </button>

                                </div>

                            ) : (

                                <div className="coupon-applied">

                                    <div>

                                        <strong>
                                            {couponCode}
                                        </strong>

                                        <span>
                                            Coupon applied
                                        </span>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleRemoveCoupon
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>
                            )}

                            {couponMessage && (
                                <div className="coupon-success">
                                    {couponMessage}
                                </div>
                            )}

                            {couponError && (
                                <div className="coupon-error">
                                    {couponError}
                                </div>
                            )}

                        </div>

                        {/* =================================================
                            PLACE ORDER
                        ================================================= */}

                        <button
                            className="place-order-btn"
                            onClick={
                                handlePlaceOrder
                            }
                            disabled={
                                placingOrder ||
                                !selectedAddressId
                            }
                        >
                            {placingOrder
                                ? "Placing Order..."
                                : !selectedAddressId
                                    ? "Select Address First"
                                    : "Place Order →"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;