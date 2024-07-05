import React, { useState } from "react";

const Fetchapi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("POST");

  const handleSubmit = () => {
    let url = "https://jsonplaceholder.typicode.com/users";
    let options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method === "POST") {
      options.method = "POST";
      options.body = JSON.stringify({
        name,
        email,
      });
    } else if (method === "PUT") {
      if (!id) {
        setError("Please enter a user ID for updating.");
        return;
      }
      url += `/${id}`;
      options.method = "PUT";
      options.body = JSON.stringify({
        name,
        email,
      });
    } else if (method === "GET") {
      if (!id) {
        setError("Please enter a user ID for fetching.");
        return;
      }
      url += `/${id}`;
    }

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setError("");
      })
      .catch((error) => {
        console.error("Error", error);
        if (error.message.includes("404")) {
          setError("User not found");
        } else if (error.message.includes("403")) {
          setError("API rate limit exceeded");
        } else if (error.message.includes("400")) {
          setError("Bad request");
        } else {
          setError("An error occurred while fetching the data.");
        }
        setData(null);
      });
  };
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>User Form</h2>
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          setError("");
          setData(null);
        }}
        style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
      >
        <option value="GET">Fetch User (GET)</option>
        <option value="POST">Create User (POST)</option>
        <option value="PUT">Update User (PUT)</option>
      </select>

      {(method === "GET" || method === "PUT") && (
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter user ID"
          style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
        />
      )}

      {(method === "POST" || method === "PUT") && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px",
          width: "100%",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      <div className="user-info" style={{ marginTop: "20px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {data && (
          <div>
            <h3>User Info</h3>
            {method === "GET" || method === "PUT" ? (
              <>
                <p>ID: {data.id}</p>
                <p>Name: {data.name}</p>
                <p>Email: {data.email}</p>
                <p>Address: {data.address?.city}</p>
              </>
            ) : (
              <p>User created successfully: {JSON.stringify(data)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fetchapi;
