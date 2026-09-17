import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [riskResult, setRiskResult] = useState(null);

  const [form, setForm] = useState({
    txn_id: "",
    account_id: "",
    counterparty_account_id: "",
    source_type: "TRANSFER",
    tx_count: "1",
    amount: "",
    start_time: "",
    end_time: "",
  });

  const token = localStorage.getItem("token");

  // Load transactions
  const loadTransactions = () => {
    fetch("https://muleguard-backend-jaw7.onrender.com/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load transactions");
        }

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
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add transaction + risk analysis
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setRiskResult(null);
    setSubmitting(true);

    try {
      // Create transaction
      const response = await fetch(
        "https://muleguard-backend-jaw7.onrender.com/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            txn_id: Number(form.txn_id),
            account_id: Number(form.account_id),
            counterparty_account_id: Number(
              form.counterparty_account_id
            ),
            source_type: form.source_type,
            tx_count: Number(form.tx_count),
            amount: Number(form.amount),
            start_time: Number(form.start_time),
            end_time: Number(form.end_time),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to create transaction"
        );
      }

      const newTransaction = data;

      setMessage("Transaction added. Running risk analysis...");

      // Run risk assessment
      const riskResponse = await fetch(
        `https://muleguard-backend-jaw7.onrender.com/api/risk/${newTransaction.txn_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const riskData = await riskResponse.json();

      if (!riskResponse.ok) {
        throw new Error(
          riskData.details ||
            riskData.error ||
            "Risk assessment failed"
        );
      }

      // Save risk result
      setRiskResult(riskData);

      setMessage("Transaction analyzed successfully.");

      // Clear form
      setForm({
        txn_id: "",
        account_id: "",
        counterparty_account_id: "",
        source_type: "TRANSFER",
        tx_count: "1",
        amount: "",
        start_time: "",
        end_time: "",
      });

      // Refresh transaction table
      loadTransactions();

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div>

      {/* ================= ADD TRANSACTION ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>
            <h3>Add Transaction</h3>

            <p>
              Create a new transaction for MuleGuard analysis
            </p>
          </div>

        </div>

        <form
          className="transaction-form"
          onSubmit={handleSubmit}
        >

          {/* Transaction ID */}
          <div className="form-group">

            <label>Transaction ID</label>

            <input
              name="txn_id"
              type="number"
              placeholder="Example: 100"
              value={form.txn_id}
              onChange={handleChange}
              required
            />

          </div>


          {/* Account ID */}
          <div className="form-group">

            <label>Account ID</label>

            <input
              name="account_id"
              type="number"
              placeholder="Example: 25"
              value={form.account_id}
              onChange={handleChange}
              required
            />

          </div>


          {/* Counterparty */}
          <div className="form-group">

            <label>Counterparty Account</label>

            <input
              name="counterparty_account_id"
              type="number"
              placeholder="Example: 26"
              value={form.counterparty_account_id}
              onChange={handleChange}
              required
            />

          </div>


          {/* Source Type */}
          <div className="form-group">

            <label>Transaction Type</label>

            <select
              name="source_type"
              value={form.source_type}
              onChange={handleChange}
            >

              <option value="TRANSFER">
                Transfer
              </option>

              <option value="CASH">
                Cash
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="ONLINE">
                Online
              </option>

            </select>

          </div>


          {/* Transaction Count */}
          <div className="form-group">

            <label>Transaction Count</label>

            <input
              name="tx_count"
              type="number"
              min="1"
              placeholder="1"
              value={form.tx_count}
              onChange={handleChange}
              required
            />

          </div>


          {/* Amount */}
          <div className="form-group">

            <label>Amount (₹)</label>

            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="Example: 5000"
              value={form.amount}
              onChange={handleChange}
              required
            />

          </div>


          {/* Start Time */}
          <div className="form-group">

            <label>Start Time</label>

            <input
              name="start_time"
              type="number"
              placeholder="Example: 100"
              value={form.start_time}
              onChange={handleChange}
              required
            />

          </div>


          {/* End Time */}
          <div className="form-group">

            <label>End Time</label>

            <input
              name="end_time"
              type="number"
              placeholder="Example: 200"
              value={form.end_time}
              onChange={handleChange}
              required
            />

          </div>


          {/* Submit */}
          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
            >

              {submitting
                ? "Analyzing..."
                : "Add & Analyze Transaction"}

            </button>

          </div>

        </form>


        {/* Message */}

        {message && (
          <div className="form-message">
            {message}
          </div>
        )}

      </div>


      {/* ================= RISK RESULT ================= */}

      {riskResult && (

        <div className="panel risk-result-panel">

          <div className="panel-header">

            <div>
              <h3>Transaction Risk Assessment</h3>

              <p>
                Automated ML and AML analysis result
              </p>
            </div>

            <span
              className={`risk-badge ${riskResult.risk_level.toLowerCase()}`}
            >
              {riskResult.risk_level}
            </span>

          </div>


          <div className="risk-result-grid">

            <div>
              <span>Final Risk Score</span>

              <strong>
                {riskResult.final_risk_score}
              </strong>
            </div>


            <div>
              <span>ML Score</span>

              <strong>
                {riskResult.ml_score}
              </strong>
            </div>


            <div>
              <span>Network Score</span>

              <strong>
                {riskResult.network_score}
              </strong>
            </div>


            <div>
              <span>Rule Score</span>

              <strong>
                {riskResult.rule_score}
              </strong>
            </div>


            <div>
              <span>Decision</span>

              <strong>
                {riskResult.decision}
              </strong>
            </div>

          </div>


          {/* Risk Reasons */}

          <div className="risk-reasons">

            <h4>Risk Indicators</h4>

            {riskResult.reasons &&
            riskResult.reasons.length > 0 ? (

              <ul>

                {riskResult.reasons.map(
                  (reason, index) => (

                    <li key={index}>
                      {reason}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>
                No risk indicators detected.
              </p>

            )}

          </div>

        </div>

      )}


      {/* ================= TRANSACTION TABLE ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>

            <h3>Transaction Monitoring</h3>

            <p>
              Live transactions from PostgreSQL
            </p>

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

              {transactions.length === 0 ? (

                <tr>

                  <td colSpan="6">
                    No transactions available
                  </td>

                </tr>

              ) : (

                transactions.map((tx) => (

                  <tr key={tx.txn_id}>

                    <td>
                      {tx.txn_id}
                    </td>

                    <td>
                      {tx.account_id}
                    </td>

                    <td>
                      {tx.counterparty_account_id}
                    </td>

                    <td>
                      {tx.source_type}
                    </td>

                    <td>
                      ₹{Number(tx.amount).toFixed(2)}
                    </td>

                    <td>
                      {tx.start_time}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Transactions;