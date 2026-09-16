# MuleGuard — Database Schema

## 1. users

Stores application users.

- id
- name
- email
- password_hash
- role
- created_at

Roles:
- ANALYST
- ADMIN

---

## 2. accounts

Stores banking account information from AMLSim.

- account_id
- customer_id
- initial_balance
- start_date
- end_date
- country
- business_type
- suspicious
- is_fraud
- model_id

Primary Key:
- account_id

---

## 3. transactions

Stores transactions from tx.csv.

- txn_id
- account_id
- counterparty_account_id
- source_type
- tx_count
- amount
- start_time
- end_time

Primary Key:
- txn_id

Relationships:
- account_id → accounts.account_id
- counterparty_account_id → accounts.account_id

---

## 4. cash_transactions

Stores cash transactions from cash_tx.csv.

- txn_id
- account_id
- branch_id
- source_type
- tx_count
- amount
- run_date
- end_time

Primary Key:
- txn_id

Relationship:
- account_id → accounts.account_id

---

## 5. alerts

Stores AML alerts.

- alert_key
- alert_text
- account_id
- customer_id
- event_date
- check_name
- organization_type
- escalated_to_case_investigation

Primary Key:
- alert_key

Relationship:
- account_id → accounts.account_id

---

## 6. risk_assessments

Stores the combined risk calculation.

- id
- txn_id
- account_id
- ml_score
- rule_score
- network_score
- final_risk_score
- risk_level
- decision
- reasons
- created_at

---

## 7. investigations

Stores analyst investigations.

- id
- alert_key
- account_id
- analyst_id
- status
- notes
- created_at
- updated_at

Possible statuses:
- OPEN
- IN_REVIEW
- CONFIRMED
- FALSE_POSITIVE
- CLOSED

---

## 8. audit_logs

Stores important system actions.

- id
- user_id
- action
- resource_type
- resource_id
- details
- created_at

---

## Main Relationships

users
  ↓
investigations
  ↓
alerts
  ↓
accounts
  ↓
transactions
  ↓
counterparty accounts

accounts
  ↓
cash_transactions

transactions/accounts
  ↓
risk_assessments