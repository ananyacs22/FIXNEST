
import { useEffect, useState, useRef } from "react";
import api from "./api/axios";

function ReportIssue({ view = "report" }) {
  // FORM STATE
  const [form, setForm] = useState({
    apartment: "",
    block: "",
    floor: "",
    roomNumber: "",
    title: "",
    category: "",
    description: "",
  });

  // IMAGE STATE
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
  if (cameraOpen && cameraStream && videoRef.current) {
    videoRef.current.srcObject = cameraStream;
  }
}, [cameraOpen, cameraStream]);
  // ISSUES STATE
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [voting, setVoting] = useState({});

  // CLEAN UP IMAGE PREVIEW URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // FETCH ALL ISSUES
  const fetchIssues = async () => {
    try {
      setFetching(true);
      setError("");

      const response = await api.get("/issues");

      setIssues(response.data.issues || []);
    } catch (err) {
      console.error("Fetch issues error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load community issues."
      );
    } finally {
      setFetching(false);
    }
  };

  // LOAD ISSUES
  useEffect(() => {
    fetchIssues();
  }, []);

  // FORM INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    setCameraStream(stream);
    setCameraOpen(true);
  } catch (error) {
    console.error("Camera error:", error);
    alert("Unable to access camera. Please allow camera permission.");
  }
};
  const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }

  setCameraStream(null);
  setCameraOpen(false);
};
  const capturePhoto = () => {
  const video = videoRef.current;

  if (!video || !video.videoWidth) {
    alert("Camera is not ready yet. Please wait.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const file = new File([blob], "fixnest-photo.jpg", {
      type: "image/jpeg",
    });

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    stopCamera();
  }, "image/jpeg");
};

  // SELECT IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // REMOVE IMAGE
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // REPORT ISSUE
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // FORM DATA FOR IMAGE UPLOAD
      const issueData = new FormData();

      issueData.append("title", form.title.trim());
      issueData.append("description", form.description.trim());
      issueData.append("category", form.category);

      issueData.append(
        "location[apartment]",
        form.apartment.trim()
      );

      issueData.append(
        "location[block]",
        form.block.trim()
      );

      issueData.append(
        "location[floor]",
        form.floor
      );

      issueData.append(
        "location[roomNumber]",
        form.roomNumber.trim()
      );

      if (selectedImage) {
        issueData.append("image", selectedImage);
      }

      const response = await api.post(
        "/issues",
        issueData
      );

      if (response.data.success) {
        setMessage("Issue reported successfully!");

        setForm({
          apartment: "",
          block: "",
          floor: "",
          roomNumber: "",
          title: "",
          category: "",
          description: "",
        });

        setSelectedImage(null);
        setImagePreview("");

        await fetchIssues();
      }
    } catch (err) {
      console.error("Create issue error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to report issue."
      );
    } finally {
      setLoading(false);
    }
  };

  // UPVOTE
  const handleUpvote = async (issueId) => {
    if (voting[issueId]) return;

    try {
      setVoting((previous) => ({
        ...previous,
        [issueId]: true,
      }));

      const response = await api.patch(
        `/issues/${issueId}/upvote`
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
      console.error("UPVOTE ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to upvote this issue."
      );
    } finally {
      setVoting((previous) => ({
        ...previous,
        [issueId]: false,
      }));
    }
  };

  // PAGE
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F8FC",
        color: "#173858",
        paddingBottom: "60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "22px 8%",
          borderBottom: "1px solid #DCE8F5",
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#173858",
            fontSize: "26px",
            fontWeight: "900",
          }}
        >
          Fix<span style={{ color: "#287bd1" }}>Nest</span>
        </h2>

        
      </header>
      {view === "report" && (
  <>  
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "55px 20px 35px",
        }}
      >
        <p
          style={{
            color: "#287bd1",
            fontWeight: "700",
            letterSpacing: "2px",
            fontSize: "13px",
          }}
        >
          STRONGER COMMUNITIES · BETTER LIVING
        </p>

        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 42px)",
            margin: "15px 0",
            lineHeight: 1.2,
          }}
        >
          Report a{" "}
          <span style={{ color: "#287bd1" }}>
            Community Issue
          </span>
        </h1>

        <p
          style={{
            color: "#587087",
            maxWidth: "650px",
            margin: "0 auto",
            lineHeight: "1.7",
            fontSize: "16px",
          }}
        >
          Help make your apartment community a better
          place by reporting issues. Your voice matters!
        </p>
      </section>

      {/* REPORT FORM */}
      <section
        id="report"
        style={{
          width: "90%",
          maxWidth: "900px",
          margin: "0 auto 50px",
          background: "#FFFFFF",
          border: "1px solid #DCE8F5",
          borderRadius: "18px",
          padding: "30px",
          boxSizing: "border-box",
          boxShadow: "0 5px 20px rgba(23,56,88,0.06)",
        }}
      >
        <h2 style={{ color: "#173858" }}>
          🏢 Issue Details
        </h2>

        <p
          style={{
            color: "#587087",
            marginBottom: "25px",
          }}
        >
          Fill in the details to report an issue in your
          society.
        </p>

        <form onSubmit={handleSubmit}>
          {/* APARTMENT DETAILS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "18px",
            }}
          >
            <label style={labelStyle}>
              Apartment / Society

              <input
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
                placeholder="Green Valley Apartments"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Block / Wing

              <input
                name="block"
                value={form.block}
                onChange={handleChange}
                placeholder="Block A"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Floor

              <input
                name="floor"
                type="number"
                value={form.floor}
                onChange={handleChange}
                placeholder="3"
                required
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Room / Flat Number

              <input
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="302"
                required
                style={inputStyle}
              />
            </label>
          </div>

          {/* TITLE */}
          <label style={formLabelStyle}>
            Issue Title

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Broken light in corridor"
              required
              style={inputStyle}
            />
          </label>

          {/* CATEGORY */}
          <label style={formLabelStyle}>
            Category

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Water Leak">Water Leak</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* DESCRIPTION */}
          <label style={formLabelStyle}>
            Description

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue..."
              rows="5"
              required
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </label>

          {/* IMAGE UPLOAD */}
