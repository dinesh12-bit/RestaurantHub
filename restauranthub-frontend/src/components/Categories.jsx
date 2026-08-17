import api from "../services/api";
import { useEffect, useState } from "react";
import "./Categories.css";

function Categories() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);


    const loadCategories = async () => {

        try {

            const response =
                await api.get("/categories");

            console.log(
                "Categories:",
                response.data
            );

            setCategories(response.data);

        } catch (error) {

            console.error(
                "Unable to load categories:",
                error
            );

        }
    };


    return (

        <section className="categories">

            <div className="section-heading">

                <h2>
                    Explore <span>Categories</span>
                </h2>

                <button type="button">
                    View All <span>›</span>
                </button>

            </div>


            <div className="category-list">

                {categories.map((category) => (

                    <div
                        className="category-card"
                        key={category.id}
                    >

                        <div className="category-image">

                            {category.imageUrl ? (

                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                />

                            ) : (

                                <div className="category-placeholder">
                                    🍽️
                                </div>

                            )}

                        </div>


                        <h3>
                            {category.name}
                        </h3>


                        <p>
                            Explore {category.name}
                        </p>

                    </div>

                ))}


                <div className="category-card more-category">

                    <div className="more-icon">

                        <span>
                            +
                        </span>

                    </div>

                    <h3>
                        More
                    </h3>

                    <p>
                        See All
                    </p>

                </div>

            </div>

        </section>

    );
}

export default Categories;