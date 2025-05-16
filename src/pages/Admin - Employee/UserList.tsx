import AdminHeader from "../../components/organisms/AdminHeader";
import { useAllUsers } from "../../hooks/useAllUsers";
import { User } from "../../types/User";
//import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { DataTable, DataTableColumn, DataTableAction } from "../../components/organisms/DataTable";
import OrderDateFilter from "../../components/molecules/OrderDateFilter";
import { useState } from "react";

const Userlist = () => {

  const [dateFilter, setDateFilter] = useState("7");
  const { users, loading, error } = useAllUsers();

  const filteredUsers = users.filter(user => {
    if (dateFilter === "all") return true;
    const days = parseInt(dateFilter, 10);
    const userDate = new Date(user.date);
    const now = new Date();
    const diffTime = now.getTime() - userDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });

  const columns: DataTableColumn<User>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => {
        const id = row.id;
        const last4 = id.slice(-4);
        return `xxxx-${last4}`;
      }
    },
    { key: "username", label: "USERNAME" },
    { key: "email", label: "EMAIL" },
    { key: "role", label: "TYPE" },
    {
      key: "date", label: "CREATED", render: (row) => {
        const date = new Date(row.date);
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Users List</h1>
          <OrderDateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
        <DataTable<User>
          columns={columns}
          data={filteredUsers}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default Userlist;
