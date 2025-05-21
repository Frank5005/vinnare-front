import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    region: "",
    zipcode: "",
    email: "",
    saveInfo: false,
  });

  const [error, setError] = useState<string | null>(null);

  const {
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<FormData>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" && "checked" in e.target
      ? (e.target as HTMLInputElement).checked
      : value,
    }));
  };

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      navigate("/checkout-shipping");
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during address checkout');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2" required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-2" required />
      </div>

      <input name="address" placeholder="Address" onChange={handleChange} className="border p-2 w-full" required />
      <input name="apartment" placeholder="Apartment, suite, etc (optional)" onChange={handleChange} className="border p-2 w-full" />
      <input name="city" placeholder="City" onChange={handleChange} className="border p-2 w-full" required />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select title="Country" name="country" onChange={handleChange} className="border p-2" required>
          <option value="">Country</option>
          <option value="US">United States</option>
          <option value="CO">Colombia</option>
        </select>
        <input name="region" placeholder="Region/City" onChange={handleChange} className="border p-2" required />
        <input name="zipcode" placeholder="Zipcode" onChange={handleChange} className="border p-2" required />
      </div>

      <input name="optional" placeholder="Optional" onChange={handleChange} className="border p-2 w-full" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="saveInfo" onChange={handleChange} />
        Save contact information
      </label>

      <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white py-3 font-semibold">
        {isSubmitting ? "Continue..." : "Continue to shipping"}
      </button>
    </form>
  );
};

export default AddressForm;

