import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import paypal from "../../assets/paypalLogo.png";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";

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
            const valid =
                cardName.trim() !== "" &&
                cardNumber.trim() !== "" &&
                month !== "" &&
                year !== "" &&
                cvc.trim() !== "";

            console.log("Card form valid: ", valid);
            return valid;
        } else {
            const valid = paypalEmail.trim() !== "" && paypalCard.trim() !== "";
            console.log("Paypal form valid: ", valid);
            return valid;
        }
    };

    const handleClick = () => {

        const valid = isFormValid();
        console.log(valid);
        if (!valid) {
            toast.error("Please complete the information.");
            console.log("Formulario incompleto");
            return;
        }
        else {
            buyingProducts();
        }
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
                        <input type="text" placeholder="Cardholder Name" className="w-full border px-4 py-2" value={cardName}
                            onChange={(e) => setCardName(e.target.value)} required />
                        <input type="text" placeholder="Card Number" className="w-full border px-4 py-2" value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)} required />
                        <div className="flex gap-2">
                            <select title="Month" className="border px-4 py-2 w-1/3" value={month}
                                onChange={(e) => setMonth(e.target.value)} required>
                                <option value="">Month</option>
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <select title="Year" className="border px-4 py-2 w-1/3" value={year}
                                onChange={(e) => setYear(e.target.value)} required>
                                <option value="">Year</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                                <option value="2030">2030</option>
                            </select>
                            <input type="text" placeholder="CVC" className="border px-4 py-2 w-1/3" value={cvc}
                                onChange={(e) => setCvc(e.target.value)} required />
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
                        <button onClick={handleClick} className="w-full bg-black text-white py-3 rounded text-center">Pay with card</button>
                    </div>
                ) : (
                    <div className="space-y-4 ">
                        <input type="email" placeholder="Email" className="w-full border px-4 py-2" value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)} required />
                        <input type="text" placeholder="Card Number" className="w-full border px-4 py-2" value={paypalCard}
                            onChange={(e) => setPaypalCard(e.target.value)} required />
                        <button onClick={handleClick} className="w-full bg-black text-white py-3 rounded text-center">Pay Now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDetails;