import AdminHeader from "../../components/organisms/AdminHeader";
import { useJobsList } from "../../hooks/useJobsList";
import { Job } from "../../types/Job";
import { DataTable, DataTableColumn } from "../../components/organisms/DataTable";
import { FaCheck, FaTimes } from "react-icons/fa";
import OrderDateFilter from "../../components/molecules/OrderDateFilter";
import { useState } from "react";
import { reviewJob } from "../../services/adminService";
import React from 'react';


const JobsList = () => {

  const [dateFilter, setDateFilter] = useState("7");
  const { jobs, loading, error } = useJobsList();
  const [localJobs, setLocalJobs] = useState<Job[]>(jobs);

  const removeJobFromList = (id: number) => {
    setLocalJobs(prev => prev.filter(j => j.id !== id));
  };

  const filteredJobs = jobs.filter((job: Job) => {
    if (dateFilter === "all") return true;
    const days = parseInt(dateFilter, 10);
    const jobDate = new Date(job.date);
    const now = new Date();
    const diffTime = now.getTime() - jobDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });

  const handleAccept = async (job: Job) => {
    try {
      await reviewJob(job.id, job.type, "Approve");
      console.log("Job approved successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error approving job");
    }
  };

  const handleReject = async (job: Job) => {
    try {
      await reviewJob(job.id, job.type, "Reject");
      console.log("Job rejected successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error rejecting job");
    }
  };

  const columns: DataTableColumn<Job>[] = [
    { key: "id", label: "ID" },
    { key: "type", label: "TYPE" },
    { key: "name", label: "NAME" },
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
    {
      key: "action",
      label: "ACTION",
      render: (row) => (
        <div className="flex gap-2">
          <button title="Accept" onClick={() => handleAccept(row)}><FaCheck className="text-green-500 hover:text-green-800" /></button>
          <button title="Decline" onClick={() => handleReject(row)}><FaTimes className="text-red-500 hover:text-red-800" /></button>
        </div>
      )
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
          <h1 className="text-2xl font-bold">Jobs List</h1>
          <OrderDateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
        <DataTable<Job>
          columns={columns}
          data={filteredJobs}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default JobsList;
