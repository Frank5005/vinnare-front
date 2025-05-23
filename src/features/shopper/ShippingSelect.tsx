import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const shippingOptions = [
    {
        id: "surepost",
        name: "UPS/USPS Surepost",
        details: "4-7 Business Days",
    },
    {
        id: "ground",
        name: "UPS Ground Shipping",
        details: "3-5 Business Days",
    },
];

const ShippingSelect = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        setSelectedOption(id);
    };

    const handleContinue = () => {
        if (!selectedOption) {
            toast.error("Please select a shipping method.");
            return;
        }
        navigate("/checkout-payment");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Shipping</h2>

            {shippingOptions.map((option) => (
                <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`cursor-pointer border p-4 rounded-sm ${selectedOption === option.id
                            ? "border-black bg-white"
                            : "border-gray-300 bg-gray-100"
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <input
                            title="Checkout"
                            type="checkbox"
                            checked={selectedOption === option.id}
                            readOnly
                            className="mt-1"
                        />
                        <div>
                            <h3 className="font-semibold">{option.name}</h3>
                            <p className="text-sm text-gray-600">{option.details}</p>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleContinue}
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-900 transition"
            >
                Continue to payment
            </button>
        </div>
    );
}

export default ShippingSelect;