import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import PopularDishes from "./components/PopularDishes";
import BottomFeatures from "./components/BottomFeatures";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Orders from "./components/Orders";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminOrders from "./components/admin/AdminOrders";
import AdminFoods from "./components/admin/AdminFoods";
import AdminCategories from "./components/admin/AdminCategories";
import AdminCoupons from "./components/admin/AdminCoupons";
import AdminReviews from "./components/admin/AdminReviews";
import AdminUsers from "./components/admin/AdminUsers";
import AdminSales from "./components/admin/AdminSales";

import MenuSection from "./components/menu/Menu";
import Offers from "./components/Offers";
import About from "./components/About";
import Footer from "./components/Footer";

import "./App.css";


function Home() {

    return (
        <>
            <Navbar />

            <Hero />

            <Categories />

            <PopularDishes />

            <BottomFeatures />

            <Footer />
        </>
    );
}


function App() {

    return (

        <Routes>

            {/* ================= HOME ================= */}

            <Route
                path="/"
                element={<Home />}
            />


            {/* ================= LOGIN ================= */}

            <Route
                path="/login"
                element={
                    <>
                        <Navbar />
                        <Login />
                    </>
                }
            />


            {/* ================= REGISTER ================= */}

            <Route
                path="/register"
                element={
                    <>
                        <Navbar />
                        <Register />
                    </>
                }
            />


            {/* ================= ACCOUNT ================= */}

            <Route
                path="/account"
                element={
                    <>
                        <Navbar />
                        <Account />
                    </>
                }
            />


            {/* ================= CUSTOMER ORDERS ================= */}

            <Route
                path="/orders"
                element={
                    <>
                        <Navbar />
                        <Orders />
                    </>
                }
            />


            {/* ================= CART ================= */}

            <Route
                path="/cart"
                element={
                    <>
                        <Navbar />
                        <Cart />
                    </>
                }
            />


            {/* ================= CHECKOUT ================= */}

            <Route
                path="/checkout"
                element={
                    <>
                        <Navbar />
                        <Checkout />
                    </>
                }
            />


            {/* ================= PAYMENT ================= */}

            <Route
                path="/payment"
                element={
                    <>
                        <Navbar />
                        <Payment />
                    </>
                }
            />


            {/* ================= MENU ================= */}

            <Route
                path="/menu"
                element={
                    <>
                        <Navbar />
                        <MenuSection />
                    </>
                }
            />


            {/* ================= OFFERS ================= */}

            <Route
                path="/offers"
                element={
                    <>
                        <Navbar />
                        <Offers />
                    </>
                }
            />


            {/* ================= ABOUT US ================= */}

            <Route
                path="/about"
                element={
                    <>
                        <Navbar />
                        <About />
                        <Footer />
                    </>
                }
            />


            {/* =================================================
                ADMIN ROUTES
            ================================================= */}

            <Route
                path="/admin"
                element={<AdminLayout />}
            >

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="orders"
                    element={<AdminOrders />}
                />

                <Route
                    path="foods"
                    element={<AdminFoods />}
                />

                <Route
                    path="categories"
                    element={<AdminCategories />}
                />

                <Route
                    path="coupons"
                    element={<AdminCoupons />}
                />

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                <Route
                    path="sales"
                    element={<AdminSales />}
                />

                <Route
                    path="reviews"
                    element={<AdminReviews />}
                />

            </Route>

        </Routes>
    );
}


export default App;