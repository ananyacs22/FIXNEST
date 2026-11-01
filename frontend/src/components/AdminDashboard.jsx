
import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  // RESIDENT MANAGEMENT
const [residents, setResidents] = useState([]);
const [residentLoading, setResidentLoading] = useState(false);
const [residentError, setResidentError] = useState("");

const [residentForm, setResidentForm] = useState({
  name: "",
  email: "",
  phone: "",
  society: "",
  block: "",
  flatNumber: "",
});

  // FETCH ISSUES
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/issues");

      setIssues(response.data.issues || []);
    } catch (err) {
      console.error("Admin fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load issues."
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchResidents = async () => {
  try {
    setResidentLoading(true);
    setResidentError("");

    const response = await api.get("/admin/residents");

    setResidents(response.data.residents || []);
  } catch (error) {
    setResidentError(
      error.response?.data?.message || "Failed to load residents."
    );
  } finally {
    setResidentLoading(false);
  }
};
const handleResidentSubmit = async (e) => {
  e.preventDefault();

  try {
    setResidentError("");

    await api.post("/admin/residents", residentForm);

    setResidentForm({
      name: "",
      email: "",
      phone: "",
      society: "",
      block: "",
      flatNumber: "",
    });

    await fetchResidents();
    alert("Resident added successfully!");
  } catch (error) {
    setResidentError(
      error.response?.data?.message || "Failed to add resident."
    );
  }
};
const handleDeleteResident = async (residentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to remove this resident?"
  );

  if (!confirmDelete) return;

  try {
    setResidentError("");

    await api.delete(`/admin/residents/${residentId}`);

    await fetchResidents();
    alert("Resident removed successfully!");
  } catch (error) {
    setResidentError(
      error.response?.data?.message || "Failed to remove resident."
    );
  }
};

  useEffect(() => {
  fetchIssues();
  fetchResidents();
}, []);

  // UPDATE ISSUE STATUS
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const response = await api.patch(
        `/issues/${issueId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setIssues((previousIssues) =>
          previousIssues.map((issue) =>
            issue._id === issueId
              ? response.data.issue
              : issue
          )
        );
      }
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update status."
      );
    }
  };

  // DASHBOARD COUNTS
  const totalIssues = issues.length;

  const reportedIssues = issues.filter(
    (issue) => (issue.status || "Reported") === "Reported"
  ).length;

  const verifiedIssues = issues.filter(
    (issue) => issue.status === "Verified"
  ).length;

  const assignedIssues = issues.filter(
    (issue) => issue.status === "Assigned"
  ).length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  // FILTER AND SEARCH
  const filteredIssues = issues.filter((issue) => {
    const issueStatus = issue.status || "Reported";

    const matchesFilter =
      filter === "All" || issueStatus === filter;

    const searchText = search.toLowerCase().trim();

    const apartment = issue.location?.apartment || "";
    const block = issue.location?.block || "";
    const roomNumber = issue.location?.roomNumber || "";
    const floor = issue.location?.floor?.toString() || "";
    const title = issue.title || "";
    const description = issue.description || "";
    const category = issue.category || "";

    const matchesSearch =
      searchText === "" ||
      apartment.toLowerCase().includes(searchText) ||
      block.toLowerCase().includes(searchText) ||
      roomNumber.toLowerCase().includes(searchText) ||
      floor.toLowerCase().includes(searchText) ||
      title.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const statuses = [
    "All",
    "Reported",
    "Verified",
    "Assigned",
    "In Progress",
    "Resolved",
  ];

  // PAGE
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F8FC",
        color: "#173858",
        padding: "35px 6%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "35px",
          background: "#FFFFFF",
          padding: "25px",
          borderRadius: "15px",
          border: "1px solid #DCE8F5",
          boxShadow: "0 5px 20px rgba(23,56,88,0.05)",
        }}
      >
        <div>
          <p
            style={{
              color: "#287bd1",
              fontWeight: "700",
              letterSpacing: "2px",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            FIXNEST MANAGEMENT
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(25px, 4vw, 34px)",
              color: "#173858",
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              color: "#587087",
              marginTop: "8px",
            }}
          >
            Manage and track community issues.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchIssues}
          disabled={loading}
          style={{
            background: "#287bd1",
            color: "#FFFFFF",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#FDECEC",
            color: "#C0392B",
            border: "1px solid #F3CACA",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "18px",
          marginBottom: "35px",
        }}
      >
        <StatCard
          title="Total Issues"
          value={totalIssues}
          color="#287bd1"
          icon="📋"
        />

        <StatCard
          title="Reported"
          value={reportedIssues}
          color="#D69B13"
          icon="🟡"
        />

        <StatCard
          title="Verified"
          value={verifiedIssues}
          color="#8561D6"
          icon="🟣"
        />

        <StatCard
          title="Assigned"
          value={assignedIssues}
          color="#E67E22"
          icon="🟠"
        />

        <StatCard
          title="In Progress"
          value={inProgressIssues}
          color="#287BD1"
          icon="🔵"
        />

        <StatCard
          title="Resolved"
          value={resolvedIssues}
          color="#16865D"
          icon="🟢"
        />
      </div>
      {/* RESIDENT MANAGEMENT */}
<section
  style={{
    background: "#FFFFFF",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid #DCE8F5",
    marginBottom: "30px",
    boxShadow: "0 5px 20px rgba(23,56,88,0.04)",
  }}
>
  <h2 style={{ marginTop: 0, color: "#173858" }}>
    Resident Management
  </h2>

  <p style={{ color: "#587087" }}>
    Add residents to the official society register.
    Only registered residents can create accounts.
  </p>

  {residentError && (
    <div
      style={{
        background: "#FDECEC",
        color: "#C0392B",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "15px",
      }}
    >
      {residentError}
    </div>
  )}

  <form
    onSubmit={handleResidentSubmit}
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "15px",
      marginTop: "20px",
    }}
  >
    {[
      ["name", "Resident Name"],
      ["email", "Email Address"],
      ["phone", "Phone Number"],
      ["society", "Society Name"],
      ["block", "Block"],
      ["flatNumber", "Flat Number"],
    ].map(([field, placeholder]) => (
      <input
        key={field}
        type={field === "email" ? "email" : "text"}
        placeholder={placeholder}
        value={residentForm[field]}
        required={field !== "phone"}
        onChange={(e) =>
          setResidentForm({
            ...residentForm,
            [field]: e.target.value,
          })
        }
        style={{
          padding: "13px",
          border: "1px solid #CBDCED",
          borderRadius: "8px",
          background: "#F4F8FC",
          color: "#173858",
          outline: "none",
        }}
      />
    ))}

    <button
      type="submit"
      style={{
        background: "#287bd1",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "8px",
        padding: "13px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      + Add Resident
    </button>
  </form>
</section>
      {/* OFFICIAL RESIDENT LIST */}
<section
  style={{
    background: "#FFFFFF",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid #DCE8F5",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
    }}
  >
    <h2 style={{ margin: 0, color: "#173858" }}>
      Official Resident List ({residents.length})
    </h2>

    <button
      type="button"
      onClick={fetchResidents}
      disabled={residentLoading}
      style={{
        background: "#E8F2FC",
        color: "#287bd1",
        border: "1px solid #CBDCED",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {residentLoading ? "Loading..." : "↻ Refresh Residents"}
    </button>
  </div>

  {residentLoading ? (
    <p style={{ color: "#587087" }}>Loading residents...</p>
  ) : residents.length === 0 ? (
    <p style={{ color: "#587087" }}>
      No residents have been added yet.
    </p>
  ) : (
    <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
      {residents.map((resident) => (
        <div
          key={resident._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            padding: "15px",
            background: "#F4F8FC",
            border: "1px solid #E3EDF7",
            borderRadius: "10px",
          }}
        >
          <div>
            <strong style={{ color: "#173858" }}>
              {resident.name}
            </strong>

            <p style={{ margin: "5px 0", color: "#587087" }}>
              {resident.email}
            </p>

            <p style={{ margin: 0, color: "#587087", fontSize: "13px" }}>
              {resident.society} · Block {resident.block} · Flat {resident.flatNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleDeleteResident(resident._id)}
            style={{
              background: "#FDECEC",
              color: "#C0392B",
              border: "1px solid #F3CACA",
              padding: "9px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</section>
      {/* COMMUNITY ISSUES */}
      <section>
        <div
          style={{
            background: "#FFFFFF",
            padding: "25px",
            borderRadius: "15px",
            border: "1px solid #DCE8F5",
            marginBottom: "22px",
            boxShadow: "0 5px 20px rgba(23,56,88,0.04)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              color: "#173858",
            }}
          >
            Community Issues
          </h2>

          {/* SEARCH */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Search by apartment, block, flat, title, category..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              marginBottom: "20px",
              background: "#F4F8FC",
              color: "#173858",
              border: "1px solid #CBDCED",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
            }}
          />

          {/* FILTER BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "20px",
                  border: "1px solid #CBDCED",
                  background:
                    filter === status ? "#287bd1" : "#E8F2FC",
                  color:
                    filter === status ? "#FFFFFF" : "#385b7c",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <p style={{ color: "#587087" }}>
            Loading issues...
          </p>
        ) : filteredIssues.length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #DCE8F5",
              borderRadius: "15px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px" }}>🔎</div>

            <h3 style={{ color: "#173858" }}>
              No matching issues found
            </h3>

            <p style={{ color: "#587087" }}>
              Try another search term or filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DCE8F5",
                  borderRadius: "15px",
                  padding: "22px",
                  boxShadow: "0 5px 20px rgba(23,56,88,0.05)",
                  minWidth: 0,
                  overflowWrap: "break-word",
                }}
              >
                {/* TOP */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#287bd1",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      {issue.category}
                    </span>

                    <h3
                      style={{
                        margin: "7px 0 0",
                        color: "#173858",
                      }}
                    >
                      {issue.title}
                    </h3>
                  </div>

                  {/* STATUS DROPDOWN */}
                  <select
                    value={issue.status || "Reported"}
                    onChange={(e) =>
                      handleStatusChange(
                        issue._id,
                        e.target.value
                      )
                    }
                    style={{
                      background:
                        getStatusStyle(issue.status || "Reported").background,
                      color:
                        getStatusStyle(issue.status || "Reported").color,
                      border:
                        `1px solid ${getStatusStyle(issue.status || "Reported").border}`,
                      borderRadius: "20px",
                      padding: "9px 13px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      maxWidth: "100%",
                    }}
                  >
                    <option value="Reported">Reported</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* DESCRIPTION */}
                <p
                  style={{
                    color: "#587087",
                    lineHeight: "1.7",
                    marginTop: "15px",
                  }}
                >
                  {issue.description}
                </p>

                {/* LOCATION */}
                <div
                  style={{
                    background: "#F4F8FC",
                    border: "1px solid #E3EDF7",
                    padding: "15px",
                    borderRadius: "10px",
                    marginTop: "15px",
                    color: "#385b7c",
                  }}
                >
                  <strong style={{ color: "#173858" }}>
                    📍 Apartment Details
                  </strong>

                  <p style={{ margin: "8px 0 3px" }}>
                    Apartment: {issue.location?.apartment || "—"}
                  </p>

                  <p style={{ margin: "3px 0" }}>
                    Block: {issue.location?.block || "—"}
                  </p>

                  <p style={{ margin: "3px 0" }}>
                    Floor: {issue.location?.floor ?? "—"}
                  </p>

                  <p style={{ margin: "3px 0" }}>
                    Room / Flat: {issue.location?.roomNumber || "—"}
                  </p>
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "17px",
                    paddingTop: "15px",
                    borderTop: "1px solid #DCE8F5",
                    color: "#71859c",
                    fontSize: "13px",
                  }}
                >
                  <span>
                    👍 {issue.upvotes || 0} upvotes
                  </span>

                  <span>
                    {issue.createdAt
                      ? new Date(issue.createdAt).toLocaleDateString("en-IN")
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// STATUS COLOURS
function getStatusStyle(status) {
  const styles = {
    Reported: {
      background: "#FFF4D6",
      color: "#A66B00",
      border: "#F0D58A",
    },
    Verified: {
      background: "#F0EAFE",
      color: "#7652C7",
      border: "#D7C8F6",
    },
    Assigned: {
      background: "#FFF0E2",
      color: "#C66A18",
      border: "#F2D0AE",
    },
    "In Progress": {
      background: "#E4F0FF",
      color: "#2871C5",
      border: "#BDD8F5",
    },
    Resolved: {
      background: "#E1F5EC",
      color: "#16865D",
      border: "#B7E4D0",
    },
  };

  return styles[status] || styles.Reported;
}

// STATISTICS CARD
function StatCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #DCE8F5",
        borderRadius: "15px",
        padding: "22px",
        boxShadow: "0 5px 20px rgba(23,56,88,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#587087",
          margin: 0,
          fontWeight: "600",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color,
          fontSize: "32px",
          margin: "8px 0 0",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default AdminDashboard;
