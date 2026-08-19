import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminFoods.css";


function AdminFoods() {

    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        available: true,
        categoryId: ""
    });


    // =====================================================
    // FETCH FOODS + CATEGORIES
    // =====================================================

    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);


    const fetchFoods = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/admin/foods");

            setFoods(response.data);

        } catch (error) {

            console.error(
                "Failed to load foods:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load foods"
            );

        } finally {

            setLoading(false);
        }
    };


    const fetchCategories = async () => {

        try {

            const response =
                await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );
        }
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    // =====================================================
    // IMAGE UPLOAD - CLOUDINARY
    // =====================================================

    const handleImageUpload = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }


        // IMAGE TYPE VALIDATION
        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file"
            );

            event.target.value = "";

            return;
        }


        // 5 MB LIMIT
        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Image size must be less than 5 MB"
            );

            event.target.value = "";

            return;
        }


        try {

            setUploadingImage(true);


            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            const response =
                await api.post(
                    "/admin/foods/upload-image",
                    formData
                );


            // SAVE CLOUDINARY URL
            setForm(previous => ({
                ...previous,
                imageUrl: response.data
            }));


            alert(
                "Image uploaded successfully"
            );


        } catch (error) {

            console.error(
                "Image upload failed:",
                error
            );


            alert(
                error.response?.data ||
                "Image upload failed"
            );


        } finally {

            setUploadingImage(false);

            event.target.value = "";
        }
    };


    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {

        setEditingFood(null);

        setForm({
            name: "",
            description: "",
            price: "",
            imageUrl: "",
            available: true,
            categoryId: ""
        });

        setShowForm(true);
    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const openEditForm = (food) => {

        setEditingFood(food);

        setForm({
            name: food.name || "",
            description: food.description || "",
            price: food.price || "",
            imageUrl: food.imageUrl || "",
            available:
                food.available !== false,
            categoryId:
                food.categoryId || ""
        });

        setShowForm(true);
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        if (saving || uploadingImage) {
            return;
        }

        setShowForm(false);
        setEditingFood(null);
    };


    // =====================================================
    // SUBMIT FOOD
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!form.name.trim()) {

            alert("Food name is required");

            return;
        }


        if (!form.description.trim()) {

            alert("Description is required");

            return;
        }


        if (!form.price || Number(form.price) <= 0) {

            alert("Please enter a valid price");

            return;
        }


        if (!form.categoryId) {

            alert("Please select a category");

            return;
        }


        const requestData = {

            name:
                form.name.trim(),

            description:
                form.description.trim(),

            price:
                Number(form.price),

            imageUrl:
                form.imageUrl.trim(),

            available:
            form.available,

            categoryId:
                Number(form.categoryId)
        };


        try {

            setSaving(true);

            let response;


            // =================================================
            // UPDATE
            // =================================================

            if (editingFood) {

                response =
                    await api.put(
                        `/admin/foods/${editingFood.id}`,
                        requestData
                    );


                setFoods(previous =>
                    previous.map(food =>
                        food.id === editingFood.id
                            ? response.data
                            : food
                    )
                );

            }


                // =================================================
                // ADD
            // =================================================

            else {

                response =
                    await api.post(
                        "/admin/foods",
                        requestData
                    );


                setFoods(previous => [
                    response.data,
                    ...previous
                ]);
            }


            setShowForm(false);
            setEditingFood(null);


            setForm({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                available: true,
                categoryId: ""
            });


        } catch (error) {

            console.error(
                "Failed to save food:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to save food"
            );


        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // DELETE FOOD
    // =====================================================

    const deleteFood = async (food) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${food.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/admin/foods/${food.id}`
            );


            setFoods(previous =>
                previous.filter(
                    item =>
                        item.id !== food.id
                )
            );


        } catch (error) {

            console.error(
                "Failed to delete food:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete food"
            );
        }
    };


    // =====================================================
    // TOGGLE AVAILABILITY
    // =====================================================

    const toggleAvailability = async (food) => {

        try {

            const response =
                await api.patch(
                    `/admin/foods/${food.id}/availability`
                );


            setFoods(previous =>
                previous.map(item =>
                    item.id === food.id
                        ? response.data
                        : item
                )
            );


        } catch (error) {

            console.error(
                "Failed to update availability:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update availability"
            );
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredFoods =
        foods.filter(food => {

            const keyword =
                search.toLowerCase().trim();


            if (!keyword) {
                return true;
            }


            return (
                food.name
                    ?.toLowerCase()
                    .includes(keyword) ||

                food.categoryName
                    ?.toLowerCase()
                    .includes(keyword) ||

                food.description
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-food-loading">
                Loading foods...
            </div>
        );
    }


    return (

        <div className="admin-foods">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-food-header">

                <div>

                    <h2>
                        Food Management
                    </h2>

                    <p>
                        Manage your restaurant food menu
                    </p>

                </div>


                <button
                    className="add-food-btn"
                    onClick={openAddForm}
                >
                    <span>+</span>
                    Add Food
                </button>

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="food-toolbar">

                <div className="food-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search food or category..."
                        value={search}
                        onChange={event =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="food-count">

                    {filteredFoods.length}
                    {" "}
                    {filteredFoods.length === 1
                        ? "Food"
                        : "Foods"}

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="admin-food-error">

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={fetchFoods}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
                FOOD GRID
            ================================================= */}

            {filteredFoods.length === 0 ? (

                <div className="empty-foods">

                    <div className="empty-food-icon">
                        🍔
                    </div>

                    <h3>
                        No Foods Found
                    </h3>

                    <p>
                        Add your first food item
                        to the menu.
                    </p>

                    <button
                        onClick={openAddForm}
                    >
                        + Add Food
                    </button>

                </div>

            ) : (

                <div className="admin-food-grid">

                    {filteredFoods.map(food => (

                        <div
                            className="admin-food-card"
                            key={food.id}
                        >


                            {/* IMAGE */}

                            <div className="admin-food-image">

                                {food.imageUrl ? (

                                    <img
                                        src={food.imageUrl}
                                        alt={food.name}
                                    />

                                ) : (

                                    <div className="food-no-image">
                                        🍽️
                                    </div>

                                )}


                                <span
                                    className={
                                        food.available
                                            ? "food-available"
                                            : "food-unavailable"
                                    }
                                >
                                    {
                                        food.available
                                            ? "Available"
                                            : "Unavailable"
                                    }
                                </span>

                            </div>


                            {/* CONTENT */}

                            <div className="admin-food-content">

                                <div className="food-title-row">

                                    <h3>
                                        {food.name}
                                    </h3>

                                    <span className="food-id">
                                        #{food.id}
                                    </span>

                                </div>


                                <p className="food-description">

                                    {
                                        food.description ||
                                        "No description"
                                    }

                                </p>


                                <div className="food-meta">

                                    <strong>
                                        ₹
                                        {
                                            Number(
                                                food.price || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        }
                                    </strong>

                                    <span>
                                        {
                                            food.categoryName ||
                                            "No Category"
                                        }
                                    </span>

                                </div>


                                {/* ACTIONS */}

                                <div className="food-actions">

                                    <button
                                        className="food-edit-btn"
                                        onClick={() =>
                                            openEditForm(food)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className={
                                            food.available
                                                ? "food-toggle-btn"
                                                : "food-toggle-btn inactive"
                                        }
                                        onClick={() =>
                                            toggleAvailability(
                                                food
                                            )
                                        }
                                    >
                                        {
                                            food.available
                                                ? "Disable"
                                                : "Enable"
                                        }
                                    </button>


                                    <button
                                        className="food-delete-btn"
                                        onClick={() =>
                                            deleteFood(food)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showForm && (

                <div
                    className="food-modal-overlay"
                    onClick={closeForm}
                >

                    <div
                        className="food-modal"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >


                        <div className="food-modal-header">

                            <div>

                                <span>
                                    FOOD MANAGEMENT
                                </span>

                                <h3>
                                    {
                                        editingFood
                                            ? "Edit Food"
                                            : "Add New Food"
                                    }
                                </h3>

                            </div>


                            <button
                                className="food-modal-close"
                                onClick={closeForm}
                                disabled={
                                    saving ||
                                    uploadingImage
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="food-form"
                        >


                            {/* NAME */}

                            <div className="food-form-group">

                                <label>
                                    Food Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Paneer Tikka"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="food-form-group">

                                <label>
                                    Description *
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter food description"
                                    rows="3"
                                />

                            </div>


                            {/* PRICE + CATEGORY */}

                            <div className="food-form-row">

                                <div className="food-form-group">

                                    <label>
                                        Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="e.g. 249"
                                        min="1"
                                        step="0.01"
                                    />

                                </div>


                                <div className="food-form-group">

                                    <label>
                                        Category *
                                    </label>

                                    <select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Category
                                        </option>

                                        {categories.map(
                                            category => (

                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            {/* =================================================
                                CLOUDINARY IMAGE UPLOAD
                            ================================================= */}

                            <div className="food-form-group">

                                <label>
                                    Food Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={
                                        uploadingImage ||
                                        saving
                                    }
                                />

                                {uploadingImage && (

                                    <p>
                                        Uploading image...
                                    </p>

                                )}

                            </div>


                            {/* IMAGE URL - READ ONLY */}

                            {form.imageUrl && (

                                <div className="food-form-group">

                                    <label>
                                        Cloudinary Image URL
                                    </label>

                                    <input
                                        type="text"
                                        value={form.imageUrl}
                                        readOnly
                                    />

                                </div>

                            )}


                            {/* IMAGE PREVIEW */}

                            {form.imageUrl && (

                                <div className="food-image-preview">

                                    <img
                                        src={form.imageUrl}
                                        alt="Food preview"
                                        onError={event => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                            )}


                            {/* AVAILABLE */}

                            <label className="food-availability-check">

                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={
                                        form.available
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Food is available
                                </span>

                            </label>


                            {/* FORM ACTIONS */}

                            <div className="food-form-actions">

                                <button
                                    type="button"
                                    className="food-cancel-btn"
                                    onClick={closeForm}
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="food-save-btn"
                                    disabled={
                                        saving ||
                                        uploadingImage
                                    }
                                >

                                    {
                                        saving
                                            ? "Saving..."
                                            : uploadingImage
                                                ? "Uploading..."
                                                : editingFood
                                                    ? "Update Food"
                                                    : "Add Food"
                                    }

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default AdminFoods;