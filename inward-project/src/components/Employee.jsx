import React, { useEffect, useState } from "react";
import "../style/employee.css";

function Employee() {
  const [requestData, setRequestData] = useState([]);
  const employeeId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFileRequest = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3000/user/fileRequest/${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setRequestData(data);
        } else {
          console.log("error fetching the request");
        }
      } catch (e) {
        console.log("error fetching the files ", e);
      }
    };
    fetchFileRequest();
  }, [employeeId]);

  const handleAssign = async (id) => {
    const confirmAssign = window.confirm("Do you want to Assign this file?");
    if (confirmAssign) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/user/assignFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileId: id,
            assigned: "yes",
          }),
        });
        if (response.ok) {
          setRequestData((prevData) =>
            prevData.map((file) =>
              file.file_id === id ? { ...file, assigned: "yes" } : file
            )
          );
        } else {
          console.log("cannot assign this file");
        }
      } catch (e) {
        console.log("cannot assign this file.", e);
      }
    }
  };

  return (
    <div className="file-container">
      {requestData.map((request) => (
        <div className="file-box" key={request.file_id}>
          <div className="file-header">
            Sent by:{" "}
            <span className="sent-value">
              {request.sender_firstname} {request.sender_lastname}
            </span>
          </div>
          <div className="sub-heading">
            Subject: <span className="sub-value">{request.file_subject}</span>
          </div>
          <div className="file-info">
            <span className="file-name">
              {request.file_url.split("/").pop()}
            </span>
            <button
              className="eye-button"
              onClick={() => window.open(request.file_url, "_blank")}
            >
              👁️
            </button>
          </div>
          <button
            className="assign-button"
            onClick={() => handleAssign(request.file_id)}
            disabled={request.assigned === "yes"}
          >
            {request.assigned === "yes" ? "Assigned" : "Assign"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Employee;
