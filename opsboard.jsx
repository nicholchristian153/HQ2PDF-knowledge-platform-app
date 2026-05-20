import { useState } from "react";

const CATEGORIES = ["All", "Tech & IT", "Logistics", "Training", "Admin & HR", "Procurement", "Welfare", "Operations"];

const CAT_COLORS = {
  "Tech & IT": { text: "#70b8f0", bg: "#0d2035", border: "#1a3a55" },
  "Logistics": { text: "#e8a44a", bg: "#2a1e0a", border: "#4a3010" },
  "Training": { text: "#b07af0", bg: "#1e0d35", border: "#3a1a55" },
  "Admin & HR": { text: "#4accc4", bg: "#0d2a28", border: "#0f3d38" },
  "Procurement": { text: "#e87ab0", bg: "#2a0d1e", border: "#4a1030" },
  "Welfare": { text: "#7ac47a", bg: "#0d2a0d", border: "#1a3d1a" },
  "Operations": { text: "#e8704a", bg: "#2a1408", border: "#4a2010" },
};

const URGENCY = {
  high: { label: "Urgent", tc: "#ff8080", bg: "#2d1010", bc: "#4a1818" },
  medium: { label: "Active", tc: "#7ac47a", bg: "#0d2010", bc: "#1a3518" },
  low: { label: "Low priority", tc: "#7ab0e8", bg: "#0d1830", bc: "#162545" },
};

const INIT_PROBLEMS = [
  {
    id: 1,
    title: "Automating duty roster generation across multiple companies",
    desc: "Currently managing duty rosters manually in Excel across 3 companies. The process is error-prone and takes nearly a full day every month. Looking for someone with a software or HR-tech background who can help streamline or automate this.",
    category: "Admin & HR",
    postedBy: "MAJ",
    unit: "30SCE",
    urgency: "medium",
    responses: 8,
    helpers: ["LTA (NSF) – Software engineer", "CPL (NS) – Data analyst at Grab", "CFC (NS) – HR tech consultant", "SGT (NS) – Product manager", "PTE (NSF) – CS undergrad, NUS", "3 others offered to help"],
    timestamp: "3 hours ago",
    solved: false,
    tags: ["automation", "excel", "scheduling"],
  },
  {
    id: 2,
    title: "ISO 9001 audit preparation – need quality management expertise",
    desc: "We have an ISO 9001 audit coming up in 6 weeks and our documentation is not in order. Looking for anyone with quality management systems experience who can advise on structuring our SOPs and audit trail.",
    category: "Admin & HR",
    postedBy: "CPT",
    unit: "CSSCOM",
    urgency: "high",
    responses: 3,
    helpers: ["SGT (NS) – Quality manager at MNC", "CFC (NS) – Management consultant"],
    timestamp: "5 hours ago",
    solved: false,
    tags: ["ISO", "audit", "quality", "SOPs"],
  },
  {
    id: 3,
    title: "Fleet maintenance scheduling – reducing unplanned vehicle downtime",
    desc: "Our current PMI schedule isn't catching faults early enough, leading to unplanned downtime that affects ops. Looking for someone with fleet management, mechanical engineering, or predictive maintenance experience.",
    category: "Logistics",
    postedBy: "LTC",
    unit: "4WD",
    urgency: "medium",
    responses: 12,
    helpers: ["WO1 (NS) – Fleet operations manager", "SGT (NSF) – Mechanical engineering student", "10 others offered to help"],
    timestamp: "1 day ago",
    solved: true,
    tags: ["vehicles", "maintenance", "PMI", "fleet"],
  },
  {
    id: 4,
    title: "Building a compliance tracking dashboard for sensitive equipment",
    desc: "We need a system to track which equipment is subject to export control regulations and maintain audit trails for movement logs. Looking for someone with compliance, legal, or software development experience.",
    category: "Tech & IT",
    postedBy: "COL",
    unit: "MINDEF",
    urgency: "low",
    responses: 6,
    helpers: ["PTE (NSF) – CS undergrad building similar tool", "CPL (NS) – Compliance officer at law firm", "4 others offered to help"],
    timestamp: "2 days ago",
    solved: false,
    tags: ["compliance", "dashboard", "tracking", "data"],
  },
  {
    id: 5,
    title: "Reducing cookhouse food waste during low-attendance periods",
    desc: "Weekend and public holiday attendance drops significantly but we're over-ordering. Looking for someone with supply chain, F&B operations, or demand forecasting experience to help us right-size orders.",
    category: "Welfare",
    postedBy: "CPT",
    unit: "5SIR",
    urgency: "low",
    responses: 15,
    helpers: ["SGT (NS) – Runs a restaurant", "CFC (NS) – Supply chain analyst at DHL", "13 others offered to help"],
    timestamp: "3 days ago",
    solved: true,
    tags: ["supply chain", "F&B", "forecasting"],
  },
  {
    id: 6,
    title: "Digital attendance tracking for vocation courses – low connectivity environments",
    desc: "Paper-based attendance forms keep getting lost or miscounted. Need a digital solution that works reliably in training areas with poor network coverage. NSF/NSMen with mobile app dev or offline-first experience would be ideal.",
    category: "Training",
    postedBy: "LTC",
    unit: "SAFTI MI",
    urgency: "medium",
    responses: 9,
    helpers: ["LTA (NSF) – UX designer at Shopee", "CPL (NS) – Mobile app developer", "7 others offered to help"],
    timestamp: "4 days ago",
    solved: false,
    tags: ["attendance", "mobile", "offline", "training"],
  },
];

