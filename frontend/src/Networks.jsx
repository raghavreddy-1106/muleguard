import { useEffect, useMemo, useState } from "react";

function Networks() {
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/networks/analysis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load network");
        return res.json();
      })
      .then((data) => setNetwork(data))
      .catch((error) => console.error("Network error:", error))
      .finally(() => setLoading(false));
  }, []);

  const nodes = useMemo(() => {
    if (!network?.edge_list) return [];

    const ids = new Set();

    network.edge_list.forEach((edge) => {
      ids.add(String(edge.source));
      ids.add(String(edge.target));
    });

    return [...ids];
  }, [network]);

  const positions = useMemo(() => {
    const result = {};
    const radius = 150;
    const centerX = 300;
    const centerY = 220;

    nodes.forEach((id, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;

      result[id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return result;
  }, [nodes]);

  if (loading) {
    return <div className="panel">Loading transaction network...</div>;
  }

  if (!network) {
    return <div className="panel">Network unavailable.</div>;
  }

  const suspiciousIds = new Set(
    network.suspicious_accounts.map((item) => String(item.account_id))
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Money-Mule Network</h3>
          <p>Account relationships detected from transaction data</p>
        </div>

        <span className="period">
          {network.nodes} nodes · {network.edges} edges
        </span>
      </div>

      <div className="network-stats">
        <div>
          <strong>{network.nodes}</strong>
          <span>Accounts</span>
        </div>

        <div>
          <strong>{network.edges}</strong>
          <span>Transactions</span>
        </div>

        <div>
          <strong>{network.suspicious_accounts.length}</strong>
          <span>Suspicious</span>
        </div>
      </div>

      <div className="graph-container">
        <svg viewBox="0 0 600 450" className="network-svg">
          {network.edge_list.map((edge, index) => {
            const source = positions[String(edge.source)];
            const target = positions[String(edge.target)];

            if (!source || !target) return null;

            return (
              <g key={index}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className="network-edge"
                />
              </g>
            );
          })}

          {nodes.map((id) => {
            const position = positions[id];
            const suspicious = suspiciousIds.has(id);

            return (
              <g key={id}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="21"
                  className={
                    suspicious
                      ? "network-node suspicious"
                      : "network-node"
                  }
                />

                <text
                  x={position.x}
                  y={position.y + 4}
                  textAnchor="middle"
                  className="network-node-text"
                >
                  {id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="network-findings">
        <h4>Suspicious Accounts</h4>

        {network.suspicious_accounts.length === 0 ? (
          <p>No suspicious accounts detected.</p>
        ) : (
          network.suspicious_accounts.map((account) => (
            <div className="finding" key={account.account_id}>
              <strong>Account {account.account_id}</strong>

              <span>
                {account.reasons.join(" · ")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Networks;