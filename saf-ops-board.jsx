import { useState } from "react";

const CATEGORIES = ["All", "IT & Systems", "Logistics", "Admin & HR", "Training", "Medical", "Finance", "Legal", "Ops Planning", "Other"];

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Automating NS Unit Strength Reports from NS Portal",
    category: "IT & Systems",
    rank: "MAJ",
    unit: "3 DIV HQ",
    author: "Regular",
    description: "We're spending about 2 man-hours every week manually pulling unit strength figures from the NS Portal and reformatting them into our internal Excel tracker. Is there any way to automate this or at least script the data extraction? Would save us significant time across the formation.",
    tags: ["automation", "excel", "data"],
    timestamp: "2 days ago",
    responses: [
      {
        id: 1,
        author: "CPL Tan Wei Jie",
        role: "NSF — Software Engineer (civ: Grab)",
        avatar: "TW",
        content: "I can write a Python script using Selenium to log in and scrape the data automatically, then push it into your Excel with openpyxl. Should take me an afternoon. The script can be scheduled with Windows Task Scheduler to run every Monday morning.",
        upvotes: 12,
        timestamp: "1 day ago",
        accepted: true,
      },
      {
        id: 2,
        author: "3SG Priya Nair",
        role: "NSF — Data Analyst (civ: GovTech)",
        avatar: "PN",
        content: "Alternatively if the portal has an API or allows data export to CSV, Power Query in Excel can be set up to refresh automatically. No coding needed on your end once it's configured.",
        upvotes: 7,
        timestamp: "1 day ago",
        accepted: false,
      },
    ],
    upvotes: 19,
    status: "resolved",
  },
  {
    id: 2,
    title: "Best way to structure a handover package for incoming OC?",
    category: "Admin & HR",
    rank: "CPT",
    unit: "9 SIR",
    author: "Regular",
    description: "Handing over to incoming OC in 6 weeks. Want to create a proper digital handover package — not just a folder of random Word docs. Looking for best practices on structure, what to include, tools to use. Has anyone done this well before?",
    tags: ["handover", "documentation", "best-practices"],
    timestamp: "4 days ago",
    responses: [
      {
        id: 3,
        author: "CPL Marcus Lim",
        role: "NSman — Project Manager (Deloitte)",
        avatar: "ML",
        content: "In my civilian role we use Notion for this. You can create a structured wiki with nested pages — Org Overview → Key Contacts → Ongoing Issues → SOPs → Historical Context. It's free, web-based, and you can share a link. Way better than a SharePoint folder.",
        upvotes: 9,
        timestamp: "3 days ago",
        accepted: false,
      },
    ],
    upvotes: 11,
    status: "open",
  },
  {
    id: 3,
    title: "Need advice on reducing sick parade queue time at medical centre",
    category: "Medical",
    rank: "LTC",
    unit: "AMC",
    author: "Regular",
    description: "Our morning sick parade is consistently taking 45-60 min with bottlenecks at registration. NSFs are queuing from 0600. Looking for any process improvement ideas — whether digital pre-registration, better queue management, or workflow redesign. Open to any suggestions.",
    tags: ["process-improvement", "queue", "medical"],
    timestamp: "1 week ago",
    responses: [
      {
        id: 4,
        author: "3SG Aditya Sharma",
        role: "NSF — UX Designer (civ: Figma)",
        avatar: "AS",
        content: "A simple Google Form sent via QR code the night before can pre-collect symptoms and reason for visit. Triage staff review overnight, reducing the registration time to just ID verification in the morning. I can design the form flow if useful.",
        upvotes: 21,
        timestamp: "6 days ago",
        accepted: true,
      },
      {
        id: 5,
        author: "CPL Kevin Ong",
        role: "NSman — Operations (SGH)",
        avatar: "KO",
        content: "SGH A&E uses queue number SMS notifications. There are free tools like QueueFair or even a simple WhatsApp broadcast that could notify people when their turn is near so they don't have to physically queue from 0600.",
        upvotes: 15,
        timestamp: "5 days ago",
        accepted: false,
      },
    ],
    upvotes: 34,
    status: "resolved",
  },
  {
    id: 4,
    title: "How to present training data / KPIs more effectively to higher command?",
    category: "Training",
    rank: "MAJ",
    unit: "SAFTI MI",
    author: "Regular",
    description: "Spending a lot of time building PowerPoint slides for monthly training KPI reviews. The data is there but the visualisations aren't compelling. Looking for advice on better tools, dashboard options, or just cleaner ways to present pass rates, attendance, and trend data to senior officers.",
    tags: ["data-viz", "powerpoint", "reporting"],
    timestamp: "3 days ago",
    responses: [],
    upvotes: 8,
    status: "open",
  },
];

const STATUS_CONFIG = {
  resolved: { label: "Resolved", bg: "#d1fae5", color: "#065f46" },
  open: { label: "Open", bg: "#fef3c7", color: "#92400e" },
};