export default function OpsBoard() {
  const [problems, setProblems] = useState(INIT_PROBLEMS);
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [viewProblem, setViewProblem] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerText, setOfferText] = useState("");
  const [offerRole, setOfferRole] = useState("");
  const [newP, setNewP] = useState({ title: "", desc: "", category: "Tech & IT", urgency: "medium", unit: "" });
  const [notif, setNotif] = useState(null);
  const [filterSolved, setFilterSolved] = useState("all");

  const toast = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3500);
  };

  const filtered = problems.filter((p) => {
    const cat = activeCat === "All" || p.category === activeCat;
    const sv = filterSolved === "all" || (filterSolved === "open" && !p.solved) || (filterSolved === "solved" && p.solved);
    const q = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.tags?.some(t => t.includes(search.toLowerCase()));
    return cat && sv && q;
  });

  const stats = {
    open: problems.filter(p => !p.solved).length,
    solved: problems.filter(p => p.solved).length,
    helpers: problems.reduce((a, p) => a + p.responses, 0),
  };

  const postProblem = () => {
    if (!newP.title.trim() || !newP.desc.trim()) return;
    setProblems([{ id: Date.now(), ...newP, postedBy: "CPT (Reg)", responses: 0, helpers: [], timestamp: "Just now", solved: false, tags: [] }, ...problems]);
    setNewP({ title: "", desc: "", category: "Tech & IT", urgency: "medium", unit: "" });
    setShowPost(false);
    toast("Problem posted — NSMen and NSFs will be notified.");
  };

  const submitOffer = () => {
    if (!offerText.trim()) return;
    setProblems(problems.map(p =>
      p.id === viewProblem.id
        ? { ...p, responses: p.responses + 1, helpers: [`You${offerRole ? ` – ${offerRole}` : ""}`, ...p.helpers] }
        : p
    ));
    const updated = problems.find(p => p.id === viewProblem.id);
    setViewProblem(updated ? { ...updated, responses: updated.responses + 1, helpers: [`You${offerRole ? ` – ${offerRole}` : ""}`, ...updated.helpers] } : null);
    setOfferText(""); setOfferRole(""); setShowOffer(false);
    toast("Offer submitted — the poster will be in touch.");
  };

  const markSolved = (id) => {
    setProblems(problems.map(p => p.id === id ? { ...p, solved: true } : p));
    setViewProblem(null);
    toast("Marked as solved. Great work, everyone!");
  };

  const S = styles;

  return (
    <div style={S.root}>
      <style>{css}</style>

      {notif && <div style={S.toast}>✓ {notif}</div>}

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={S.logo}>
            <div style={S.logoMark}>⬡</div>
            <div>
              <div style={S.logoName}>OPSBOARD</div>
              <div style={S.logoSub}>SAF KNOWLEDGE HUB</div>
            </div>
          </div>

          <div style={S.searchWrap}>
            <span style={S.searchIcon}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems, skills, tags..." style={S.searchInput} />
          </div>

          <div style={{ flex: 1 }} />

          <div style={S.statsRow}>
            <div style={S.statItem}><span style={{ color: "#7ac47a", fontWeight: 600 }}>{stats.open}</span> open</div>
            <div style={S.statDivider} />
            <div style={S.statItem}><span style={{ color: "#4accc4", fontWeight: 600 }}>{stats.solved}</span> solved</div>
            <div style={S.statDivider} />
            <div style={S.statItem}><span style={{ color: "#e8a44a", fontWeight: 600 }}>{stats.helpers}</span> assists</div>
          </div>

          <button className="ob-btn-primary" onClick={() => setShowPost(true)}>+ Post Problem</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>

        {/* FILTERS */}
        <div style={S.filterRow}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`ob-pill${activeCat === cat ? " active" : ""}`} onClick={() => setActiveCat(cat)}>
                {cat === "All" ? `All (${problems.length})` : cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["all", "open", "solved"].map(f => (
              <button key={f} className={`ob-pill${filterSolved === f ? " active" : ""}`} onClick={() => setFilterSolved(f)}>
                {f === "all" ? "All status" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={S.resultsMeta}>
          Showing {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
          {activeCat !== "All" && ` in ${activeCat}`}
          {search && ` matching "${search}"`}
        </div>

        {/* GRID */}
        <div style={S.grid}>
          {filtered.map(p => {
            const cat = CAT_COLORS[p.category] || { text: "#7a9080", bg: "#141c18", border: "#1e2d25" };
            const urg = URGENCY[p.urgency];
            return (
              <div key={p.id} className="ob-card" onClick={() => setViewProblem(p)} style={{ opacity: p.solved ? 0.72 : 1 }}>
                <div style={S.cardTop}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ ...S.badge, color: cat.text, background: cat.bg, border: `1px solid ${cat.border}` }}>{p.category}</span>
                    {p.solved
                      ? <span style={{ ...S.badge, color: "#4accc4", background: "#0a1e1c", border: "1px solid #0f3530" }}>✓ Solved</span>
                      : <span style={{ ...S.badge, color: urg.tc, background: urg.bg, border: `1px solid ${urg.bc}` }}>{urg.label}</span>
                    }
                  </div>
                  <div style={S.ts}>{p.timestamp}</div>
                </div>

                <div style={S.cardTitle}>{p.title}</div>
                <div style={S.cardDesc}>{p.desc}</div>

                {p.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                    {p.tags.map(t => <span key={t} style={S.tag}>#{t}</span>)}
                  </div>
                )}

                <div style={S.cardFoot}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={S.avatar}>{p.postedBy.charAt(0)}</div>
                    <div style={S.ts}>{p.postedBy} · {p.unit}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                    <span style={{ color: "#e8a44a", fontWeight: 600 }}>{p.responses}</span>
                    <span style={{ color: "#4a6054" }}>{p.responses === 1 ? "helper" : "helpers"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={S.empty}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>⬡</div>
            <div style={{ color: "#7a9080", fontSize: 15 }}>No problems found</div>
            <div style={{ color: "#4a6054", fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      {/* ===== VIEW PROBLEM MODAL ===== */}
      {viewProblem && !showOffer && (
        <div style={S.overlay} onClick={() => setViewProblem(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(() => { const cat = CAT_COLORS[viewProblem.category] || { text: "#7a9080", bg: "#141c18", border: "#1e2d25" }; return (
                    <span style={{ ...S.badge, color: cat.text, background: cat.bg, border: `1px solid ${cat.border}` }}>{viewProblem.category}</span>
                  ); })()}
                  {viewProblem.solved && <span style={{ ...S.badge, color: "#4accc4", background: "#0a1e1c", border: "1px solid #0f3530" }}>✓ Solved</span>}
                  {!viewProblem.solved && <span style={{ ...S.badge, color: URGENCY[viewProblem.urgency].tc, background: URGENCY[viewProblem.urgency].bg, border: `1px solid ${URGENCY[viewProblem.urgency].bc}` }}>{URGENCY[viewProblem.urgency].label}</span>}
                </div>
                <button onClick={() => setViewProblem(null)} style={S.closeBtn}>✕</button>
              </div>

              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#c8d4c0", lineHeight: 1.4, marginBottom: 10 }}>{viewProblem.title}</div>

              <div style={{ fontSize: 12, color: "#7a9080", marginBottom: 16 }}>
                Posted by <strong style={{ color: "#a0c4a8" }}>{viewProblem.postedBy}, {viewProblem.unit}</strong> · {viewProblem.timestamp}
              </div>

              <p style={{ color: "#9ab0a0", fontSize: 14, lineHeight: 1.75, marginBottom: 18 }}>{viewProblem.desc}</p>

              {viewProblem.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                  {viewProblem.tags.map(t => <span key={t} style={S.tag}>#{t}</span>)}
                </div>
              )}

              {viewProblem.helpers?.length > 0 && (
                <div style={S.helperBox}>
                  <div style={S.helperTitle}>PEOPLE OFFERING HELP ({viewProblem.responses})</div>
                  {viewProblem.helpers.map((h, i) => (
                    <div key={i} style={{ ...S.helperRow, borderBottom: i < viewProblem.helpers.length - 1 ? "1px solid #1a2520" : "none" }}>
                      <div style={S.helperDot} />
                      <span style={{ fontSize: 13, color: "#9ab0a0" }}>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {!viewProblem.solved ? (
                  <>
                    <button className="ob-btn-primary" style={{ flex: 1 }} onClick={() => setShowOffer(true)}>🙋 Offer My Expertise</button>
                    <button className="ob-btn-ghost" onClick={() => markSolved(viewProblem.id)}>✓ Mark Solved</button>
                  </>
                ) : (
                  <div style={{ color: "#4accc4", fontSize: 13, textAlign: "center", width: "100%", padding: "10px 0" }}>
                    This problem has been solved. Thanks to all who helped! 🎉
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== OFFER HELP MODAL ===== */}
      {showOffer && (
        <div style={S.overlay} onClick={() => setShowOffer(false)}>
          <div style={{ ...S.modal, maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#c8d4c0", marginBottom: 6 }}>Offer Your Expertise</div>
              <div style={{ fontSize: 13, color: "#7a9080", marginBottom: 18 }}>Describe your background and how you can help. The poster will reach out to you directly.</div>

              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>YOUR BACKGROUND / ROLE (optional)</label>
                <input value={offerRole} onChange={e => setOfferRole(e.target.value)} placeholder="e.g. Software engineer at DBS, 5 years experience" style={S.input} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>HOW YOU CAN HELP *</label>
                <textarea value={offerText} onChange={e => setOfferText(e.target.value)} rows={4} placeholder="e.g. I've built roster management tools before and can share a template, or set up a simple script. Happy to schedule a call or help async..." style={{ ...S.input, resize: "none" }} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="ob-btn-primary" style={{ flex: 1 }} onClick={submitOffer}>Submit Offer</button>
                <button className="ob-btn-ghost" onClick={() => setShowOffer(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== POST PROBLEM MODAL ===== */}
      {showPost && (
        <div style={S.overlay} onClick={() => setShowPost(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#c8d4c0", marginBottom: 4 }}>Post a New Problem</div>
              <div style={{ fontSize: 13, color: "#7a9080", marginBottom: 20 }}>Describe your challenge. NSMen and NSFs with relevant expertise will offer to help.</div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>PROBLEM TITLE *</label>
                <input value={newP.title} onChange={e => setNewP({ ...newP, title: e.target.value })} placeholder="e.g. Need help automating leave tracking across vocation" style={S.input} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>DESCRIPTION *</label>
                <textarea value={newP.desc} onChange={e => setNewP({ ...newP, desc: e.target.value })} rows={4} placeholder="Describe the problem in detail. More context = better help. What have you already tried? What expertise are you looking for?" style={{ ...S.input, resize: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={S.label}>CATEGORY</label>
                  <select value={newP.category} onChange={e => setNewP({ ...newP, category: e.target.value })} style={S.input}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>URGENCY</label>
                  <select value={newP.urgency} onChange={e => setNewP({ ...newP, urgency: e.target.value })} style={S.input}>
                    <option value="high">Urgent</option>
                    <option value="medium">Normal</option>
                    <option value="low">Low priority</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>UNIT (optional)</label>
                <input value={newP.unit} onChange={e => setNewP({ ...newP, unit: e.target.value })} placeholder="e.g. 3SIR, CSSCOM, HQ Army..." style={S.input} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="ob-btn-primary" style={{ flex: 1 }} onClick={postProblem}>Post Problem</button>
                <button className="ob-btn-ghost" onClick={() => setShowPost(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#0c1014", minHeight: "100vh", color: "#c8d4c0" },
  header: { background: "#0f1611", borderBottom: "1px solid #1a2520", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, height: 58 },
  logo: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  logoMark: { width: 30, height: 30, background: "#1e3d28", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#7ac47a", fontWeight: 700 },
  logoName: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#c8d4c0", letterSpacing: 1.5 },
  logoSub: { fontSize: 9, color: "#3a5040", letterSpacing: 2.5, marginTop: -1 },
  searchWrap: { flex: 1, maxWidth: 360, position: "relative" },
  searchIcon: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#4a6054", fontSize: 15, pointerEvents: "none" },
  searchInput: { width: "100%", background: "#141c18", border: "1px solid #1e2d25", borderRadius: 6, padding: "7px 12px 7px 32px", fontSize: 13, color: "#c8d4c0", outline: "none" },
  statsRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 12, flexShrink: 0 },
  statItem: { color: "#7a9080" },
  statDivider: { width: 1, height: 14, background: "#1e2d25" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "22px 24px" },
  filterRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, alignItems: "center" },
  resultsMeta: { fontSize: 12, color: "#3a5040", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 },
  badge: { borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500 },
  ts: { fontSize: 11, color: "#4a6054" },
  cardTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 },
  cardTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#c8d4c0", marginBottom: 7, lineHeight: 1.45 },
  cardDesc: { fontSize: 12, color: "#7a9080", lineHeight: 1.6, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  tag: { background: "#141c18", border: "1px solid #1e2820", borderRadius: 3, padding: "2px 7px", fontSize: 11, color: "#4a6054" },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1a2520", paddingTop: 10 },
  avatar: { width: 24, height: 24, borderRadius: 4, background: "#1a3020", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#7ac47a" },
  empty: { textAlign: "center", padding: "60px 0" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: "#111519", border: "1px solid #1e2d25", borderRadius: 12, maxWidth: 580, width: "100%", maxHeight: "88vh", overflowY: "auto" },
  closeBtn: { background: "none", border: "none", color: "#4a6054", fontSize: 16, cursor: "pointer", padding: "2px 6px", lineHeight: 1 },
  helperBox: { background: "#0c1210", border: "1px solid #1a2520", borderRadius: 8, padding: "12px 14px", marginTop: 4 },
  helperTitle: { fontSize: 11, color: "#3a5040", letterSpacing: 1, fontWeight: 600, marginBottom: 10 },
  helperRow: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0" },
  helperDot: { width: 5, height: 5, borderRadius: "50%", background: "#3a6b4a", flexShrink: 0 },
  label: { fontSize: 11, color: "#3a5040", letterSpacing: 1, fontWeight: 600, display: "block", marginBottom: 6 },
  input: { width: "100%", background: "#0c1210", border: "1px solid #1e2d25", borderRadius: 6, padding: "9px 12px", color: "#c8d4c0", fontSize: 13, outline: "none" },
  toast: { position: "fixed", top: 20, right: 20, zIndex: 1000, background: "#162814", border: "1px solid #2a5c3a", borderRadius: 8, padding: "11px 16px", color: "#7ac47a", fontSize: 13, display: "flex", alignItems: "center", gap: 8 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ob-card { background: #111519; border: 1px solid #1a2520; border-radius: 10px; padding: 16px; cursor: pointer; transition: border-color 0.15s, transform 0.15s; }
  .ob-card:hover { border-color: #2e4d38; transform: translateY(-1px); }
  .ob-pill { background: transparent; color: #607870; border: 1px solid #1e2d25; border-radius: 20px; padding: 5px 13px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
  .ob-pill:hover { border-color: #2e4d38; color: #c8d4c0; }
  .ob-pill.active { background: #142018; border-color: #2e5038; color: #7ac47a; }
  .ob-btn-primary { background: #1e3d28; color: #7ac47a; border: 1px solid #2a5238; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .ob-btn-primary:hover { background: #265034; }
  .ob-btn-ghost { background: transparent; color: #7a9080; border: 1px solid #1e2d25; padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .ob-btn-ghost:hover { background: #141c18; border-color: #2e4d38; color: #c8d4c0; }
  input::placeholder, textarea::placeholder { color: #3a5040; }
`;
