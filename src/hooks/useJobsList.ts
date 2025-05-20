import { useState, useEffect } from "react";
import { Job } from "../types/Job";
import { getJobs } from "../services/adminService";

export const useJobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const jobss = await getJobs();
        setJobs(jobss);
      } catch (err: any) {
        setError(
          "Error fetching jobs: " + (err?.message || JSON.stringify(err))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return { jobs, loading, error };
};
