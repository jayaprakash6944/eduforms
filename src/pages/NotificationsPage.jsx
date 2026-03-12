import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getNotificationsAPI, markReadAPI, markAllReadAPI } from "../utils/api";

const TYPE_STYLES = {
  approval:  { bg:"#f0fdf4", border:"#bbf7d0", left:"#059669" },
  rejection: { bg:"#fef2f2", border:"#fecaca", left:"#dc2626" },
  pending:   { bg:"#fffbeb", border:"#fde68a", left:"#f59e0b" },
  reminder:  { bg:"#eff6ff", border:"#bfdbfe", left:"#2563eb" },
  info:      { bg:"#f5f2ed", border:"#e8e4dc", left:"#8898aa" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [error,          setError]         = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotificationsAPI();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await markReadAPI(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllReadAPI();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Notifications</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>
            {unread} unread notification{unread!==1?"s":""}
          </p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={load}
            style={{padding:"8px 14px",borderRadius:10,border:"1.5px solid #e8e4dc",
              background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            🔄 Refresh
          </button>
          {unread > 0 && (
            <button onClick={handleMarkAll}
              style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e8e4dc",
                background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{background:"white",borderRadius:16,padding:"60px 20px",
          textAlign:"center",color:"#8898aa",fontSize:14,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          Loading notifications...
        </div>
      ) : error ? (
        <div style={{background:"#fef2f2",borderRadius:12,padding:"20px",
          color:"#dc2626",fontSize:13,textAlign:"center"}}>❌ {error}</div>
      ) : notifications.length===0 ? (
        <div style={{background:"white",borderRadius:16,padding:"60px 20px",
          textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:48,marginBottom:12}}>🔔</div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>No notifications yet</div>
          <div style={{fontSize:13,color:"#8898aa"}}>
            You'll be notified when your applications are updated.
          </div>
        </div>
      ) : (
        <div style={{background:"white",borderRadius:16,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",overflow:"hidden"}}>
          {notifications.map((n,i) => {
            const s = TYPE_STYLES[n.type] || TYPE_STYLES.info;
            return (
              <div key={n._id}
                onClick={() => !n.read && handleMarkRead(n._id)}
                style={{ display:"flex", gap:14, padding:"16px 22px",
                  borderBottom: i<notifications.length-1 ? "1px solid #f5f2ed" : "none",
                  background: n.read ? "white" : s.bg,
                  borderLeft: "4px solid " + (n.read ? "transparent" : s.left),
                  cursor: n.read ? "default" : "pointer", transition:"background 0.15s" }}
                onMouseOver={e => { if(!n.read) e.currentTarget.style.opacity="0.85"; }}
                onMouseOut={e  => { e.currentTarget.style.opacity="1"; }}>

                {/* Icon */}
                <div style={{width:42,height:42,borderRadius:12,flexShrink:0,
                  background:n.read?"#f5f2ed":s.bg,
                  border:"1.5px solid "+(n.read?"#e8e4dc":s.border),
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                  {n.icon||"🔔"}
                </div>

                {/* Content */}
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div style={{fontSize:14,fontWeight:n.read?500:700,color:"#0d1b2a"}}>
                      {n.title}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <span style={{fontSize:11,color:"#8898aa",whiteSpace:"nowrap"}}>{n.time}</span>
                      {!n.read && (
                        <span style={{width:8,height:8,borderRadius:"50%",
                          background:"#e85d26",display:"inline-block"}}/>
                      )}
                    </div>
                  </div>
                  <div style={{fontSize:13,color:"#4a5568",marginTop:4,lineHeight:1.6}}>
                    {n.message}
                  </div>
                  {n.appId && (
                    <div style={{fontSize:11,fontWeight:600,color:"#e85d26",marginTop:5}}>
                      Ref: {n.appId}
                    </div>
                  )}
                  {!n.read && (
                    <div style={{fontSize:10,color:"#8898aa",marginTop:4}}>
                      Click to mark as read
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}