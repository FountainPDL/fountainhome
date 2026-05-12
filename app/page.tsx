"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/bible/kjv-ot.json") // adjust path if needed
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData("error"));
  }, []);

  return (
    <div>
      {data === null && <p>Loading...</p>}
      {data === "error" && <p>Error loading data</p>}
      {data && <pre>{JSON.stringify(data.slice(0, 5), null, 2)}</pre>}
    </div>
  );
}
