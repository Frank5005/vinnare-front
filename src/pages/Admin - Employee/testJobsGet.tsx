import { useEffect, useState } from "react";
import axios from "axios";

export default function TestJobsGet() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("https://4d82-3-147-45-32.ngrok-free.app/api/jobs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => setData(res.data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <pre style={{ color: "red" }}>{error}</pre>;
  if (!data) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}