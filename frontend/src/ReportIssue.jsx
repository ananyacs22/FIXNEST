import { useEffect, useState } from "react";
import api from "./api/axios";
import "./ReportIssue.css";

const categories = [
  "Electrical",
  "Water Leak",
  "Streetlight",
  "Pothole",
  "Garbage",
  "Other",
];

function ReportIssue() {
  const [form, setForm] = useState({
    apartment: "",
    block: "",
    floor: "",
    roomNumber: "",
    title: "",
    category: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [voting, setVoting] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const fetchIssues = async () => {
    setFetching(true);

    try {
      const response = await api.get("/issues");
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error("Could not load issues:", error);
    } finally {
      setFetching(false);
    }
    const handleUpvote = async (issueId) => {
      console.log("UPVOTE BUTTON CLICKED:", issueId);
      if (voting[issueId]) return;

  setVoting((previous) => ({
    ...previous,
    [issueId]: true,
  }));

  try {
    const response = await api.patch(
      `/issues/${issueId}/upvote`
    );

    const updatedIssue = response.data.issue;

    setIssues((previous) =>
      previous.map((issue) =>
        issue._id === issueId ? updatedIssue : issue
      )
    );
  } catch (error) {
    console.error("Upvote failed:", error);
    alert(
      error.response?.data?.message ||
        "Unable to upvote. Please check the backend."
    );
  } finally {
    setVoting((previous) => ({
      ...previous,
      [issueId]: false,
    }));
  }
  };
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.category) {
      setMessage("Please select an issue category.");
      return;
    }

    if (image) {
      setMessage(
        "Image upload is not connected yet. Please remove the image and submit, or connect image storage first."
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: {
          apartment: form.apartment.trim(),
          block: form.block.trim(),
          floor: Number(form.floor),
          roomNumber: form.roomNumber.trim(),
        },
      };

      const response = await api.post("/issues", payload);

      setMessage(
        response.data.message || "Issue reported successfully!"
      );

      setForm({
        apartment: "",
        block: "",
        floor: "",
        roomNumber: "",
        title: "",
        category: "",
        description: "",
      });

      setImage(null);

      const fileInput = document.getElementById("issue-image");
      if (fileInput) fileInput.value = "";

      await fetchIssues();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not submit the issue. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status) =>
    (status || "Reported")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const issueIcon = (category) => {
    const icons = {
      Electrical: "⚡",
      "Water Leak": "💧",
      Streetlight: "💡",
      Pothole: "🛣️",
      Garbage: "🗑️",
      Other: "📌",
    };

    return icons[category] || "📌";
  };

  return (
    <div className="fixnest-page">
      <nav className="fn-navbar">
        <a className="fn-brand" href="/">
          <span className="brand-icon">⌂</span>
          Fix<span>Nest</span>
        </a>

        <div className="fn-nav-links">
          <a href="/">⌂ Home</a>
          <a className="active" href="#report">♧ Report Issue</a>
          <a href="#community">☷ My Issues</a>
          <a href="#about">ⓘ About</a>
        </div>

        <div className="profile-icon">●</div>
      </nav>

      <header className="fn-hero" id="about">
        <div className="hero-content">
          <span className="hero-badge">
            STRONGER COMMUNITIES <span>•</span> BETTER LIVING
          </span>

          <h1>
            Report a <span>Community Issue</span>
          </h1>

          <p>
            Help make your apartment community a better place by
            reporting issues. Your voice matters!
          </p>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-building">⌂</div>
          <div className="hero-art-caption">
            Together we build
            <br />
            better spaces.
          </div>
        </div>
      </header>

      <main className="fn-layout">
        <section className="fn-panel report-panel" id="report">
          <div className="panel-heading">
            <div className="heading-icon">⌖</div>

            <div>
              <h2>Issue Details</h2>
              <p>Fill in the details to report an issue in your society.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="fn-form-grid">
              <div className="fn-field">
                <label htmlFor="apartment">
                  ▦ Apartment / Society Name *
                </label>
                <input
                  id="apartment"
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Apartments"
                  required
                />
              </div>

              <div className="fn-field">
                <label htmlFor="block">▦ Block / Wing *</label>
                <input
                  id="block"
                  name="block"
                  value={form.block}
                  onChange={handleChange}
                  placeholder="e.g. Block A"
                  required
                />
              </div>

              <div className="fn-field">
                <label htmlFor="floor">Floor Number *</label>
                <input
                  id="floor"
                  name="floor"
                  type="number"
                  min="0"
                  step="1"
                  value={form.floor}
                  onChange={handleChange}
                  placeholder="e.g. 3 (0 for ground floor)"
                  required
                />
              </div>

              <div className="fn-field">
                <label htmlFor="roomNumber">Room / Flat Number *</label>
                <input
                  id="roomNumber"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g. 302"
                  required
                />
              </div>

              <div className="fn-field full-width">
                <label htmlFor="title">✎ Issue Title *</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Water leakage in bathroom"
                  required
                  maxLength={120}
                />
              </div>

              <div className="fn-field">
                <label htmlFor="category">◆ Category *</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fn-field">
                <label htmlFor="issue-image">
                  ▧ Upload Image (optional)
                </label>

                <label className="fn-upload-box" htmlFor="issue-image">
                  <span className="upload-icon">⇧</span>
                  <span>
                    {image ? image.name : "Choose an image"}
                  </span>
                  <small>JPG, PNG • Max 5 MB</small>
                </label>

                <input
                  id="issue-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="fn-hidden-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file && file.size > 5 * 1024 * 1024) {
                      setMessage("Image must be 5 MB or smaller.");
                      e.target.value = "";
                      setImage(null);
                      return;
                    }

                    setMessage("");
                    setImage(file || null);
                  }}
                />
              </div>

              <div className="fn-field full-width">
                <label htmlFor="description">
                  ▤ Describe the Issue *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain the problem in detail..."
                  rows={5}
                  required
                  maxLength={2000}
                />
              </div>
            </div>

            {message && (
              <div
                className={`fn-message ${
                  message.toLowerCase().includes("success")
                    ? "success"
                    : "error"
                }`}
                role="status"
              >
                {message}
              </div>
            )}

            <button
              className="fn-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "➤ Submit Issue"}
            </button>

            <p className="fn-privacy-note">
              Your report helps your community identify and resolve
              problems faster.
            </p>
          </form>
        </section>

        <section className="fn-panel community-panel" id="community">
          <div className="community-heading">
            <div className="panel-heading compact-heading">
              <div className="heading-icon">☷</div>

              <div>
                <h2>Community Issues</h2>
                <p>Issues reported by your community.</p>
              </div>
            </div>

            <button
              type="button"
              className="fn-refresh"
              onClick={fetchIssues}
              disabled={fetching}
            >
              ↻ {fetching ? "Loading..." : "Refresh"}
            </button>
          </div>

          {issues.length === 0 && !fetching ? (
            <div className="fn-empty">
              <div className="empty-icon">◇</div>
              <h3>No issues to display yet</h3>
              <p>
                Once reports are submitted, they will appear here.
              </p>
            </div>
          ) : (
            <div className="fn-issue-list">
              {issues.map((issue) => (
                <article className="fn-issue-card" key={issue._id}>
                  <div className="issue-top">
                    <div className="issue-symbol">
                      {issueIcon(issue.category)}
                    </div>

                    <div className="issue-title-area">
                      <h3>{issue.title}</h3>
                      <span className="issue-category">
                        ◇ {issue.category}
                      </span>
                    </div>

                    <span
                      className={`fn-status ${statusClass(issue.status)}`}
                    >
                      {issue.status || "Reported"}
                    </span>
                  </div>

                  <p className="issue-location">
                    ⌖ {issue.location?.apartment || "Apartment"}
                    {" · "}
                    {issue.location?.block || "Block"}
                    {" · Floor "}
                    {issue.location?.floor ?? "—"}
                    {" · "}
                    {issue.location?.roomNumber || "Common area"}
                  </p>

                  <p className="issue-description">
                    {issue.description}
                  </p>

                  <div className="issue-footer">
                    <button
                    type="button"
                    onClick={() => handleUpvote(issue._id)}
                    disabled={Boolean(voting[issue._id])}
                    className="upvote-btn"
>
  👍 {issue.upvotes || 0}
</button>
                    <span>▢ {issue.comments?.length || 0}</span>
                    <time>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Recently"}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="fn-footer">
        <span className="fn-brand">
          Fix<span>Nest</span>
        </span>
        <p>Small actions. Stronger communities. Better living.</p>
      </footer>
    </div>
  );
}

export default ReportIssue;