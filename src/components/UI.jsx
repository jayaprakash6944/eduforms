// ─── StatusBadge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const cfg = {
    approved:  { bg: "#dcfce7", color: "#166534", text: "Approved",  dot: "#16a34a" },
    pending:   { bg: "#fef3c7", color: "#92400e", text: "Pending",   dot: "#f59e0b" },
    rejected:  { bg: "#fee2e2", color: "#991b1b", text: "Rejected",  dot: "#dc2626" },
    "in-review":{ bg: "#dbeafe", color: "#1e40af", text: "In Review", dot: "#3b82f6" },
    waiting:   { bg: "#f1f5f9", color: "#475569", text: "Waiting",   dot: "#94a3b8" },
  };
  const c = cfg[status] || cfg.waiting;
  return (
    <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.text}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ initials, size = 36, bg = "#e85d26", color = "#fff" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0, letterSpacing: 0.5 }}>
    {initials}
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color = "#e85d26" }) => (
  <div className="slide-in" style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(13,27,42,0.07)", border: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#1a2332", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#4a5568", fontWeight: 500, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#8898aa", marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ─── Button ───────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = "primary", small, icon, disabled }) => {
  const styles = {
    primary:   { background: "linear-gradient(135deg, #e85d26, #c74d1a)", color: "white" },
    secondary: { background: "white", color: "#4a5568", border: "1.5px solid #e8e4dc" },
    danger:    { background: "#fee2e2", color: "#dc2626" },
    success:   { background: "#dcfce7", color: "#166534" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: small ? "7px 14px" : "10px 20px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: small ? 12 : 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.15s",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// ─── PageWrapper ──────────────────────────────────────────────────────────────
export const PageWrapper = ({ title, subtitle, actions, children }) => (
  <div className="slide-in" style={{ padding: "32px 36px" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0d1b2a", letterSpacing: -0.5 }}>{title}</h1>
        {subtitle && <p style={{ color: "#8898aa", fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
    {children}
  </div>
);

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
export const FilterTabs = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        style={{
          padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
          border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
          textTransform: "capitalize",
          borderColor: value === opt ? "#e85d26" : "#e8e4dc",
          background:   value === opt ? "#e85d26" : "white",
          color:        value === opt ? "white"   : "#4a5568",
        }}
      >
        {opt}
      </button>
    ))}
  </div>
);

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ headers, children }) => (
  <div style={{ background: "white", borderRadius: 18, boxShadow: "var(--shadow)", overflow: "hidden" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f5f2ed" }}>
          {headers.map(h => (
            <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#8898aa", textAlign: "left", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Tr = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{ borderBottom: "1px solid #f5f2ed", transition: "background 0.15s", cursor: onClick ? "pointer" : "default" }}
    onMouseOver={e => e.currentTarget.style.background = "#fafaf8"}
    onMouseOut={e => e.currentTarget.style.background = "transparent"}
  >
    {children}
  </tr>
);

export const Td = ({ children, mono, accent }) => (
  <td style={{
    padding: "14px 16px",
    fontSize: 13,
    fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
    fontWeight: mono ? 600 : "inherit",
    color: accent ? "#e85d26" : "#1a2332",
  }}>
    {children}
  </td>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ emoji, title, subtitle }) => (
  <div style={{ background: "white", borderRadius: 18, padding: "80px 40px", textAlign: "center", boxShadow: "var(--shadow)" }}>
    <div style={{ fontSize: 56, marginBottom: 16 }}>{emoji}</div>
    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
    {subtitle && <p style={{ color: "#8898aa", fontSize: 14 }}>{subtitle}</p>}
  </div>
);
