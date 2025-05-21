import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import paypal from "../../assets/paypalLogo.png";
import { useCart } from "../../hooks/useCart";

const PaymentDetails = () => {
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
    const [saveCard, setSaveCard] = useState(false);
    const { buyingProducts } = useCart();

    // Para tarjeta
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [cvc, setCvc] = useState("");

    // Para PayPal
    const [paypalEmail, setPaypalEmail] = useState("");
    const [paypalCard, setPaypalCard] = useState("");

    const isFormValid = () => {
        if (paymentMethod === "card") {
            return (
                cardName.trim() !== "" &&
                cardNumber.trim() !== "" &&
                month !== "" &&
                year !== "" &&
                cvc.trim() !== ""
            );
        } else {
            return paypalEmail.trim() !== "" && paypalCard.trim() !== "";
        }
    };

    const handleClick = () => {
        if (!isFormValid) {
            alert("Please complete the information.");
            return;
        }
        buyingProducts();
    };

    return (
        <div >
            <div className="flex gap-4 mb-6 ">
                <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex-1 border px-6 py-3 text-sm font-medium ${paymentMethod === "paypal" ? "border-black" : "border-gray-300"
                        }`}
                >
                    <img src={paypal} alt="PayPal" className="h-5 mx-auto" />
                </button>

                <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 border px-6 py-3 text-sm font-medium ${paymentMethod === "card" ? "bg-black text-white" : "border-gray-300"
                        }`}
                >
                    Credit Card
                </button>
            </div>

            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

            <div className="min-h-[350px] min-w-[350px]">
                {paymentMethod === "card" ? (
                    <div className="space-y-4">
                        <input type="text" placeholder="Cardholder Name" className="w-full border px-4 py-2" required />
                        <input type="text" placeholder="Card Number" className="w-full border px-4 py-2" required />
                        <div className="flex gap-2">
                            <select title="Month" className="border px-4 py-2 w-1/3" required>
                                <option>Month</option>
                            </select>
                            <select title="Year" className="border px-4 py-2 w-1/3" required>
                                <option>Year</option>
                            </select>
                            <input type="text" placeholder="CVC" className="border px-4 py-2 w-1/3" required />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <label htmlFor="save-card" className="text-sm font-medium">
                                Save card data for future payments
                            </label>
                            <button
                                title="Save card"
                                onClick={() => setSaveCard(!saveCard)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${saveCard ? "bg-black" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${saveCard ? "translate-x-5" : "translate-x-[2px]"
                                        }`}
                                />
                            </button>
                        </div>
                        <button disabled={!isFormValid()} onClick={handleClick} className="w-full bg-black text-white py-3 rounded text-center">Pay with card</button>
                    </div>
                ) : (
                    <div className="space-y-4 ">
                        <input type="email" placeholder="Email" className="w-full border px-4 py-2" required />
                        <input type="text" placeholder="Card Number" className="w-full border px-4 py-2" required />
                        <button disabled={!isFormValid()} onClick={handleClick} className="w-full bg-black text-white py-3 rounded text-center">Pay Now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDetails;