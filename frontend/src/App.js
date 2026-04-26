import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL || "http://localhost:8080")
      .then((res) => res.json())
      .then((data) => {
        setMessage(`${data.message} - ${data.guid}`);
      })
      .catch(() => {
        setMessage("ERROR: Could not connect to backend");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DevOps Tech Challenge</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;