import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminCategories.css";

function AdminCategories() {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        imageUrl: ""
    });


    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = async () => {

        try {

            setLoading(true);

            const response = await api.get("/categories");

            console.log("Categories:", response.data);

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load categories"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // ADD CATEGORY
    // =====================================================

    const openAddForm = () => {

        setEditingCategory(null);

        setForm({
            name: "",
            description: "",
            imageUrl: ""
        });

        setShowForm(true);
    };


    // =====================================================
    // EDIT CATEGORY
    // =====================================================

    const openEditForm = (category) => {

        setEditingCategory(category);

        setForm({
            name: category.name || "",
            description: category.description || "",
            imageUrl: category.imageUrl || ""
        });

        setShowForm(true);
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingCategory(null);

        setForm({
            name: "",
            description: "",
            imageUrl: ""
        });
    };


    // =====================================================
    // SAVE CATEGORY
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name.trim()) {

            alert("Category name is required");
            return;
        }


        try {

            setSaving(true);


            const data = {
                name: form.name.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim()
            };


            // ==============================
            // UPDATE
            // ==============================

            if (editingCategory) {

                const response = await api.put(
                    `/categories/${editingCategory.id}`,
                    data
                );


                setCategories(previous =>
                    previous.map(category =>
                        category.id === editingCategory.id
                            ? response.data
                            : category
                    )
                );

            }


                // ==============================
                // ADD
            // ==============================

            else {

                const response = await api.post(
                    "/categories",
                    data
                );


                setCategories(previous => [
                    response.data,
                    ...previous
                ]);

            }


            setShowForm(false);
            setEditingCategory(null);

            setForm({
                name: "",
                description: "",
                imageUrl: ""
            });


        } catch (error) {

            console.error(
                "Category save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save category"
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    const deleteCategory = async (category) => {

        const confirmDelete =
            window.confirm(
                `Delete "${category.name}"?`
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/categories/${category.id}`
            );


            setCategories(previous =>
                previous.filter(
                    item =>
                        item.id !== category.id
                )
            );


        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCategories =
        categories.filter(category => {

            const keyword =
                search.toLowerCase().trim();


            return (
                category.name
                    ?.toLowerCase()
                    .includes(keyword) ||

                category.description
                    ?.toLowerCase()
                    .includes(keyword)
            );

        });


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="admin-category-loading">
                Loading categories...
            </div>
        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-categories">


            {/* ================= HEADER ================= */}

            <div className="admin-category-header">

                <div>

                    <h2>
                        Category Management
                    </h2>

                    <p>
                        Manage your food categories
                    </p>

                </div>


                <button
                    type="button"
                    className="add-category-btn"
                    onClick={openAddForm}
                >

                    <span>
                        +
                    </span>

                    Add Category

                </button>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="category-toolbar">

                <div className="category-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <span className="category-count">

                    {filteredCategories.length}
                    {" "}
                    Categories

                </span>

            </div>


            {/* ================= CATEGORY GRID ================= */}

            {filteredCategories.length === 0 ? (

                <div className="empty-categories">

                    <div>
                        📂
                    </div>

                    <h3>
                        No Categories Found
                    </h3>

                    <p>
                        Create your first food category.
                    </p>

                    <button
                        type="button"
                        onClick={openAddForm}
                    >
                        + Add Category
                    </button>

                </div>

            ) : (

                <div className="category-grid">

                    {filteredCategories.map(category => (

                        <div
                            className="category-card"
                            key={category.id}
                        >


                            {/* ================= IMAGE ================= */}

                            <div className="category-icon">

                                {category.imageUrl ? (

                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                    />

                                ) : (

                                    <span>
                                        📂
                                    </span>

                                )}

                            </div>


                            {/* ================= INFO ================= */}

                            <div className="category-info">

                                <div className="category-title">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <span>
                                        #{category.id}
                                    </span>

                                </div>


                                <p>
                                    {category.description ||
                                        "No description"}
                                </p>


                                {category.imageUrl && (

                                    <small className="category-image-path">

                                        {category.imageUrl}

                                    </small>

                                )}

                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="category-actions">

                                <button
                                    type="button"
                                    className="category-edit"
                                    onClick={() =>
                                        openEditForm(category)
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    className="category-delete"
                                    onClick={() =>
                                        deleteCategory(category)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            {showForm && (

                <div
                    className="category-modal-overlay"
                    onClick={closeForm}
                >

                    <div
                        className="category-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* ================= MODAL HEADER ================= */}

                        <div className="category-modal-header">

                            <div>

                                <span>
                                    CATEGORY MANAGEMENT
                                </span>

                                <h3>

                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}

                                </h3>

                            </div>


                            <button
                                type="button"
                                onClick={closeForm}
                                className="category-close"
                            >
                                ×
                            </button>

                        </div>


                        {/* ================= FORM ================= */}

                        <form
                            className="category-form"
                            onSubmit={handleSubmit}
                        >


                            {/* CATEGORY NAME */}

                            <div className="category-form-group">

                                <label>
                                    Category Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Pizza"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="category-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter category description"
                                    rows="4"
                                />

                            </div>


                            {/* IMAGE PATH */}

                            <div className="category-form-group">

                                <label>
                                    Category Image
                                </label>

                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleChange}
                                    placeholder="/images/category-pizza.webp"
                                />

                                <small className="category-image-help">

                                    Example:
                                    {" "}
                                    /images/category-pizza.webp

                                </small>

                            </div>


                            {/* IMAGE PREVIEW */}

                            {form.imageUrl && (

                                <div className="category-image-preview">

                                    <img
                                        src={form.imageUrl}
                                        alt="Category preview"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>

                            )}


                            {/* ================= ACTIONS ================= */}

                            <div className="category-form-actions">

                                <button
                                    type="button"
                                    className="category-cancel"
                                    onClick={closeForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="category-save"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Update Category"
                                            : "Add Category"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}

export default AdminCategories;
