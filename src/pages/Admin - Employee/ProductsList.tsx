import AdminHeader from "../../components/AdminHeader";
import { useAllProducts, Product } from "../../hooks/useAllProducts";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import api from "../../services/api";

const ProductsList = () => {
  const { products, loading, error: fetchError } = useAllProducts();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: 0,
    quantity: 0,
    available: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

      // Preparar los datos para la API
      const updateData = {
        title: editForm.title,
        price: editForm.price,
        quantity: editForm.quantity,
        available: editForm.available
      };

      // Llamar al endpoint PUT
      await api.put(`/api/product/${id}`, updateData);

      // Actualizar el estado local
      const updatedProducts = products.map(product => 
        product.id === id 
          ? { ...product, ...editForm }
          : product
      );
      
      // Forzar una recarga de los productos
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
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Products List</h1>
        </div>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">TITLE</th>
                <th className="px-4 py-3">OWNER ID</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">IMAGE</th>
                <th className="px-4 py-3">APPROVED</th>
                <th className="px-4 py-3">QUANTITY</th>
                <th className="px-4 py-3">AVAILABLE</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-3">{product.id}</td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        disabled={isSaving}
                      />
                    ) : (
                      product.title
                    )}
                  </td>
                  <td className="px-4 py-3">{product.ownerId}</td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        step="0.01"
                        disabled={isSaving}
                      />
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3">{product.approved ? "✅" : "❌"}</td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        min="0"
                        disabled={isSaving}
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.available}
                        onChange={(e) => handleInputChange('available', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        min="0"
                        disabled={isSaving}
                      />
                    ) : (
                      product.available
                    )}
                  </td>
                  <td className="px-4 py-3">{new Date(product.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {editingId === product.id ? (
                      <>
                        <button
                          className={`text-green-600 hover:text-green-800 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Save"
                          onClick={() => handleSave(product.id)}
                          disabled={isSaving}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className={`text-red-600 hover:text-red-800 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Cancel"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                          onClick={() => handleEdit(product)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => {/* lógica para eliminar */}}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProductsList;
