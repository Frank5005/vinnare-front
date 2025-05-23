import { useState, useEffect } from "react";
import { Job } from "../types/Job";
import { getJobs, reviewJob } from "../services/adminService";

export const useJobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);
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
        setJobs(jos);
        console.log("Los trabajos son", jos);
      } catch (err: any) {
        //setError(
        //"Error fetching products: " + (err?.message || JSON.stringify(err))
        //);
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
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

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const removeJobFromList = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleAccept = async (job: Job) => {
    setJobId(job.id);
    try {
      await reviewJob(job.id, job.type, "Approve");
      setIsAccepting(true);
      console.log("Job approved successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error approving job", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async (job: Job) => {
    setJobId(job.id);
    try {
      await reviewJob(job.id, job.type, "Reject");
      setIsDeclining(true);
      console.log("Job rejected successfully");
      removeJobFromList(job.id);
    } catch (error) {
      console.log("Error rejecting job", error);
    } finally {
      setIsDeclining(false);
    }
  };

  return {
    loading,
    error,
    jobId,
    filteredJobs,
    dateFilter,
    isAccepting,
    isDeclining,
    handleAccept,
    handleReject,
    setDateFilter,
  };
};
