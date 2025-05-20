import { useState, useEffect } from "react";
import { Job } from "../types/Job";
import { getJobs, reviewJob } from "../services/adminService";

export const useJobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsIds, setJobsIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("7");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jos = await getJobs();
      const ids = jos.map((p: any) => p.id);
      setJobs(jos);
      setJobsIds(ids);
      console.log(jos);
      console.log(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  const inJobs = (jobId: number) => {
    return jobsIds.includes(jobId);
  };
  */

  const filteredJobs = jobs.filter((job: Job) => {
    if (dateFilter === "all") return true;
    const days = parseInt(dateFilter, 10);
    const jobDate = new Date(job.date);
    const now = new Date();
    const diffTime = now.getTime() - jobDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });

  const removeJobFromList = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleAccept = async (job: Job) => {
    try {
      await reviewJob(job.id, job.type, "Approve");
      console.log("Job approved successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error approving job", error);
    }
  };

  const handleReject = async (job: Job) => {
    try {
      await reviewJob(job.id, job.type, "Reject");
      console.log("Job rejected successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error rejecting job", error);
    }
  };

  return {
    loading,
    error,
    filteredJobs,
    dateFilter,
    handleAccept,
    handleReject,
    setDateFilter,
  };
};
