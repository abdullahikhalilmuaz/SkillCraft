import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, ArrowLeft, Award } from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";
import "../../styles/admin.css";

export default function CertificateView() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    const fetchCert = async () => {
      try {
        // Pick the right endpoint based on role
        const endpoint =
          user?.role === "admin"
            ? `/admin/certificates/${id}`
            : `/learning/certificates/${id}`;

        const res = await api.get(endpoint);
        setCertificate(res.data.certificate);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [id, user?.role]);

  const backLink =
    user?.role === "admin" ? "/admin/certificates" : "/student/certificates";

  if (loading)
    return (
      <div className="cert-print-page">
        <p>Loading certificate...</p>
      </div>
    );

  if (error)
    return (
      <div className="cert-print-page">
        <p style={{ color: "#dc2626" }}>{error}</p>
        <Link to={backLink} className="ad-btn ad-btn--ghost">
          Back to Certificates
        </Link>
      </div>
    );

  const isRevoked = certificate.status === "revoked";

  return (
    <div className="cert-print-page">
      {/* Toolbar (hidden when printing) */}
      <div className="cert-toolbar cert-no-print">
        <Link to={backLink} className="ad-btn ad-btn--ghost">
          <ArrowLeft
            size={15}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Back
        </Link>
        <button
          className="ad-btn ad-btn--primary"
          onClick={() => window.print()}
        >
          <Printer
            size={15}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
          Print / Save as PDF
        </button>
      </div>

      {/* The printable certificate */}
      <div className="cert-sheet">
        <div className="cert-inner">
          <span className="cert-corner cert-corner--tl" />
          <span className="cert-corner cert-corner--tr" />
          <span className="cert-corner cert-corner--bl" />
          <span className="cert-corner cert-corner--br" />

          <div
            className={`cert-status-badge ${
              isRevoked
                ? "cert-status-badge--revoked"
                : "cert-status-badge--active"
            }`}
          >
            {isRevoked ? "Revoked" : "Verified"}
          </div>

          <div className="cert-logo">
            <span className="cert-logo-mark">◆</span>
            <span>SkillCraft</span>
          </div>

          <div className="cert-title-block">
            <span className="cert-label">Certificate of Completion</span>
            <h1 className="cert-main-title">Certificate</h1>
            <p className="cert-awarded">This is proudly presented to</p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p className="cert-student-name">
              {certificate.student?.name || "Student"}
            </p>
            <span className="cert-course-label">
              For successfully completing
            </span>
            <h2 className="cert-course-name">
              {certificate.course?.title || "Course"}
            </h2>
          </div>

          <div className="cert-bottom">
            <div className="cert-signature">
              <div className="cert-signature-line" />
              <span className="cert-signature-name">SkillCraft AI</span>
              <span className="cert-signature-role">Platform Authority</span>
            </div>

            <div className="cert-seal">
              <Award size={36} />
            </div>

            <div className="cert-signature">
              <div className="cert-signature-line" />
              <span className="cert-signature-name">Course Tutor</span>
              <span className="cert-signature-role">Instructor</span>
            </div>
          </div>

          <p className="cert-meta">
            ID: {certificate.certificateId} &nbsp;•&nbsp; Issued:{" "}
            {new Date(certificate.completionDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
