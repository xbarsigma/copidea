import React from "react";

interface Contributor {
  id: string;
  name: string;
  affiliation: string;
  expertiseLevel: string;
  willingToContribute: string;
  timestamp: Date;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  format: string;
  ideaType: string;
  timestamp: Date;
  contributors: Contributor[];
  upvotes: number;
}

interface IdeasOverviewProps {
  ideas: Idea[];
  setCurrentPage: (page: string) => void;
}

const IdeasOverview: React.FC<IdeasOverviewProps> = ({
  ideas,
  setCurrentPage,
}) => {
  const formatOptions = [
    { value: "Workshop", color: "#2563eb" },
    { value: "Forum Topic", color: "#7c3aed" },
    { value: "CPD", color: "#059669" },
    { value: "Resource", color: "#dc2626" },
    { value: "Process", color: "#ea580c" },
    { value: "Idea", color: "#0891b2" },
    { value: "Other", color: "#6b7280" },
  ];

  const ideaTypeOptions = [
    { value: "New", color: "#059669" },
    { value: "Renew", color: "#0891b2" },
    { value: "Revive", color: "#ea580c" },
    { value: "Speculative", color: "#7c3aed" },
  ];

  const getOptionColor = (options: any[], value: string) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.color : "#6b7280";
  };

  const handleCardClick = (ideaId: string) => {
    setCurrentPage("vote");
  };

  if (ideas.length === 0) {
    return (
      <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "2px dashed #e2e8f0",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💡</div>
          <h2
            style={{
              fontSize: "24px",
              color: "#002147",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            No Ideas Yet
          </h2>
          <p
            style={{ color: "#64748b", marginBottom: "24px", fontSize: "16px" }}
          >
            Be the first to submit an amazing idea for outreach!
          </p>
          <button
            onClick={() => setCurrentPage("submit")}
            style={{
              backgroundColor: "#002147",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#003366";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#002147";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Submit Your Idea
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {ideas.map((idea) => (
          <div
            key={idea.id}
            onClick={() => handleCardClick(idea.id)}
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              height: "fit-content",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.borderColor = "#002147";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            {/* Title */}
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#002147",
                marginBottom: "12px",
                lineHeight: "1.4",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {idea.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.5",
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "63px",
              }}
            >
              {idea.description}
            </p>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  backgroundColor: getOptionColor(formatOptions, idea.format),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {idea.format}
              </span>
              <span
                style={{
                  backgroundColor: getOptionColor(
                    ideaTypeOptions,
                    idea.ideaType
                  ),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {idea.ideaType}
              </span>
            </div>

            {/* Proposed By */}
            <div style={{ marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: "500",
                }}
              >
                PROPOSED BY
              </span>
              <div
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  fontWeight: "500",
                }}
              >
                {idea.proposedBy}
              </div>
            </div>

            {/* Contributors */}
            {idea.contributors.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: "500",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  CONTRIBUTORS
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {idea.contributors.slice(0, 3).map((contributor, index) => (
                    <span
                      key={contributor.id}
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                        backgroundColor: "#f1f5f9",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {contributor.name}
                    </span>
                  ))}
                  {idea.contributors.length > 3 && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontStyle: "italic",
                      }}
                    >
                      +{idea.contributors.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Footer with stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "12px",
                borderTop: "1px solid #f1f5f9",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#ff6b8a" }}>♥</span>
                <span>{idea.upvotes} votes</span>
              </div>
              <div>{idea.timestamp.toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default IdeasOverview;
