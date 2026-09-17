import pandas as pd
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="muleguard",
    user="muleguard_user",
    password="muleguard123"
)

accounts = pd.read_csv("data/raw/accounts.csv")
tx = pd.read_csv("data/raw/tx.csv")
cash_tx = pd.read_csv("data/raw/cash_tx.csv")
alerts = pd.read_csv("data/raw/alerts.csv")

cur = conn.cursor()

for _, r in accounts.iterrows():
    cur.execute("""
        INSERT INTO accounts
        (account_id, customer_id, initial_balance, start_date, end_date,
         country, business_type, suspicious, is_fraud, model_id)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (account_id) DO NOTHING
    """, tuple(r))

for _, r in tx.iterrows():
    cur.execute("""
        INSERT INTO transactions
        (txn_id, account_id, counterparty_account_id, source_type,
         tx_count, amount, start_time, end_time)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (txn_id) DO NOTHING
    """, tuple(r))

for _, r in cash_tx.iterrows():
    cur.execute("""
        INSERT INTO cash_transactions
        (txn_id, account_id, branch_id, source_type,
         tx_count, amount, run_date, end_time)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (txn_id) DO NOTHING
    """, tuple(r))

for _, r in alerts.iterrows():
    cur.execute("""
        INSERT INTO alerts
        (alert_key, alert_text, account_id, customer_id, event_date,
         check_name, organization_type, escalated_to_case_investigation)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (alert_key) DO NOTHING
    """, tuple(r))

conn.commit()
cur.close()
conn.close()

print("AMLSim data imported successfully.")