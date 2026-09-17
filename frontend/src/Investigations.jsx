import { useEffect, useState } from "react";

function Investigations() {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvestigations = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5001/api/investigations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load investigations");
        return res.json();
      })
      .then((data) => {
        setInvestigations(data);
      })
      .catch((error) => {
        console.error("Investigation error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInvestigations();
  }, []);

  const updateStatus = (id, status) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5001/api/investigations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update investigation");
        return res.json();
      })
      .then(() => {
        loadInvestigations();
      })
      .catch((error) => {
        console.error("Update error:", error);
      });
  };

  if (loading) {
    return <div className="panel">Loading investigations...</div>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>AML Investigations</h3>
          <p>Review and manage suspicious activity cases</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alert</th>
              <th>Account</th>
              <th>Analyst</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {investigations.length === 0 ? (
              <tr>
                <td colSpan="7">No investigations found.</td>
              </tr>
            ) : (
              investigations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>ALT-{item.alert_key}</td>
                  <td>ACC-{item.account_id}</td>
                  <td>{item.analyst_name || item.analyst_id}</td>
                  <td>
                    <span className="status">{item.status}</span>
                  </td>
                  <td>{item.notes || "-"}</td>
                  <td>
                    {item.status === "OPEN" && (
                      <button
                        className="secondary-btn"
                        onClick={() =>
                          updateStatus(item.id, "IN_REVIEW")
                        }
                      >
                        Start Review
                      </button>
                    )}

                    {item.status === "IN_REVIEW" && (
                      <button
                        className="secondary-btn"
                        onClick={() =>
                          updateStatus(item.id, "CONFIRMED")
                        }
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Investigations;