import React, { useState } from "react";
import AdminHeader from "../../components/organisms/AdminHeader";
import InputField from "../../components/atoms/InputField";
import FormCardLayout from "../../layouts/FormCardLayout";
import Button from "../../components/atoms/Button";
import api from "../../services/api";

const CreateCategory = () => {
  const [form, setForm] = useState({
    name: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const body = {
        ...form,
        username
      };
      await api.post("/api/category/create", body);
      setSuccess("Category created successfully!");
      setForm({ name: "", imageUrl: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <h1 className="font-bold text-black text-center mt-8 mb-20 text-3xl">Employee Portal</h1>
      <main className="flex-1 flex flex-col items-center">
        <FormCardLayout title="Create Category">
          <div className="mb-5" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Category Name" name="name" value={form.name} onChange={handleChange} required />
            <InputField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Add"}
            </Button>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </form>
        </FormCardLayout>
      </main>
    </div>
  );
};

export default CreateCategory;
