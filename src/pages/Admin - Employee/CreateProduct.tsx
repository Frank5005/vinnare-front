import React, { useState } from "react";
import AdminHeader from "../../components/organisms/AdminHeader";
import InputField from "../../components/atoms/InputField";
import FormCardLayout from "../../layouts/FormCardLayout";
import api from "../../services/api";
import Button from "../../components/atoms/Button";

const CreateProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
    quantity: "",
    available: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const username = localStorage.getItem("userName");
      if (!username) throw new Error("No username found in localStorage");

      const userRes = await api.get(`/api/user/id/${username}`);
      const ownerId = userRes.data.id;

      const body = {
        ...form,
        ownerId,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        available: parseInt(form.available),
        username
      };
      await api.post("/api/product/create", body);

      setSuccess("Product created successfully!");
      setForm({
        title: "",
        price: "",
        category: "",
        description: "",
        image: "",
        quantity: "",
        available: ""
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="font-bold text-black mb-12">Employee Portal</h1>
        <FormCardLayout title="Create Product">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Title" name="title" value={form.title} onChange={handleChange} required />
            <InputField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <InputField label="Category" name="category" value={form.category} onChange={handleChange} required />
            <InputField label="Description" name="description" value={form.description} onChange={handleChange} required />
            <InputField label="Image URL" name="image" value={form.image} onChange={handleChange} required />
            <InputField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
            <InputField label="Available" name="available" type="number" value={form.available} onChange={handleChange} required />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </form>
        </FormCardLayout>
      </main>
    </div >
  );
};

export default CreateProduct;