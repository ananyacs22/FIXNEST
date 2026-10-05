import "./IssueList.css";
import { useEffect, useState } from "react";
import api from "../api/axios";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState({});

  const fetchIssues = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/issues");
      setIssues(response.data.issues || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load issues. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpvote = async (issueId) => {
    if (voting[issueId]) return;

    setVoting((prev) => ({ ...prev, [issueId]: true }));

    try {
      const response = await api.patch(
        `/issues/${issueId}/upvote`
      );

      const updatedIssue = response.data.issue;

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? updatedIssue : issue
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to upvote. Please try again."
      );
    } finally {
      setVoting((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  return (
    <section className="issue-list-section">
      <div className="issue-list-heading">
        <div>
          <h2>Community Issues</h2>
          <p>Let's make our apartment community better together.</p>
        </div>

        <button onClick={fetchIssues} disabled={loading}>
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {loading && <p>Loading community issues...</p>}

      {error && (
        <div className="issue-error">
          <p>{error}</p>
          <button onClick={fetchIssues}>Try Again</button>
        </div>
      )}

      {!loading && !error && issues.length === 0 && (
        <div className="issue-empty">
          <span>🏢</span>
          <h3>No issues reported yet</h3>
          <p>Reported problems will appear here.</p>
        </div>
      )}

      <div className="issue-grid">
        {issues.map((issue) => (
          <article className="issue-card" key={issue._id}>
            <div className="issue-card-top">
              <span className="issue-category">
                {issue.category}
              </span>
              <span className="issue-status">
                {issue.status || "Reported"}
              </span>
            </div>

            <h3>{issue.title}</h3>

            <p className="issue-description">
              {issue.description}
            </p>

            <div className="issue-location">
              <strong>📍 Apartment Details</strong>
              <p>
                {issue.location?.apartment ||
                  issue.apartmentName ||
                  "Apartment"}
              </p>
              <p>
                Block: {issue.location?.block || issue.block || "—"}
              </p>
              <p>
                Floor: {issue.location?.floor ?? issue.floor ?? "—"}
              </p>
              <p>
                Flat: {issue.location?.roomNumber ||
                  issue.flatNumber ||
                  "—"}
              </p>
            </div>

            <div className="issue-card-footer">
              <button
                type="button"
                onClick={() => handleUpvote(issue._id)}
                disabled={Boolean(voting[issue._id])}
                aria-label={`Upvote ${issue.title}`}
              >
                👍 {issue.upvotes || 0} upvotes
                {voting[issue._id] ? " ..." : ""}
              </button>

              <span>
                {issue.createdAt
                  ? new Date(issue.createdAt).toLocaleDateString(
                      "en-IN"
                    )
                  : ""}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default IssueList;