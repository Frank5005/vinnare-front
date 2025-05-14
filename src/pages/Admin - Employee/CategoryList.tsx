import AdminHeader from "../../components/organisms/AdminHeader";
import { DataTable, DataTableColumn, DataTableAction } from "../../components/organisms/DataTable";
import { useAllCategories, Category } from "../../hooks/useAllCategories";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import api from "../../services/api";

const CategoryList = () => {
  const { categories, loading, error } = useAllCategories();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ imageUrl: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({ imageUrl: category.imageUrl });
    setErrorMessage(null);
  };

  const handleSave = async (id: number) => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      await api.put(`/api/category/${id}`, {
        imageUrl: editForm.imageUrl
      });

      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to update category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setErrorMessage(null);
  };

  const handleInputChange = (value: string) => {
    setEditForm({ imageUrl: value });
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);

      const username = localStorage.getItem("userName");
      if (!username) throw new Error("Username not found in localStorage");

      const config = {
        headers: {
          'username': username
        }
      };

      await api.delete(`/api/category/${id}`, config);
      window.location.reload();
    } catch (error) {
      setErrorMessage("Failed to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Category>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "NAME" },
    {
      key: "imageUrl",
      label: "IMAGE",
      render: (row) =>
        editingId === row.id ? (
          <div>
            <input
              type="text"
              value={editForm.imageUrl}
              onChange={e => setEditForm({ imageUrl: e.target.value })}
              className="w-full px-2 py-1 border rounded mb-2"
              disabled={isSaving}
              placeholder="Paste new image URL"
            />
            {editForm.imageUrl && (
              <img
                src={editForm.imageUrl}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border"
              />
            )}
          </div>
        ) : (
          <img src={row.imageUrl} alt={row.name} className="w-12 h-12 object-cover rounded" />
        )
    },
    { key: "approved", label: "APPROVED", render: (row) => (row.approved ? "✅" : "❌") },
  ];

  const actions: DataTableAction<Category>[] = editingId !== null
    ? [
      {
        icon: <FaCheck />,
        label: "Save",
        onClick: (row) => handleSave(row.id),
        disabled: isSaving || isDeleting,
      },
      {
        icon: <FaTimes />,
        label: "Cancel",
        onClick: handleCancel,
        disabled: isSaving || isDeleting,
      },
    ]
    : [
      {
        icon: <FaEdit />,
        label: "Edit",
        onClick: (row) => handleEdit(row),
        disabled: isSaving || isDeleting,
      },
      {
        icon: <FaTrash />,
        label: "Delete",
        onClick: (row) => handleDelete(row.id),
        disabled: isSaving || isDeleting,
      },
    ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-black text-left">Category List</h1>
        </div>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <DataTable
          columns={columns}
          data={categories}
          actions={actions}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default CategoryList;
