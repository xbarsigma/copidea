import React, { useState } from "react";

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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const savedIdeas = localStorage.getItem("ideas");
    if (savedIdeas) {
      const parsedIdeas = JSON.parse(savedIdeas);
      return parsedIdeas.map((idea: any) => ({
        ...idea,
        timestamp: new Date(idea.timestamp),
        contributors: idea.contributors.map((contributor: any) => ({
          ...contributor,
          timestamp: new Date(contributor.timestamp),
        })),
      }));
    }
    // Return sample data if no saved ideas
    return [
      {
        id: "1",
        title: "Virtual Reality Workshop on Climate Change",
        description:
          "An immersive VR experience that allows participants to experience the effects of climate change firsthand, including rising sea levels and extreme weather events.",
        proposedBy: "Dr. Sarah Johnson",
        format: "Workshop",
        ideaType: "New",
        timestamp: new Date("2024-01-15"),
        contributors: [],
        upvotes: 15,
      },
      {
        id: "2",
        title: "Community Garden Initiative",
        description:
          "Establish community gardens in urban areas to promote sustainable food production and environmental education.",
        proposedBy: "Mike Chen",
        format: "Process",
        ideaType: "Renew",
        timestamp: new Date("2024-01-10"),
        contributors: [],
        upvotes: 8,
      },
      {
        id: "3",
        title: "Green Energy Forum Discussion",
        description:
          "A forum topic to discuss and share the latest developments in renewable energy technologies and their applications.",
        proposedBy: "Emma Davis",
        format: "Forum Topic",
        ideaType: "New",
        timestamp: new Date("2024-01-08"),
        contributors: [],
        upvotes: 12,
      },
    ];
  });

  const [expandedIdeas, setExpandedIdeas] = useState(new Set());

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

  const addIdea = (newIdea: Idea) => {
    const updatedIdeas = [newIdea, ...ideas];
    setIdeas(updatedIdeas);
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    setCurrentPage("overview");
  };

  const addContributor = (ideaId: string, contributor: Contributor) => {
    setIdeas((prevIdeas) => {
      const updatedIdeas = prevIdeas.map((idea) =>
        idea.id === ideaId
          ? { ...idea, contributors: [...idea.contributors, contributor] }
          : idea
      );
      localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
      return updatedIdeas;
    });
  };

  const upvoteIdea = (ideaId: string) => {
    setIdeas((prevIdeas) => {
      const updatedIdeas = prevIdeas.map((idea) =>
        idea.id === ideaId
          ? { ...idea, upvotes: (idea.upvotes || 0) + 1 }
          : idea
      );
      localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
      return updatedIdeas;
    });
  };

  const toggleExpanded = (ideaId: string) => {
    setExpandedIdeas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  // Header Component
  const Header = () => {
    const isMobile = window.innerWidth <= 768;

    return (
      <header
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: "1px solid #e6e6e6",
          position: "sticky",
          top: "0",
          zIndex: "1000",
          boxShadow: "0 1px 3px rgba(0, 33, 71, 0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: isMobile ? "56px" : "64px",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "8px" : "0",
              padding: isMobile ? "8px 0" : "0",
            }}
          >
            <h1
              style={{
                background: "linear-gradient(135deg, #002147 0%, #003366 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "20px",
                fontWeight: "600",
                margin: "0",
                letterSpacing: "-0.01em",
              }}
            >
              Outreach Ideas Hub
            </h1>

            <nav>
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "16px" : "32px",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                {[
                  { key: "home", label: "Home" },
                  { key: "submit", label: "Submit" },
                  {
                    key: "vote",
                    label: isMobile ? "Vote" : "Vote & Contribute",
                  },
                  {
                    key: "overview",
                    label: isMobile ? "Ideas" : "Ideas Overview",
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setCurrentPage(item.key)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: currentPage === item.key ? "#002147" : "#666",
                      fontSize: isMobile ? "12px" : "14px",
                      fontWeight: currentPage === item.key ? "600" : "400",
                      cursor: "pointer",
                      padding: isMobile ? "6px 8px" : "8px 0",
                      borderBottom:
                        currentPage === item.key
                          ? "2px solid #002147"
                          : "2px solid transparent",
                      transition: "all 0.15s ease",
                      outline: "none",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== item.key) {
                        e.currentTarget.style.color = "#002147";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== item.key) {
                        e.currentTarget.style.color = "#666";
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  };

  // Home Page Component
  const HomePage = () => {
    const isMobile = window.innerWidth <= 768;

    return (
      <div
        style={{
          minHeight: isMobile ? "calc(100vh - 72px)" : "calc(100vh - 64px)",
          background: "transparent",
          padding: isMobile ? "24px 16px" : "48px 24px",
        }}
      >
        <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Hero Section */}
          <div
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: isMobile ? "8px" : "12px",
              padding: isMobile ? "32px 20px" : "48px",
              marginBottom: isMobile ? "24px" : "32px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 33, 71, 0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "24px" : "36px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #002147 0%, #003366 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: isMobile ? "12px" : "16px",
                letterSpacing: "-0.02em",
                lineHeight: isMobile ? "1.3" : "1.2",
              }}
            >
              Welcome to Outreach Ideas Hub
            </h1>
            <p
              style={{
                fontSize: isMobile ? "14px" : "18px",
                color: "#64748b",
                marginBottom: isMobile ? "24px" : "32px",
                lineHeight: "1.6",
                maxWidth: isMobile ? "100%" : "600px",
                margin: isMobile ? "0 auto 24px auto" : "0 auto 32px auto",
                padding: isMobile ? "0 8px" : "0",
              }}
            >
              A collaborative platform for innovative outreach ideas. Share your
              concepts, contribute to others' visions, and help shape the future
              of engagement.
            </p>
            <div
              style={{
                display: "flex",
                gap: isMobile ? "12px" : "16px",
                justifyContent: "center",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setCurrentPage("submit")}
                style={{
                  background:
                    "linear-gradient(135deg, #002147 0%, #003366 100%)",
                  color: "white",
                  padding: isMobile ? "12px 32px" : "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: "0 2px 4px rgba(0, 33, 71, 0.2)",
                  width: isMobile ? "100%" : "auto",
                  maxWidth: isMobile ? "280px" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #003366 0%, #004080 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0, 33, 71, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #002147 0%, #003366 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 33, 71, 0.2)";
                }}
              >
                Submit Your Idea
              </button>
              <button
                onClick={() => setCurrentPage("overview")}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  color: "#002147",
                  padding: isMobile ? "12px 32px" : "12px 24px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  boxShadow: "0 1px 3px rgba(0, 33, 71, 0.1)",
                  width: isMobile ? "100%" : "auto",
                  maxWidth: isMobile ? "280px" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#002147";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 33, 71, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 33, 71, 0.1)";
                }}
              >
                Explore Ideas
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Ideas Overview Component
  const IdeasOverview = () => {
    const isMobile = window.innerWidth <= 768;

    if (ideas.length === 0) {
      return (
        <main
          style={{
            padding: isMobile ? "24px 16px" : "48px 24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
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
              style={{
                color: "#64748b",
                marginBottom: "24px",
                fontSize: "16px",
              }}
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
      <main
        style={{
          padding: isMobile ? "24px 16px" : "48px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setCurrentPage("vote")}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                height: "fit-content",
                boxShadow: "0 2px 4px rgba(0, 33, 71, 0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 33, 71, 0.15)";
                e.currentTarget.style.borderColor = "#002147";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 33, 71, 0.08)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
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
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  height: "64px",
                }}
              >
                {idea.description}
              </p>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    backgroundColor: getOptionColor(formatOptions, idea.format),
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
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
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {idea.ideaType}
                </span>
              </div>

              {/* Proposed By */}
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  PROPOSED BY
                </span>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#475569",
                    fontWeight: "500",
                    marginTop: "4px",
                  }}
                >
                  {idea.proposedBy}
                </div>
              </div>

              {/* Contributors */}
              {idea.contributors.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    CONTRIBUTORS
                  </span>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {idea.contributors.slice(0, 3).map((contributor, index) => (
                      <span
                        key={contributor.id}
                        style={{
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f1f5f9",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontWeight: "500",
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
                          fontWeight: "500",
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
                  paddingTop: "16px",
                  borderTop: "1px solid #f1f5f9",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={{ color: "#ff6b8a", fontSize: "14px" }}>♥</span>
                  <span style={{ fontWeight: "600" }}>{idea.upvotes}</span>
                  <span>votes</span>
                </div>
                <div style={{ fontWeight: "500" }}>
                  {idea.timestamp.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  };

  // Submit Page Component
  const SubmitPage = () => {
    const isMobile = window.innerWidth <= 768;
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      proposedBy: "",
      format: "",
      ideaType: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formData.title ||
        !formData.description ||
        !formData.proposedBy ||
        !formData.format ||
        !formData.ideaType
      ) {
        alert("Please fill in all fields");
        return;
      }

      const newIdea: Idea = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        proposedBy: formData.proposedBy,
        format: formData.format,
        ideaType: formData.ideaType,
        timestamp: new Date(),
        contributors: [],
        upvotes: 0,
      };

      addIdea(newIdea);
      setFormData({
        title: "",
        description: "",
        proposedBy: "",
        format: "",
        ideaType: "",
      });
    };

    return (
      <div
        style={{
          minHeight: isMobile ? "calc(100vh - 72px)" : "calc(100vh - 64px)",
          background: "transparent",
          padding: isMobile ? "16px" : "24px",
        }}
      >
        <main
          style={{ maxWidth: isMobile ? "100%" : "800px", margin: "0 auto" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: isMobile ? "8px" : "12px",
              padding: isMobile ? "24px" : "40px",
              boxShadow: "0 4px 6px rgba(0, 33, 71, 0.07)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile ? "24px" : "32px",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "20px" : "28px",
                  background:
                    "linear-gradient(135deg, #002147 0%, #003366 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: isMobile ? "6px" : "8px",
                  fontWeight: "600",
                  letterSpacing: "-0.02em",
                }}
              >
                Submit Your Idea
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: "1.5",
                }}
              >
                Share your innovative outreach concept with the community
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border-color 0.2s ease",
                    outline: "none",
                  }}
                  placeholder="Enter your idea title"
                  onFocus={(e) => (e.target.style.borderColor = "#002147")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    minHeight: "100px",
                    resize: "vertical",
                    transition: "border-color 0.2s ease",
                    outline: "none",
                    lineHeight: "1.5",
                  }}
                  placeholder="Describe your idea in detail..."
                  onFocus={(e) => (e.target.style.borderColor = "#002147")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Proposed By *
                </label>
                <input
                  type="text"
                  value={formData.proposedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, proposedBy: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border-color 0.2s ease",
                    outline: "none",
                  }}
                  placeholder="Your name"
                  onFocus={(e) => (e.target.style.borderColor = "#002147")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? "20px" : "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      fontSize: "12px",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Format *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {formatOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, format: option.value })
                        }
                        style={{
                          backgroundColor:
                            formData.format === option.value
                              ? option.color
                              : "white",
                          color:
                            formData.format === option.value
                              ? "white"
                              : option.color,
                          border: `1px solid ${option.color}`,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (formData.format !== option.value) {
                            e.currentTarget.style.backgroundColor =
                              option.color;
                            e.currentTarget.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.format !== option.value) {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.color = option.color;
                          }
                        }}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      fontSize: "12px",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Idea Type *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {ideaTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, ideaType: option.value })
                        }
                        style={{
                          backgroundColor:
                            formData.ideaType === option.value
                              ? option.color
                              : "white",
                          color:
                            formData.ideaType === option.value
                              ? "white"
                              : option.color,
                          border: `1px solid ${option.color}`,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (formData.ideaType !== option.value) {
                            e.currentTarget.style.backgroundColor =
                              option.color;
                            e.currentTarget.style.color = "white";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.ideaType !== option.value) {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.color = option.color;
                          }
                        }}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(135deg, #002147 0%, #003366 100%)",
                  color: "white",
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  alignSelf: "flex-start",
                  boxShadow: "0 2px 4px rgba(0, 33, 71, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #003366 0%, #004080 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 33, 71, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #002147 0%, #003366 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 33, 71, 0.2)";
                }}
              >
                Submit Idea
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  };

  // Vote Page Component
  const VotePage = () => {
    const isMobile = window.innerWidth <= 768;

    return (
      <div
        style={{
          minHeight: isMobile ? "calc(100vh - 72px)" : "calc(100vh - 64px)",
          background: "transparent",
          padding: isMobile ? "16px" : "32px 24px",
        }}
      >
        <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: "8px",
              padding: isMobile ? "16px" : "20px",
              marginBottom: isMobile ? "16px" : "20px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 33, 71, 0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "18px" : "20px",
                background: "linear-gradient(135deg, #002147 0%, #003366 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "4px",
                fontWeight: "600",
                letterSpacing: "-0.02em",
              }}
            >
              {isMobile ? "Vote & Contribute" : "Vote & Contribute"}
            </h2>
            <p
              style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}
            >
              Support ideas you love and contribute your expertise
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {ideas.map((idea) => (
              <div
                key={idea.id}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 4px rgba(0, 33, 71, 0.05)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 33, 71, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 33, 71, 0.05)";
                }}
              >
                <div
                  onClick={() => toggleExpanded(idea.id)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "4px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "16px",
                            color: "#002147",
                            margin: "0",
                            fontWeight: "600",
                            lineHeight: "1.3",
                          }}
                        >
                          {idea.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: getOptionColor(
                                formatOptions,
                                idea.format
                              ),
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.02em",
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
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {idea.ideaType}
                          </span>
                        </div>
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            BY
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#475569",
                              fontWeight: "500",
                            }}
                          >
                            {idea.proposedBy}
                          </span>
                        </div>
                        {idea.contributors.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "2px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                fontWeight: "500",
                              }}
                            >
                              {idea.contributors.length} contributor
                              {idea.contributors.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        upvoteIdea(idea.id);
                      }}
                      style={{
                        background: "#ff6b8a",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "11px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 3px 8px rgba(255, 107, 138, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>♥</span>
                      <span>{idea.upvotes}</span>
                    </button>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      {expandedIdeas.has(idea.id) ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {expandedIdeas.has(idea.id) && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        marginBottom: "16px",
                        lineHeight: "1.5",
                      }}
                    >
                      {idea.description}
                    </p>

                    {idea.contributors.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <h4
                          style={{
                            fontSize: "12px",
                            color: "#002147",
                            margin: "0 0 12px 0",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Contributors ({idea.contributors.length})
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {idea.contributors.map((contributor) => {
                            const getExpertiseColor = (level: string) => {
                              switch (level) {
                                case "Newish":
                                  return "#22c55e";
                                case "Experienced":
                                  return "#16a34a";
                                case "Very Experienced":
                                  return "#15803d";
                                default:
                                  return "#6b7280";
                              }
                            };

                            const getContributionColor = (
                              contribution: string
                            ) => {
                              switch (contribution) {
                                case "Organise":
                                  return "#2563eb";
                                case "Deliver":
                                  return "#7c3aed";
                                case "Host":
                                  return "#059669";
                                case "Provide Venue":
                                  return "#dc2626";
                                case "Admin":
                                  return "#ea580c";
                                default:
                                  return "#6b7280";
                              }
                            };

                            return (
                              <div
                                key={contributor.id}
                                style={{
                                  backgroundColor: "#f8fafc",
                                  padding: "12px",
                                  borderRadius: "6px",
                                  border: "1px solid #f1f5f9",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      <strong
                                        style={{
                                          color: "#002147",
                                          fontSize: "13px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {contributor.name}
                                      </strong>
                                      <span
                                        style={{
                                          backgroundColor: getExpertiseColor(
                                            contributor.expertiseLevel
                                          ),
                                          color: "white",
                                          padding: "2px 6px",
                                          borderRadius: "3px",
                                          fontSize: "9px",
                                          fontWeight: "600",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.02em",
                                        }}
                                      >
                                        {contributor.expertiseLevel}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#94a3b8",
                                          fontWeight: "600",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.05em",
                                        }}
                                      >
                                        FROM
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "#64748b",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {contributor.affiliation}
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    style={{
                                      backgroundColor: getContributionColor(
                                        contributor.willingToContribute
                                      ),
                                      color: "white",
                                      padding: "3px 8px",
                                      borderRadius: "4px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.02em",
                                    }}
                                  >
                                    {contributor.willingToContribute}
                                  </span>
                                </div>
                                <div
                                  style={{ fontSize: "10px", color: "#94a3b8" }}
                                >
                                  Joined{" "}
                                  {contributor.timestamp.toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <ContributeForm
                      ideaId={idea.id}
                      onSubmit={addContributor}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };

  // Contribute Form Component
  const ContributeForm = ({
    ideaId,
    onSubmit,
  }: {
    ideaId: string;
    onSubmit: (ideaId: string, contributor: Contributor) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: "",
      affiliation: "",
      expertiseLevel: "",
      willingToContribute: "",
    });

    const affiliationOptions = [
      { value: "College", color: "#2563eb" },
      { value: "Department", color: "#7c3aed" },
      { value: "UAO", color: "#059669" },
      { value: "GLAD", color: "#dc2626" },
      { value: "Other", color: "#6b7280" },
    ];

    const expertiseOptions = [
      { value: "Newish", color: "#22c55e" },
      { value: "Experienced", color: "#16a34a" },
      { value: "Very Experienced", color: "#15803d" },
    ];

    const contributionOptions = [
      { value: "Organise", color: "#2563eb" },
      { value: "Deliver", color: "#7c3aed" },
      { value: "Host", color: "#059669" },
      { value: "Provide Venue", color: "#dc2626" },
      { value: "Admin", color: "#ea580c" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formData.name ||
        !formData.affiliation ||
        !formData.expertiseLevel ||
        !formData.willingToContribute
      ) {
        alert("Please fill in all fields");
        return;
      }

      const contributor: Contributor = {
        id: Date.now().toString(),
        name: formData.name,
        affiliation: formData.affiliation,
        expertiseLevel: formData.expertiseLevel,
        willingToContribute: formData.willingToContribute,
        timestamp: new Date(),
      };

      onSubmit(ideaId, contributor);
      setFormData({
        name: "",
        affiliation: "",
        expertiseLevel: "",
        willingToContribute: "",
      });
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 3px rgba(0, 33, 71, 0.05)",
        }}
      >
        <h4
          style={{
            fontSize: "14px",
            color: "#002147",
            marginBottom: "16px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Contribute to this idea
        </h4>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              fontSize: "11px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Your Name *
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "13px",
              transition: "border-color 0.2s ease",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#002147")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "11px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Affiliation *
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            {affiliationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, affiliation: option.value })
                }
                style={{
                  backgroundColor:
                    formData.affiliation === option.value
                      ? option.color
                      : "white",
                  color:
                    formData.affiliation === option.value
                      ? "white"
                      : option.color,
                  border: `1px solid ${option.color}`,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (formData.affiliation !== option.value) {
                    e.currentTarget.style.backgroundColor = option.color;
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.affiliation !== option.value) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = option.color;
                  }
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "11px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Expertise Level *
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            {expertiseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, expertiseLevel: option.value })
                }
                style={{
                  backgroundColor:
                    formData.expertiseLevel === option.value
                      ? option.color
                      : "white",
                  color:
                    formData.expertiseLevel === option.value
                      ? "white"
                      : option.color,
                  border: `1px solid ${option.color}`,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (formData.expertiseLevel !== option.value) {
                    e.currentTarget.style.backgroundColor = option.color;
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.expertiseLevel !== option.value) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = option.color;
                  }
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              fontSize: "11px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Contribution *
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "8px",
            }}
          >
            {contributionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    willingToContribute: option.value,
                  })
                }
                style={{
                  backgroundColor:
                    formData.willingToContribute === option.value
                      ? option.color
                      : "white",
                  color:
                    formData.willingToContribute === option.value
                      ? "white"
                      : option.color,
                  border: `1px solid ${option.color}`,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (formData.willingToContribute !== option.value) {
                    e.currentTarget.style.backgroundColor = option.color;
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.willingToContribute !== option.value) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = option.color;
                  }
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #002147 0%, #003366 100%)",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 1px 3px rgba(0, 33, 71, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #003366 0%, #004080 100%)";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 33, 71, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #002147 0%, #003366 100%)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 33, 71, 0.2)";
          }}
        >
          Add Contribution
        </button>
      </form>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8faff 0%, #f0f5ff 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Header />
      {currentPage === "home" && <HomePage />}
      {currentPage === "overview" && <IdeasOverview />}
      {currentPage === "submit" && <SubmitPage />}
      {currentPage === "vote" && <VotePage />}
    </div>
  );
};

export default App;
