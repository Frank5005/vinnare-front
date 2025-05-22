import AdminHeader from "../../components/organisms/AdminHeader";
import { useJobsList } from "../../hooks/useJobsList";
import { Job } from "../../types/Job";
import { DataTable, DataTableColumn, DataTableAction } from "../../components/organisms/DataTable";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import OrderDateFilter from "../../components/molecules/OrderDateFilter";
import { useState } from "react";
import { reviewJob } from "../../services/adminService";
import React from 'react';

const JobsList = () => {
  const { loading, error, jobId, filteredJobs, dateFilter, isAccepting, isDeclining, handleAccept, handleReject, setDateFilter } = useJobsList();

  const columns: DataTableColumn<Job>[] = [
    { key: "id", label: "ID" },
    { key: "type", label: "TYPE" },
    {
      key: "name",
      label: "NAME",
      render: (row) => {
        return row.productName !== "Unknown Product"
          ? row.productName
          : row.categoryName;
      },
    },
    { key: "creatorName", label: "CREATED BY" },
    { key: "operation", label: "OPERATION" },
    {
      key: "date", label: "TIMESTAMP", render: (row) => {
        const date = new Date(row.date);
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
    },
  ];

  // DataTable actions
  const actions: DataTableAction<Job>[] = [
    {
      icon: jobId !== null ? <FaCheck /> : <FaEdit />,
      label: jobId !== null ? "Accept" : "Edit",
      onClick: (row) => {
        if (jobId === row.id) {
          handleAccept(row);
        }
      },
      disabled: isAccepting || isDeclining,
    },
    {
      icon: jobId !== null ? <FaTimes /> : <FaTrash />,
      label: jobId !== null ? "Decline" : "Delete",
      onClick: (row) => {
        if (jobId === row.id) {
          handleReject(row);
        }
      },
      disabled: isAccepting || isDeclining,
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
          <h1 className="text-2xl font-bold">Jobs List</h1>
          <OrderDateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
        <DataTable<Job>
          columns={columns}
          data={filteredJobs}
          actions={actions}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default JobsList;
