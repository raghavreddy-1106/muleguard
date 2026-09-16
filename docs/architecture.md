# MuleGuard — System Architecture

## 1. Architecture Style

MuleGuard uses a microservice-oriented architecture.

## 2. Services

### Frontend
Technology:
- React

Responsibility:
- Analyst dashboard
- Transaction views
- Alert management
- Investigation screens

### API Gateway / Main Backend
Technology:
- Node.js
- Express.js

Responsibility:
- Authentication
- User and role management
- Transaction APIs
- Investigation APIs
- Alert APIs
- Communication with other services

### ML Service
Technology:
- Python
- FastAPI
- Scikit-learn

Responsibility:
- Feature preparation
- ML prediction
- Risk probability
- Model inference

### Graph / AML Analysis
Technology:
- Python
- NetworkX

Responsibility:
- Fan-in detection
- Fan-out detection
- Transaction-chain detection
- Cycle detection
- Suspicious account-network analysis

### Database
Technology:
- PostgreSQL

Responsibility:
- Users
- Accounts
- Transactions
- Alerts
- Risk assessments
- Investigations
- Audit logs

## 3. High-Level Flow

React
  ↓
Node.js Backend
  ↓
PostgreSQL
  ↓
AML / Graph Analysis
  ↓
FastAPI ML Service
  ↓
Risk Aggregation
  ↓
Node.js Backend
  ↓
React Dashboard

## 4. Communication

Frontend → Node.js:
REST API

Node.js → PostgreSQL:
SQL / PostgreSQL driver

Node.js → FastAPI:
REST API

Node.js → Graph/AML service:
REST API

## 5. Initial Repository Structure

muleguard/
├── backend/
├── services/
│   ├── ml-service/
│   └── aml-service/
├── frontend/
├── data/
├── infrastructure/
├── docs/
└── README.md

## 6. Separation of Responsibility

Node.js:
Business APIs and orchestration

FastAPI:
Machine learning inference

AML Service:
Rule-based and graph analysis

PostgreSQL:
Persistent data

React:
User interface