import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/organisms/AdminHeader";
import React from 'react';

const adminButtons = [
  { label: "Create Product", path: "/admin/create-product", roles: ["Seller", "Admin"] },
  { label: "Create Category", path: "/admin/create-category", roles: ["Seller", "Admin"] },
  { label: "List Products", path: "/admin/products-list", roles: ["Seller", "Admin"] },
  { label: "List Categories", path: "/admin/categories-list", roles: ["Seller", "Admin"] },
  { label: "Review Jobs", path: "/admin/jobs-list", roles: ["Admin"] },
  { label: "Create Employee", path: "/admin/create-employee", roles: ["Admin"] },
  { label: "View All Users", path: "/admin/view-all-users", roles: ["Admin"] },
];

const AdminEmployeeHomepage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "";

  const visibleButtons = adminButtons.filter(btn => btn.roles.includes(role));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 flex flex-col items-center mt-8">
  <h1 className="font-bold text-black mb-12">Employee Portal</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {visibleButtons.map(btn => (
      <button
        key={btn.label}
        onClick={() => navigate(btn.path)}
        className="bg-white border rounded-lg shadow p-6 text-lg font-semibold hover:bg-gray-100 transition"
      >
        {btn.label}
      </button>
    ))}
  </div>
</main>
    </div>
  );
};

export default AdminEmployeeHomepage;
  