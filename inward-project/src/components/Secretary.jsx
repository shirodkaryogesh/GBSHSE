import React, { useEffect, useState } from "react";
import "../style/secretary.css";

function Secretary() {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/user/secretaryData",
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
          console.log("data not found");
        }
      } catch (e) {
        console.log("error while fetching the data.", e);
      }
    };
    fetchData();
  }, []);

  const dateFormat = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFileName = (fileUrl) => {
    return fileUrl.split("/").pop();
  };

  return (
    <>
      <div className="secretary-container">
        <h2>File Record:</h2>
        <table className="secretary-table">
          <thead>
            <tr>
              <th>Sent Date</th>
              <th>Send By</th>
              <th>Send To</th>
              <th>Assigned</th>
              <th>Assigned Date</th>
              <th>File Subject</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {requestData.map((file, index) => (
              <tr key={index}>
                <td>{dateFormat(file.sent_date)}</td>
                <td>{file.send_by}</td>
                <td>{file.send_to}</td>
                <td>{file.assigned}</td>
                <td>{dateFormat(file.assigned_date)}</td>
                <td>{file.file_subject}</td>
                <td>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {getFileName(file.file_url)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Secretary;
