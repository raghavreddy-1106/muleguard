CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ANALYST',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY,
    customer_id VARCHAR(100),
    initial_balance NUMERIC(15,2),
    start_date INTEGER,
    end_date INTEGER,
    country VARCHAR(10),
    business_type VARCHAR(20),
    suspicious BOOLEAN DEFAULT FALSE,
    is_fraud BOOLEAN DEFAULT FALSE,
    model_id INTEGER
);

CREATE TABLE transactions (
    txn_id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL,
    counterparty_account_id INTEGER NOT NULL,
    source_type VARCHAR(50),
    tx_count INTEGER,
    amount NUMERIC(15,2),
    start_time INTEGER,
    end_time INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (counterparty_account_id) REFERENCES accounts(account_id)
);

CREATE TABLE cash_transactions (
    txn_id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL,
    branch_id INTEGER,
    source_type VARCHAR(50),
    tx_count INTEGER,
    amount NUMERIC(15,2),
    run_date INTEGER,
    end_time INTEGER,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE alerts (
    alert_key INTEGER PRIMARY KEY,
    alert_text TEXT,
    account_id INTEGER,
    customer_id VARCHAR(100),
    event_date INTEGER,
    check_name VARCHAR(100),
    organization_type VARCHAR(100),
    escalated_to_case_investigation VARCHAR(10),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE risk_assessments (
    id SERIAL PRIMARY KEY,
    txn_id INTEGER,
    account_id INTEGER,
    ml_score NUMERIC(5,4),
    rule_score NUMERIC(5,4),
    network_score NUMERIC(5,4),
    final_risk_score NUMERIC(5,4),
    risk_level VARCHAR(20),
    decision VARCHAR(30),
    reasons TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (txn_id) REFERENCES transactions(txn_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE investigations (
    id SERIAL PRIMARY KEY,
    alert_key INTEGER,
    account_id INTEGER,
    analyst_id INTEGER,
    status VARCHAR(30) DEFAULT 'OPEN',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_key) REFERENCES alerts(alert_key),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (analyst_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_account
ON transactions(account_id);

CREATE INDEX idx_transactions_counterparty
ON transactions(counterparty_account_id);

CREATE INDEX idx_transactions_amount
ON transactions(amount);

CREATE INDEX idx_alerts_account
ON alerts(account_id);

CREATE INDEX idx_risk_account
ON risk_assessments(account_id);