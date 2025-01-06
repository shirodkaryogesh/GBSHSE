import React, { useEffect, useState } from "react";
import "../style/admin.css";

function Admin() {
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/user/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          // console.log("data is: ", data);
          setEmployees(data);
        } else {
          console.log("error fetching the employee");
        }
      } catch (e) {
        console.log("something went wrong,", e);
      }
    };
    fetchEmployee();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    }
  };

  // const dummyEmployees = [
  //   { id: 1, name: "Yogesh Shirodkar" },
  //   { id: 2, name: "Swapnil Shirodkar" },
  //   { id: 3, name: "Sahil Shirodkar" },
  // ];

  const handleEmployeeSelection = (id) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((empId) => empId !== id); // Remove from selection
      } else {
        return [...prevSelected, id]; // Add to selection
      }
    });
  };

  const isSelected = (id) => selectedEmployees.includes(id);

  const handleReselect = () => {
    setSelectedEmployees([]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstname} ${emp.lastname}`.toLowerCase();
    return fullName.startsWith(searchTerm.toLowerCase());
  });

  console.log("filtered employees:", filterEmployees);

  const handleSubmit = async () => {
    if (selectedEmployees.length > 0 && selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("selectedEmployees", JSON.stringify(selectedEmployees));
      // formData.append("sendDate", new Date().toISOString());
      const userId = localStorage.getItem("userId");
      formData.append("userId", userId);
      formData.append("subject", subject);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/user/uploadFile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          alert("file send successfully ");
          setSelectedEmployees([]);
          setFileName("");
          setFilePreview("");
          setSubject("");
        } else {
          console.error("Failed to send file");
        }
      } catch (e) {
        console.error("Failed to send file:", e);
      }
    } else {
      alert("Please select employees and upload a file.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-upload-section">
        <h2 className="subject-heading">File Subject</h2>
        <input
          type="text"
          placeholder="Enter subject of the file"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="subject-input"
        />
        <h2 className="upload-heading">Upload File</h2>
        <form>
          <input type="file" onChange={handleFileChange} />
        </form>

        {fileName && (
          <div className="file-info">
            <span>{fileName}</span>
            <button
              className="preview-button"
              onClick={() => window.open(filePreview, "_blank")}
            >
              👁️
            </button>
          </div>
        )}
      </div>
      <div className="admin-list-section">
        <h2>Select Employees to Send the File</h2>
        <div className="search-and-button">
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="search employee..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-icon">🔍</button>
            </div>
            <div className="button-group">
              <button className="reselect-button" onClick={handleReselect}>
                Reselect
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                Sent
              </button>
            </div>
          </div>
        </div>

        <ul className="employee-list">
          {filterEmployees.length > 0 ? (
            filterEmployees.map((emp) => (
              <li
                className={`employee-item ${
                  isSelected(emp.user_id) ? "selected" : ""
                }`}
                key={emp.user_id}
                onClick={() => handleEmployeeSelection(emp.user_id)}
              >
                {emp.firstname} {emp.lastname}
              </li>
            ))
          ) : (
            <li>No Employee found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Admin;
