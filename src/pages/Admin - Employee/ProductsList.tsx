import AdminHeader from "../../components/AdminHeader";
import { useAllProducts, Product } from "../../hooks/useAllProducts";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { DataTable, DataTableColumn, DataTableAction } from "../../components/DataTable";
import { useState } from "react";
import api from "../../services/api";
import OrderDateFilter from "../../components/ui/OrderDateFilter";

const ProductsList = () => {
  const [dateFilter, setDateFilter] = useState<string>("7");
  const { products, loading, error: fetchError } = useAllProducts();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: 0,
    quantity: 0,
    available: 0
  });
  const filteredProducts = products.filter(product => {
    if (dateFilter === "all") return true;
    const days = parseInt(dateFilter, 10);
    const productDate = new Date(product.date);
    const now = new Date();
    const diffTime = now.getTime() - productDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      available: product.available
    });
    setErrorMessage(null);
  };

  const handleSave = async (id: number) => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      const originalProduct = products.find(p => p.id === id);
      if (!originalProduct) {
        throw new Error('Product not found');
      }

      const updateData = {
        title: editForm.title,
        price: editForm.price,
        quantity: editForm.quantity,
        available: editForm.available,
        category: originalProduct.category
      };

      await api.put(`/api/product/${id}`, updateData);
      window.location.reload();
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setErrorMessage(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: field === 'title' ? value : Number(value)
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);

      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('Username not found in localStorage');
      }

      const config = {
        headers: {
          'Username': username
        }
      };

      await api.delete(`/api/product/${id}`, config);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // DataTable columns
  const columns: DataTableColumn<Product>[] = [
    { key: "id", label: "ID" },
    {
      key: "title", label: "TITLE", render: (row) => (
        editingId === row.id ? (
          <input
            type="text"
            value={editForm.title}
            onChange={e => handleInputChange('title', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            disabled={isSaving}
          />
        ) : (
          row.title
        )
      )
    },
    { key: "ownerId", label: "OWNER ID" },
    {
      key: "price", label: "PRICE", render: (row) => (
        editingId === row.id ? (
          <input
            type="number"
            value={editForm.price}
            onChange={e => handleInputChange('price', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            step="0.01"
            disabled={isSaving}
          />
        ) : (
          `$${row.price.toFixed(2)}`
        )
      )
    },
    { key: "category", label: "CATEGORY" },
    {
      key: "image", label: "IMAGE", render: (row) => (
        <img src={row.image} alt={row.title} className="w-12 h-12 object-cover rounded" />
      )
    },
    { key: "approved", label: "APPROVED", render: (row) => (row.approved ? "✅" : "❌") },
    {
      key: "quantity", label: "QUANTITY", render: (row) => (
        editingId === row.id ? (
          <input
            type="number"
            value={editForm.quantity}
            onChange={e => handleInputChange('quantity', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            min="0"
            disabled={isSaving}
          />
        ) : (
          row.quantity
        )
      )
    },
    {
      key: "available", label: "AVAILABLE", render: (row) => (
        editingId === row.id ? (
          <input
            type="number"
            value={editForm.available}
            onChange={e => handleInputChange('available', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            min="0"
            disabled={isSaving}
          />
        ) : (
          row.available
        )
      )
    },
    { key: "date", label: "DATE", render: (row) => new Date(row.date).toLocaleDateString() },
  ];

  // DataTable actions
  const actions: DataTableAction<Product>[] = [
    {
      icon: editingId !== null ? <FaCheck /> : <FaEdit />,
      label: editingId !== null ? "Save" : "Edit",
      onClick: (row) => {
        if (editingId === row.id) {
          handleSave(row.id);
        } else {
          handleEdit(row);
        }
      },
      disabled: isSaving || isDeleting,
    },
    {
      icon: editingId !== null ? <FaTimes /> : <FaTrash />,
      label: editingId !== null ? "Cancel" : "Delete",
      onClick: (row) => {
        if (editingId === row.id) {
          handleCancel();
        } else {
          handleDelete(row.id);
        }
      },
      disabled: isSaving || isDeleting,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="sticky top-0 z-50">
          <AdminHeader />
        </div>
        <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
          <div className="text-center py-8">Loading products...</div>
        </main>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="sticky top-0 z-50">
          <AdminHeader />
        </div>
        <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
          <div className="text-center text-red-500 py-8">{fetchError}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Products List</h1>
          <div>
            <OrderDateFilter value={dateFilter} onChange={setDateFilter} />
          </div>
        </div>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <DataTable
          columns={columns}
          data={filteredProducts}
          actions={actions}
          loading={loading}
          error={fetchError || errorMessage}
        />
      </main>
    </div>
  );
};

export default ProductsList;
