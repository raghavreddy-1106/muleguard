import { useEffect, useState } from "react";
import "./App.css";
import Transactions from "./Transactions";
import RiskView from "./RiskView";
import Investigations from "./Investigations";
import Login from "./Login";
import Networks from "./Networks";
import RiskHistory from "./RiskHistory";

function App() {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
  });
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
  };
  const [stats, setStats] = useState([
    { title: "Total Transactions", value: "0" },
    { title: "AML Alerts", value: "0" },
    { title: "High Risk Accounts", value: "0" },
    { title: "Open Investigations", value: "0" },
  ]);

  const [alerts, setAlerts] = useState([]);

  // Load dashboard statistics
  useEffect(() => {
    fetch("http://localhost:5001/api/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then((data) => {
        setStats([
          {
            title: "Total Transactions",
            value: data.total_transactions.toLocaleString(),
          },
          {
            title: "AML Alerts",
            value: data.aml_alerts.toLocaleString(),
          },
          {
            title: "High Risk Accounts",
            value: data.high_risk_accounts.toLocaleString(),
          },
          {
            title: "Open Investigations",
            value: data.open_investigations.toLocaleString(),
          },
        ]);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      });
  }, []);

  // Load AML alerts
  useEffect(() => {
    fetch("http://localhost:5001/api/alerts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load alerts");
        return res.json();
      })
      .then((data) => {
        setAlerts(data);
      })
      .catch((error) => {
        console.error("Alerts error:", error);
      });
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>

          <div>
            <h2>MuleGuard</h2>
            <span>AML Intelligence</span>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Transactions</a>
          <a>Alerts</a>
          <a>Investigations</a>
          <a>Accounts</a>
          <a>Networks</a>
        </nav>

        <div className="sidebar-bottom">
          <a>Settings</a>

          <a onClick={handleLogout}>Logout</a>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>AML Dashboard</h1>
            <p>Money mule detection and transaction monitoring</p>
          </div>

          <div className="profile">
            <div className="avatar">AR</div>

            <div>
              <strong>AML Analyst</strong>
              <span>Compliance Team</span>
            </div>
          </div>
        </header>

        {/* KPI CARDS */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.title}>
              <span>{stat.title}</span>
              <h2>{stat.value}</h2>
              <small>Live database value</small>
            </div>
          ))}
        </section>

        {/* RISK + NETWORK */}
        <section className="dashboard-grid">
          <div className="panel risk-panel">
            <div className="panel-header">
              <div>
                <h3>Risk Overview</h3>
                <p>Current transaction risk distribution</p>
              </div>

              <span className="period">Last 30 days</span>
            </div>

            <div className="risk-items">
              <div className="risk-row">
                <div className="risk-label">
                  <span className="dot low"></span>
                  Low Risk
                </div>

                <strong>78%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill low-fill"
                  style={{ width: "78%" }}
                />
              </div>

              <div className="risk-row">
                <div className="risk-label">
                  <span className="dot medium"></span>
                  Medium Risk
                </div>

                <strong>16%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill medium-fill"
                  style={{ width: "16%" }}
                />
              </div>

              <div className="risk-row">
                <div className="risk-label">
                  <span className="dot high"></span>
                  High Risk
                </div>

                <strong>6%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill high-fill"
                  style={{ width: "6%" }}
                />
              </div>
            </div>
          </div>

          <div className="panel network-panel">
            <div className="panel-header">
              <div>
                <h3>Suspicious Networks</h3>
                <p>Detected account relationships</p>
              </div>
            </div>

            <div className="network-stats">
              <div>
                <strong>37</strong>
                <span>Risky Accounts</span>
              </div>

              <div>
                <strong>12</strong>
                <span>Networks</span>
              </div>

              <div>
                <strong>5</strong>
                <span>Cycles</span>
              </div>
            </div>

            <div className="network-preview">
              <div className="node center">25</div>
              <div className="node n1">15</div>
              <div className="node n2">21</div>
              <div className="node n3">24</div>
              <div className="node n4">26</div>
            </div>
          </div>
        </section>

        {/* AML ALERTS */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent AML Alerts</h3>
              <p>Transactions and accounts requiring attention</p>
            </div>

            <button className="secondary-btn">View All</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Account</th>
                  <th>Pattern</th>
                  <th>Risk</th>
                  <th>Decision</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No AML alerts available
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => {
                    const risk = alert.is_fraud ? "High" : "Medium";

                    return (
                      <tr key={alert.alert_key}>
                        <td>ALT-{alert.alert_key}</td>

                        <td>
                          ACC-
                          {String(alert.account_id).padStart(4, "0")}
                        </td>

                        <td>{alert.check_name}</td>

                        <td>
                          <span
                            className={`risk-badge ${risk.toLowerCase()}`}
                          >
                            {risk}
                          </span>
                        </td>

                        <td>
                          {alert.is_fraud ? "High" : "Review"}
                        </td>

                        <td>
                          <span className="status">
                            {alert.escalated_to_case_investigation}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
        <Transactions />
        <Investigations />
        <RiskView txnId={2} />
        <Networks />
        <RiskHistory txnId={2} />
      </main>
    </div>
  );
}

export default App;