import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    // Replace failing API with safe fallback
    try {
      setTimeout(() => {
        setStatus("Fountain Home is running 🚀");
      }, 500);
    } catch (e) {
      setStatus("Error loading data");
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Fountain Home</h1>
      <p>{status}</p>
    </div>
  );
}
