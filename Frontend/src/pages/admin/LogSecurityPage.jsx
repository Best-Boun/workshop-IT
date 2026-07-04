import { useState } from "react";
import "./LogSecurityPage.css";

const tabs = [
  { id: "activity", label: "Activity Log", icon: "bi bi-journal-text" },
  { id: "login", label: "Login History", icon: "bi bi-clock-history" },
  { id: "audit", label: "Audit Log", icon: "bi bi-shield-lock" },
  { id: "backup", label: "Backup Database", icon: "bi bi-hdd-network" },
  { id: "access", label: "Access Control", icon: "bi bi-person-lock" },
];

const activityLogs = [
  { time: "08:42", user: "Admin01", action: "Updated product pricing", status: "Success" },
  { time: "07:15", user: "Admin02", action: "Approved order #1024", status: "Success" },
  { time: "06:44", user: "Admin01", action: "Deleted draft category", status: "Warning" },
];

const loginHistory = [
  { time: "2026-07-04 08:42", user: "Admin01", ip: "203.0.113.10", device: "Chrome - Windows", status: "Success" },
  { time: "2026-07-04 07:18", user: "Admin02", ip: "198.51.100.25", device: "Safari - iPhone", status: "Success" },
  { time: "2026-07-04 06:05", user: "Admin03", ip: "192.0.2.44", device: "Firefox - Linux", status: "Failed" },
];

const auditLogs = [
  { time: "2026-07-04 08:40", user: "Admin01", event: "Changed order status to Shipped", target: "Order #1024" },
  { time: "2026-07-04 07:20", user: "Admin02", event: "Updated product inventory", target: "Product #245" },
  { time: "2026-07-04 06:12", user: "Admin03", event: "Removed user access", target: "User #88" },
];

const accessRoles = [
  { role: "Super Admin", users: 1, permissions: ["All access", "System backup", "User management"] },
  { role: "Admin", users: 4, permissions: ["Orders", "Products", "Reports"] },
  { role: "Manager", users: 7, permissions: ["Orders", "Inventory"] },
  { role: "Viewer", users: 12, permissions: ["Reports only"] },
];

const LogSecurityPage = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [backupState, setBackupState] = useState("Completed 2 hours ago");

  const handleBackup = () => {
    setBackupState("Backup in progress...");
    window.setTimeout(() => setBackupState("Backup completed successfully"), 1200);
  };

  return (
    <div className="log-security-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Security Center</p>
          <h2>Logs & Security</h2>
          <p className="page-subtitle">Monitor activity, track access, and protect the admin workspace.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Activity</span>
          <strong>24 events</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Successful logins</span>
          <strong>128 today</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Audit entries</span>
          <strong>91 records</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Backup status</span>
          <strong>{backupState}</strong>
        </div>
      </div>

      <div className="tab-list" role="tablist" aria-label="Log and security sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "activity" && (
        <div className="content-card">
          <div className="card-title-row">
            <h3>Activity Log</h3>
            <span className="muted">Recent admin actions</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((item, index) => (
                  <tr key={`${item.time}-${index}`}>
                    <td>{item.time}</td>
                    <td>{item.user}</td>
                    <td>{item.action}</td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "login" && (
        <div className="content-card">
          <div className="card-title-row">
            <h3>Login History</h3>
            <span className="muted">Latest sign-in attempts</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>IP</th>
                  <th>Device</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((item, index) => (
                  <tr key={`${item.time}-${index}`}>
                    <td>{item.time}</td>
                    <td>{item.user}</td>
                    <td>{item.ip}</td>
                    <td>{item.device}</td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="content-card">
          <div className="card-title-row">
            <h3>Audit Log</h3>
            <span className="muted">Security changes and critical actions</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((item, index) => (
                  <tr key={`${item.time}-${index}`}>
                    <td>{item.time}</td>
                    <td>{item.user}</td>
                    <td>{item.event}</td>
                    <td>{item.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "backup" && (
        <div className="content-card backup-card">
          <div className="card-title-row">
            <h3>Backup Database</h3>
            <span className="muted">Safeguard critical data</span>
          </div>
          <div className="backup-panel">
            <div>
              <p className="backup-title">Latest backup</p>
              <p className="backup-value">{backupState}</p>
            </div>
            <button type="button" className="backup-btn" onClick={handleBackup}>
              Run Backup Now
            </button>
          </div>
        </div>
      )}

      {activeTab === "access" && (
        <div className="content-card">
          <div className="card-title-row">
            <h3>Access Control</h3>
            <span className="muted">Role-based permissions</span>
          </div>
          <div className="access-grid">
            {accessRoles.map((role) => (
              <div key={role.role} className="access-card">
                <div className="access-header">
                  <h4>{role.role}</h4>
                  <span>{role.users} users</span>
                </div>
                <ul>
                  {role.permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogSecurityPage;
