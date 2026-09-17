import { useEffect, useState } from "react";
import "./App.css";

import Transactions from "./Transactions";
import Investigations from "./Investigations";
import Login from "./Login";
import Networks from "./Networks";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Current sidebar view
  const [currentView, setCurrentView] = useState("dashboard");

  const [stats, setStats] = useState([
    { title: "Total Transactions", value: "0" },
    { title: "AML Alerts", value: "0" },
    { title: "High Risk Accounts", value: "0" },
    { title: "Open Investigations", value: "0" },
  ]);

  const [alerts, setAlerts] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Load dashboard statistics
  useEffect(() => {
    if (!user) return;

    fetch("https://muleguard-backend-jaw7.onrender.com/api/dashboard/summary", {
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
  }, [user]);

  // Load AML alerts
  useEffect(() => {
    if (!user) return;

    fetch("https://muleguard-backend-jaw7.onrender.com/api/alerts", {
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
  }, [user]);

  // Load suspicious accounts
  useEffect(() => {
    if (!user) return;

    fetch("https://muleguard-backend-jaw7.onrender.com/api/networks/analysis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load accounts");
        return res.json();
      })
      .then((data) => {
        setAccounts(data.suspicious_accounts || []);
      })
      .catch((error) => {
        console.error("Accounts error:", error);
      });
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">M</div>

          <div>
            <h2>MuleGuard</h2>
            <span>AML Intelligence</span>
          </div>
        </div>

        <nav>

          <a
            className={currentView === "dashboard" ? "active" : ""}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </a>

          <a
            className={currentView === "transactions" ? "active" : ""}
            onClick={() => setCurrentView("transactions")}
          >
            Transactions
          </a>

          <a
            className={currentView === "alerts" ? "active" : ""}
            onClick={() => setCurrentView("alerts")}
          >
            Alerts
          </a>

          <a
            className={currentView === "investigations" ? "active" : ""}
            onClick={() => setCurrentView("investigations")}
          >
            Investigations
          </a>

          <a
            className={currentView === "accounts" ? "active" : ""}
            onClick={() => setCurrentView("accounts")}
          >
            Accounts
          </a>

          <a
            className={currentView === "networks" ? "active" : ""}
            onClick={() => setCurrentView("networks")}
          >
            Networks
          </a>

        </nav>

        <div className="sidebar-bottom">
          <a>Settings</a>

          <a onClick={handleLogout}>
            Logout
          </a>
        </div>

      </aside>


      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <div>
            <h1>
              {currentView === "dashboard" && "AML Dashboard"}
              {currentView === "transactions" && "Transactions"}
              {currentView === "alerts" && "AML Alerts"}
              {currentView === "investigations" && "Investigations"}
              {currentView === "accounts" && "Suspicious Accounts"}
              {currentView === "networks" && "Suspicious Networks"}
            </h1>

            <p>
              Money mule detection and transaction monitoring
            </p>
          </div>

          <div className="profile">

            <div className="avatar">AR</div>

            <div>
              <strong>{user.name || "AML Analyst"}</strong>
              <span>{user.role || "Compliance Team"}</span>
            </div>

          </div>

        </header>


        {/* ================= DASHBOARD ================= */}

        {currentView === "dashboard" && (
          <>

            {/* KPI CARDS */}
            <section className="stats-grid">

              {stats.map((stat) => (
                <div
                  className="stat-card"
                  key={stat.title}
                >
                  <span>{stat.title}</span>

                  <h2>{stat.value}</h2>

                  <small>
                    Live database value
                  </small>
                </div>
              ))}

            </section>


            {/* RISK + NETWORK */}
            <section className="dashboard-grid">

              {/* RISK */}
              <div className="panel risk-panel">

                <div className="panel-header">

                  <div>
                    <h3>Risk Overview</h3>

                    <p>
                      Current transaction risk distribution
                    </p>
                  </div>

                  <span className="period">
                    Last 30 days
                  </span>

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


              {/* NETWORK */}
              <div className="panel network-panel">

                <div className="panel-header">

                  <div>
                    <h3>Suspicious Networks</h3>

                    <p>
                      Detected account relationships
                    </p>
                  </div>

                </div>


                <div className="network-stats">

                  <div>
                    <strong>{accounts.length}</strong>
                    <span>Risky Accounts</span>
                  </div>

                  <div>
                    <strong>4</strong>
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

                  <p>
                    Transactions and accounts requiring attention
                  </p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() => setCurrentView("alerts")}
                >
                  View All
                </button>

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

                        const risk =
                          alert.is_fraud
                            ? "High"
                            : "Medium";

                        return (

                          <tr key={alert.alert_key}>

                            <td>
                              ALT-{alert.alert_key}
                            </td>

                            <td>
                              ACC-
                              {String(alert.account_id).padStart(4, "0")}
                            </td>

                            <td>
                              {alert.check_name}
                            </td>

                            <td>

                              <span
                                className={`risk-badge ${risk.toLowerCase()}`}
                              >
                                {risk}
                              </span>

                            </td>

                            <td>
                              {alert.is_fraud
                                ? "High"
                                : "Review"}
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

          </>
        )}


        {/* ================= TRANSACTIONS ================= */}

        {currentView === "transactions" && (
          <Transactions />
        )}


        {/* ================= INVESTIGATIONS ================= */}

        {currentView === "investigations" && (
          <Investigations />
        )}


        {/* ================= NETWORKS ================= */}

        {currentView === "networks" && (
          <Networks />
        )}


        {/* ================= ALERTS ================= */}

        {currentView === "alerts" && (

          <section className="panel">

            <div className="panel-header">

              <div>
                <h3>AML Alerts</h3>

                <p>
                  All suspicious activity alerts
                </p>
              </div>

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

                      const risk =
                        alert.is_fraud
                          ? "High"
                          : "Medium";

                      return (

                        <tr key={alert.alert_key}>

                          <td>
                            ALT-{alert.alert_key}
                          </td>

                          <td>
                            ACC-
                            {String(alert.account_id).padStart(4, "0")}
                          </td>

                          <td>
                            {alert.check_name}
                          </td>

                          <td>

                            <span
                              className={`risk-badge ${risk.toLowerCase()}`}
                            >
                              {risk}
                            </span>

                          </td>

                          <td>
                            {alert.is_fraud
                              ? "High"
                              : "Review"}
                          </td>

                          <td>
                            {alert.escalated_to_case_investigation}
                          </td>

                        </tr>

                      );

                    })

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* ================= ACCOUNTS ================= */}

        {currentView === "accounts" && (

          <section className="panel">

            <div className="panel-header">

              <div>
                <h3>Suspicious Accounts</h3>

                <p>
                  Accounts identified by AML network analysis
                </p>
              </div>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Account</th>
                    <th>Incoming</th>
                    <th>Outgoing</th>
                    <th>Activity</th>
                    <th>Risk Indicators</th>
                  </tr>

                </thead>


                <tbody>

                  {accounts.length === 0 ? (

                    <tr>
                      <td colSpan="5">
                        No suspicious accounts found
                      </td>
                    </tr>

                  ) : (

                    accounts.map((account) => (

                      <tr key={account.account_id}>

                        <td>
                          <strong>
                            ACC-
                            {String(account.account_id).padStart(4, "0")}
                          </strong>
                        </td>

                        <td>
                          {account.incoming}
                        </td>

                        <td>
                          {account.outgoing}
                        </td>

                        <td>
                          {account.activity}
                        </td>

                        <td>

                          {account.reasons?.map(
                            (reason, index) => (

                              <span
                                key={index}
                                className="risk-badge high"
                                style={{
                                  marginRight: "6px",
                                  marginBottom: "4px",
                                  display: "inline-block",
                                }}
                              >
                                {reason}
                              </span>

                            )
                          )}

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;