import { useEffect, useState } from "react";

function RiskHistory({ txnId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!txnId) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5001/api/risk/history/${txnId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load risk history");
        }
        return res.json();
      })
      .then((data) => {
        setHistory(data);
      })
      .catch((error) => {
        console.error("Risk history error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [txnId]);

  if (loading) {
    return <div className="panel">Loading risk history...</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Risk Assessment History</h3>
          <p>Previous ML, rule and network assessments</p>
        </div>

        <span className="period">
          Transaction #{txnId}
        </span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ML Score</th>
              <th>Rule Score</th>
              <th>Network Score</th>
              <th>Final Score</th>
              <th>Risk</th>
              <th>Decision</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="7">No risk history found.</td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id}>
                  <td>
                    {new Date(item.created_at).toLocaleString()}
                  </td>

                  <td>
                    {(Number(item.ml_score) * 100).toFixed(1)}%
                  </td>

                  <td>
                    {(Number(item.rule_score) * 100).toFixed(1)}%
                  </td>

                  <td>
                    {(Number(item.network_score) * 100).toFixed(1)}%
                  </td>

                  <td>
                    <strong>
                      {(Number(item.final_risk_score) * 100).toFixed(1)}%
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`risk-badge ${String(
                        item.risk_level
                      ).toLowerCase()}`}
                    >
                      {item.risk_level}
                    </span>
                  </td>

                  <td>{item.decision}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiskHistory;