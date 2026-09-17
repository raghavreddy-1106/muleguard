import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/transactions", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transactions");
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Transactions error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Transaction Monitoring</h3>
          <p>Live transactions from PostgreSQL</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>Account</th>
              <th>Counterparty</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.txn_id}>
                <td>{tx.txn_id}</td>
                <td>{tx.account_id}</td>
                <td>{tx.counterparty_account_id}</td>
                <td>{tx.source_type}</td>
                <td>₹{Number(tx.amount).toFixed(2)}</td>
                <td>{tx.start_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;