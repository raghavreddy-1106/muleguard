import { useEffect, useState } from "react";

function RiskView({ txnId }) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!txnId) return;

    fetch(`http://localhost:5001/api/risk/${txnId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load risk assessment");
        return res.json();
      })
      .then((data) => {
        setRisk(data);
      })
      .catch((error) => {
        console.error("Risk error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [txnId]);

  if (!txnId) {
    return <div className="panel">Select a transaction to view risk.</div>;
  }

  if (loading) {
    return <div className="panel">Loading risk assessment...</div>;
  }

  if (!risk) {
    return <div className="panel">Risk assessment unavailable.</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Risk Assessment</h3>
          <p>Transaction #{risk.transaction_id}</p>
        </div>

        <span className={`risk-badge ${risk.risk_level.toLowerCase()}`}>
          {risk.risk_level}
        </span>
      </div>

      <div className="network-stats">
        <div>
          <strong>{Math.round(risk.ml_score * 100)}%</strong>
          <span>ML Score</span>
        </div>

        <div>
          <strong>{Math.round(risk.rule_score * 100)}%</strong>
          <span>Rule Score</span>
        </div>

        <div>
          <strong>{Math.round(risk.network_score * 100)}%</strong>
          <span>Network Score</span>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Final Risk Score</strong>
        <h2>{Math.round(risk.final_risk_score * 100)}%</h2>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Reasons</strong>

        {risk.reasons.length === 0 ? (
          <p>No suspicious indicators detected.</p>
        ) : (
          <ul>
            {risk.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RiskView;