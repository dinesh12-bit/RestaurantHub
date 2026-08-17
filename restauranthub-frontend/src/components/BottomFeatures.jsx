import "./BottomFeatures.css";

function BottomFeatures() {
    return (
        <section className="bottom-features">
            <div className="bottom-features-inner">

                <div className="bottom-feature">
                    <div className="bottom-feature-icon">🛵</div>

                    <div>
                        <h3>No Minimum Order</h3>
                        <p>Order in for yourself</p>
                    </div>
                </div>


                <div className="bottom-feature">
                    <div className="bottom-feature-icon">⚡</div>

                    <div>
                        <h3>Lightning Delivery</h3>
                        <p>On all orders</p>
                    </div>
                </div>


                <div className="bottom-feature">
                    <div className="bottom-feature-icon">🎟️</div>

                    <div>
                        <h3>Best Offers</h3>
                        <p>On all prepaid orders</p>
                    </div>
                </div>


                <div className="bottom-feature">
                    <div className="bottom-feature-icon">🛡️</div>

                    <div>
                        <h3>Live Tracking</h3>
                        <p>Track your order live</p>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default BottomFeatures;