<div style={formLabelStyle}>
  <label
    style={{
      display: "block",
      marginBottom: "10px",
    }}
  >
    📷 Upload Issue Image
  </label>

  <div
    style={{
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
    }}
  >
    {/* TAKE PHOTO */}
    {/* TAKE PHOTO */}
<button
  type="button"
  onClick={startCamera}
  style={imageButtonStyle}
>
  📷 Open Camera
</button>

    {/* CHOOSE FROM GALLERY */}
    <label
      htmlFor="galleryImage"
      style={imageButtonStyle}
    >
      🖼️ Choose from Gallery
    </label>

    <input
      id="galleryImage"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageChange}
      style={{ display: "none" }}
    />
  </div>

  <p
    style={{
      color: "#71859c",
      fontSize: "12px",
      marginTop: "10px",
    }}
  >
    Supported formats: JPG, PNG, WEBP. Maximum size: 5 MB.
  </p>

  {/* IMAGE PREVIEW */}
  {cameraOpen && (
  <div style={{ marginTop: "15px" }}>
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{
        width: "100%",
        maxWidth: "450px",
        borderRadius: "12px",
      }}
    />

    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <button type="button" onClick={capturePhoto}>
        Capture Photo
      </button>

      <button type="button" onClick={stopCamera}>
        Cancel
      </button>
    </div>
  </div>
)}
  {imagePreview && (
    <div
      style={{
        marginTop: "15px",
        padding: "12px",
        border: "1px solid #DCE8F5",
        borderRadius: "12px",
        background: "#F4F8FC",
      }}
    >
      <p
        style={{
          color: "#173858",
          fontWeight: "700",
          marginTop: 0,
        }}
      >
        Image Preview
      </p>

      <img
        src={imagePreview}
        alt="Selected issue"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "350px",
          maxHeight: "250px",
          objectFit: "contain",
          borderRadius: "8px",
          background: "#FFFFFF",
        }}
      />

      <button
        type="button"
        onClick={handleRemoveImage}
        style={{
          marginTop: "12px",
          padding: "9px 15px",
          border: "1px solid #E8B8B8",
          borderRadius: "7px",
          background: "#FDECEC",
          color: "#C0392B",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        ✕ Remove Image
      </button>
    </div>
  )}
