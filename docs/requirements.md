# MuleGuard — Requirements

## 1. Users

### AML Analyst
- View suspicious transactions
- View suspicious accounts
- View transaction networks
- Investigate alerts
- Update investigation status

### Administrator
- Manage users
- View system activity
- View audit logs

## 2. Functional Requirements

### Transaction Management
- Receive transaction data
- Store transactions
- View transaction history
- Search transactions

### AML Detection
- Detect suspicious transaction patterns
- Detect possible money-mule accounts
- Detect fan-in and fan-out patterns
- Detect rapid pass-through transactions
- Detect suspicious transaction cycles

### Risk Assessment
- Generate ML risk score
- Generate rule-based risk score
- Generate network risk indicators
- Produce final risk level
- Explain why an account or transaction was flagged

### Investigation
- Create an investigation
- Assign investigation status
- Add analyst notes
- Record investigation actions

### Authentication
- User login
- JWT authentication
- Role-based authorization

### Audit
- Record important analyst/admin actions
- Store action time and user

## 3. Non-Functional Requirements

- REST APIs
- Secure authentication
- Input validation
- PostgreSQL persistence
- Independent ML service
- Microservice-ready architecture
- Docker-based deployment
- Maintainable code structure
- Git-based collaboration

## 4. Main Workflow

Transaction
→ Store transaction
→ AML rules
→ ML risk prediction
→ Network analysis
→ Risk aggregation
→ Alert generation
→ Analyst investigation
→ Audit logging

## 5. Success Criteria

The system should be able to:

1. Accept a transaction.
2. Analyze its risk.
3. Identify suspicious patterns.
4. Identify related suspicious accounts.
5. Explain the detected risk.
6. Display the result in the analyst dashboard.
7. Allow the analyst to investigate the alert.
8. Record the investigation in the audit log.