const CAT_COLORS = {
  "IT & Systems": { bg: "#ede9fe", color: "#4c1d95" },
  "Logistics": { bg: "#e0f2fe", color: "#0c4a6e" },
  "Admin & HR": { bg: "#fce7f3", color: "#831843" },
  "Training": { bg: "#dcfce7", color: "#14532d" },
  "Medical": { bg: "#fee2e2", color: "#7f1d1d" },
  "Finance": { bg: "#fef9c3", color: "#713f12" },
  "Legal": { bg: "#f3e8ff", color: "#581c87" },
  "Ops Planning": { bg: "#cffafe", color: "#164e63" },
  "Other": { bg: "#f1f5f9", color: "#334155" },
};

const AVATAR_COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899"];

function getAvatarColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function Avatar({ initials, size = 36 }) {
  const bg = getAvatarColor(initials);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.35,
      fontWeight: 600, color: "#fff", flexShrink: 0,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>{initials}</div>
  );
}

function Badge({ label, bg, color }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function PostCard({ post, onClick }) {
  const catStyle = CAT_COLORS[post.category] || CAT_COLORS["Other"];
  const statusStyle = STATUS_CONFIG[post.status];
  return (
    <div onClick={() => onClick(post)} style={{
      background: "#fff", border: "1px solid #e5e7eb",
      borderRadius: 12, padding: "16px 20px", cursor: "pointer",
      transition: "box-shadow 0.15s, border-color 0.15s",
      marginBottom: 10,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: "#f0f0ff", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 18 }}>
            {post.category === "IT & Systems" ? "💻" :
             post.category === "Admin & HR" ? "📋" :
             post.category === "Training" ? "🎯" :
             post.category === "Medical" ? "⚕️" :
             post.category === "Logistics" ? "📦" :
             post.category === "Finance" ? "💰" :
             post.category === "Ops Planning" ? "🗺️" : "❓"}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6, alignItems: "center" }}>
            <Badge label={post.category} bg={catStyle.bg} color={catStyle.color} />
            <Badge label={statusStyle.label} bg={statusStyle.bg} color={statusStyle.color} />
          </div>
          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15, color: "#111827", lineHeight: 1.4 }}>{post.title}</p>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
            {post.description.length > 120 ? post.description.slice(0, 120) + "…" : post.description}
          </p>
          <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#9ca3af", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "#374151" }}>{post.rank} · {post.unit}</span>
            <span>{post.timestamp}</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              <span>▲ {post.upvotes}</span>
              <span>💬 {post.responses.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostDetail({ post, onBack, onUpvote, onAddResponse }) {
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyRole, setReplyRole] = useState("");
  const catStyle = CAT_COLORS[post.category] || CAT_COLORS["Other"];
  const statusStyle = STATUS_CONFIG[post.status];

  function handleSubmit() {
    if (!replyText.trim() || !replyName.trim()) return;
    const initials = replyName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    onAddResponse(post.id, {
      id: Date.now(),
      author: replyName,
      role: replyRole || "NSF / NSman",
      avatar: initials,
      content: replyText,
      upvotes: 0,
      timestamp: "Just now",
      accepted: false,
    });
    setReplyText(""); setReplyName(""); setReplyRole("");
  }

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#6366f1", fontSize: 14, fontWeight: 600, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 4, padding: 0,
      }}>← Back to board</button>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <Badge label={post.category} bg={catStyle.bg} color={catStyle.color} />
          <Badge label={statusStyle.label} bg={statusStyle.bg} color={statusStyle.color} />
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.35 }}>{post.title}</h2>
        <p style={{ margin: "0 0 14px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{post.description}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {post.tags.map(t => (
            <span key={t} style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>#{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Posted by <strong>{post.rank}</strong> · {post.unit} · {post.timestamp}</span>
          <button onClick={() => onUpvote(post.id)} style={{
            background: "#f5f3ff", color: "#6366f1", border: "none",
            borderRadius: 8, padding: "5px 14px", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
          }}>▲ {post.upvotes} Upvote</button>
        </div>
      </div>

      <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14, color: "#374151" }}>{post.responses.length} Response{post.responses.length !== 1 ? "s" : ""}</p>

      {post.responses.map(r => (
        <div key={r.id} style={{
          background: r.accepted ? "#f0fdf4" : "#fff",
          border: `1px solid ${r.accepted ? "#86efac" : "#e5e7eb"}`,
          borderRadius: 12, padding: "14px 18px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Avatar initials={r.avatar} size={36} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.author}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{r.role}</p>
            </div>
            {r.accepted && <span style={{ marginLeft: "auto", background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>✓ Accepted</span>}
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{r.content}</p>
          <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 12 }}>
            <span>▲ {r.upvotes} helpful</span>
            <span>{r.timestamp}</span>
          </div>
        </div>
      ))}

      <div style={{ background: "#fafafa", border: "1px dashed #d1d5db", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 14, color: "#374151" }}>Add your response</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input placeholder="Your name / rank" value={replyName} onChange={e => setReplyName(e.target.value)}
            style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 14, background: "#fff" }} />
          <input placeholder="Role (e.g. NSF – SWE at Shopee)" value={replyRole} onChange={e => setReplyRole(e.target.value)}
            style={{ flex: 2, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 14, background: "#fff" }} />
        </div>
        <textarea placeholder="Share your knowledge, suggestion, or experience…" value={replyText}
          onChange={e => setReplyText(e.target.value)} rows={4}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, resize: "vertical", boxSizing: "border-box", background: "#fff" }} />
        <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleSubmit} style={{
            background: "#6366f1", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 22px", cursor: "pointer",
            fontSize: 14, fontWeight: 600,
          }}>Post Response</button>
        </div>
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("IT & Systems");
  const [rank, setRank] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  function handleSubmit() {
    if (!title.trim() || !description.trim()) return;
    onSubmit({
      id: Date.now(),
      title, category,
      rank: rank || "MAJ", unit: unit || "HQ",
      author: "Regular",
      description,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      timestamp: "Just now",
      responses: [],
      upvotes: 0,
      status: "open",
    });
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "24px 28px",
        width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Post a Problem</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Title *</label>
        <input placeholder="What's the problem in one line?" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}>
              {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Rank</label>
            <input placeholder="e.g. MAJ, CPT" value={rank} onChange={e => setRank(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14 }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Unit</label>
            <input placeholder="e.g. 3 DIV HQ" value={unit} onChange={e => setUnit(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14 }} />
          </div>
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Describe the problem *</label>
        <textarea placeholder="The more context you give, the more useful the responses will be…" value={description}
          onChange={e => setDescription(e.target.value)} rows={5}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, resize: "vertical", marginBottom: 12, boxSizing: "border-box" }} />

        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Tags (comma separated)</label>
        <input placeholder="e.g. automation, excel, data" value={tags} onChange={e => setTags(e.target.value)}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "#f3f4f6", color: "#374151", border: "none",
            borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            background: "#6366f1", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 22px", cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>Post Problem</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "all" || (activeTab === "open" && p.status === "open") || (activeTab === "resolved" && p.status === "resolved");
    return matchCat && matchSearch && matchTab;
  });

  function handleUpvote(id) {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    if (selectedPost?.id === id) setSelectedPost(p => ({ ...p, upvotes: p.upvotes + 1 }));
  }

  function handleAddResponse(postId, response) {
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, responses: [...p.responses, response] } : p));
    setSelectedPost(p => ({ ...p, responses: [...p.responses, response] }));
  }

  function handleNewPost(post) {
    setPosts(ps => [post, ...ps]);
  }

  const openCount = posts.filter(p => p.status === "open").length;
  const resolvedCount = posts.filter(p => p.status === "resolved").length;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ background: "#1e1b4b", borderBottom: "1px solid #312e81" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, background: "#6366f1", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🛡️</div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: -0.3 }}>OpsBoard</p>
                <p style={{ margin: 0, fontSize: 11, color: "#a5b4fc" }}>SAF Knowledge Exchange</p>
              </div>
            </div>
            <button onClick={() => setShowNewPost(true)} style={{
              background: "#6366f1", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 18px", cursor: "pointer",
              fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
            }}>
              + Post a Problem
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px" }}>
        {!selectedPost ? (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total Problems", value: posts.length, icon: "📋" },
                { label: "Open", value: openCount, icon: "🔍" },
                { label: "Resolved", value: resolvedCount, icon: "✅" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.icon} {s.label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "#111827" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }}>🔍</span>
              <input placeholder="Search problems…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px 10px 36px", fontSize: 14, background: "#fff", boxSizing: "border-box" }} />
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {[["all","All"],["open","Open"],["resolved","Resolved"]].map(([val, label]) => (
                <button key={val} onClick={() => setActiveTab(val)} style={{
                  border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  background: activeTab === val ? "#1e1b4b" : "#f3f4f6",
                  color: activeTab === val ? "#fff" : "#374151",
                }}>{label}</button>
              ))}
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} style={{
                  border: activeCategory === c ? "none" : "1px solid #e5e7eb",
                  borderRadius: 20, padding: "5px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                  background: activeCategory === c ? "#6366f1" : "#fff",
                  color: activeCategory === c ? "#fff" : "#374151",
                  flexShrink: 0,
                }}>{c}</button>
              ))}
            </div>

            {/* Posts */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <p style={{ fontSize: 32 }}>🔍</p>
                <p style={{ fontSize: 14 }}>No problems match your filters.</p>
              </div>
            ) : filtered.map(post => (
              <PostCard key={post.id} post={post} onClick={setSelectedPost} />
            ))}
          </>
        ) : (
          <PostDetail
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
            onUpvote={handleUpvote}
            onAddResponse={handleAddResponse}
          />
        )}
      </div>

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} />
      )}
    </div>
  );
}