</div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <p
              style={{
                color: "#16865D",
                background: "#E1F5EC",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "18px",
              }}
            >
              ✓ {message}
            </p>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <p
              style={{
                color: "#C0392B",
                background: "#FDECEC",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "18px",
              }}
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "22px",
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#287bd1",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              boxShadow: "0 5px 15px rgba(40,123,209,0.18)",
            }}
          >
            {loading ? "Submitting..." : "➤ Submit Issue"}
          </button>
        </form>
      </section>
              </>
)}
      {/* COMMUNITY ISSUES */}
      {view === "community" && (
      <section
        id="community"
        style={{
          width: "90%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADING */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "5px", color: "#173858" }}>
              Community Issues
            </h2>

            <p style={{ color: "#587087" }}>
              Issues reported by your community.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchIssues}
            disabled={fetching}
            style={{
              background: "#E8F2FC",
              color: "#287bd1",
              border: "1px solid #CBDCED",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {fetching ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* LOADING */}
        {fetching && (
          <p style={{ color: "#587087" }}>
            Loading community issues...
          </p>
        )}

        {/* EMPTY */}
        {!fetching && !error && issues.length === 0 && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #DCE8F5",
              borderRadius: "15px",
              padding: "35px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(23,56,88,0.05)",
            }}
          >
            <div style={{ fontSize: "35px" }}>🏢</div>

            <h3 style={{ color: "#173858" }}>
              No issues reported yet
            </h3>

            <p style={{ color: "#587087" }}>
              Report an issue above and it will appear here.
            </p>
          </div>
        )}

        {/* ISSUE CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {issues.map((issue) => (
            <article
              key={issue._id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #DCE8F5",
                borderRadius: "15px",
                padding: "22px",
                boxShadow: "0 5px 20px rgba(23,56,88,0.06)",
                minWidth: 0,
                overflowWrap: "break-word",
              }}
            >
              {/* CATEGORY + STATUS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "#287bd1",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {issue.category}
                </span>

                <span
                  style={{
                    background: "#E1F5EC",
                    color: "#16865D",
                    border: "1px solid #B7E4D0",
                    borderRadius: "20px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "default",
                  }}
                >
                  {issue.status || "Reported"}
                </span>
              </div>

              {/* TITLE */}
              <h3
                style={{
                  marginTop: "18px",
                  marginBottom: "10px",
                  color: "#173858",
                }}
              >
                {issue.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                style={{
                  color: "#587087",
                  lineHeight: "1.6",
                }}
              >
                {issue.description}
              </p>
              {console.log("Image path:", issue.image)}
              {/* UPLOADED IMAGE */}
              {issue.image && (
                <img
                  src={`http://localhost:5000${issue.image}`}
                  alt={issue.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginTop: "12px",
                    border: "1px solid #DCE8F5",
                  }}
                />
              )}

              {/* LOCATION */}
              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  background: "#F4F8FC",
                  border: "1px solid #E3EDF7",
                  borderRadius: "10px",
                  color: "#385b7c",
                }}
              >
                <strong style={{ color: "#173858" }}>
                  📍 Apartment Details
                </strong>

                <p style={{ margin: "8px 0 0" }}>
                  {issue.location?.apartment || "Apartment"}
                </p>

                <p style={{ margin: "5px 0" }}>
                  Block: {issue.location?.block || "—"}
                </p>

                <p style={{ margin: "5px 0" }}>
                  Floor: {issue.location?.floor ?? "—"}
                </p>

                <p style={{ margin: "5px 0" }}>
                  Room / Flat: {issue.location?.roomNumber || "—"}
                </p>
              </div>

              {/* FOOTER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "18px",
                  paddingTop: "15px",
                  borderTop: "1px solid #DCE8F5",
                }}
              >
                {/* UPVOTE */}
                <button
                  type="button"
                  onClick={() => handleUpvote(issue._id)}
                  disabled={Boolean(voting[issue._id])}
                  style={{
                    border: "1px solid #CBDCED",
                    background: "#E8F2FC",
                    color: "#173858",
                    fontSize: "15px",
                    cursor: voting[issue._id] ? "wait" : "pointer",
                    padding: "7px 12px",
                    borderRadius: "8px",
                  }}
                >
                  👍 {issue.upvotes || 0}
                </button>

                {/* DATE */}
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#71859c",
                    fontSize: "12px",
                  }}
                >
                  {issue.createdAt
                    ? new Date(issue.createdAt).toLocaleDateString("en-IN")
                    : ""}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
      )}
    </div>
  );
}

// SHARED STYLES

const navLink = {
  color: "#385b7c",
  textDecoration: "none",
  fontWeight: "600",
};

const navLinkActive = {
  color: "#287bd1",
  textDecoration: "none",
  fontWeight: "700",
};

const labelStyle = {
  display: "block",
  color: "#173858",
  fontWeight: "600",
};

const formLabelStyle = {
  display: "block",
  marginTop: "20px",
  color: "#173858",
  fontWeight: "600",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "8px",
  padding: "13px 14px",
  background: "#F4F8FC",
  border: "1px solid #CBDCED",
  borderRadius: "8px",
  color: "#173858",
  outline: "none",
  fontSize: "14px",
};
const imageButtonStyle = {
  display: "inline-block",
  padding: "13px 20px",
  background: "#E8F2FC",
  color: "#287bd1",
  border: "1px solid #CBDCED",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer",
};
export default ReportIssue;
