import "./IssueList.css";
import { useEffect, useState } from "react";
import api from "../api/axios";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upvotingId, setUpvotingId] = useState(null);

  // Fetch all issues
  const fetchIssues = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/issues");

      setIssues(response.data.issues || []);
    } catch (err) {
      console.error("Fetch issues error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load issues. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Upvote an issue
  const handleUpvote = async (issueId) => {
    // Prevent multiple clicks while the request is running
    if (upvotingId === issueId) {
      return;
    }

    setUpvotingId(issueId);

    try {
      const response = await api.patch(
        `/issues/${issueId}/upvote`
      );

      const updatedIssue = response.data.issue;

      // Update only the issue that was upvoted
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue._id === issueId ? updatedIssue : issue
        )
      );
    } catch (err) {
      console.error("Upvote error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to upvote this issue. Please try again."
      );
    } finally {
      setUpvotingId(null);
    }
  };

  // Load issues when page opens
  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <section className="issue-list-section">
      {/* HEADER */}
      <div className="issue-list-heading">
        <div>
          <h2>Community Issues</h2>
          <p>
            Let's make our apartment community better together.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchIssues}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p>Loading community issues...</p>
      )}

      {/* ERROR */}
      {error && (
        <div className="issue-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchIssues}
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO ISSUES */}
      {!loading &&
        !error &&
        issues.length === 0 && (
          <div className="issue-empty">
            <span>🏢</span>

            <h3>No issues reported yet</h3>

            <p>
              Reported problems will appear here.
            </p>
          </div>
        )}

      {/* ISSUE CARDS */}
      <div className="issue-grid">
        {issues.map((issue) => (
          <article
            className="issue-card"
            key={issue._id}
          >
            {/* CATEGORY + STATUS */}
            <div className="issue-card-top">
              <span className="issue-category">
                {issue.category}
              </span>

              <span className="issue-status">
                {issue.status || "Reported"}
              </span>
            </div>

            {/* TITLE */}
            <h3>{issue.title}</h3>

            {/* DESCRIPTION */}
            <p className="issue-description">
              {issue.description}
            </p>

            {/* APARTMENT LOCATION */}
            <div className="issue-location">
              <strong>
                📍 Apartment Details
              </strong>

              <p>
                Apartment:{" "}
                {issue.location?.apartment ||
                  "—"}
              </p>

              <p>
                Block:{" "}
                {issue.location?.block ||
                  "—"}
              </p>

              <p>
                Floor:{" "}
                {issue.location?.floor ?? "—"}
              </p>

              <p>
                Room / Flat:{" "}
                {issue.location?.roomNumber ||
                  "—"}
              </p>
            </div>

            {/* FOOTER */}
            <div className="issue-card-footer">

              {/* UPVOTE BUTTON */}
              <button
                type="button"
                className="upvote-button"
                onClick={() =>
                  handleUpvote(issue._id)
                }
                disabled={
                  upvotingId === issue._id
                }
              >
                👍{" "}
                {upvotingId === issue._id
                  ? "Updating..."
                  : `${issue.upvotes || 0} Upvotes`}
              </button>

              {/* DATE */}
              <span>
                {issue.createdAt
                  ? new Date(
                      issue.createdAt
                    ).toLocaleDateString(
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