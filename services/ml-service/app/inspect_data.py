import pandas as pd

accounts = pd.read_csv("../../data/raw/accounts.csv")
tx = pd.read_csv("../../data/raw/tx.csv")
alerts = pd.read_csv("../../data/raw/alerts.csv")

print("\nACCOUNT LABELS")
print(accounts["isFraud"].value_counts())

print("\nSUSPICIOUS ACCOUNTS")
print(accounts["suspicious"].value_counts())

print("\nALERT ACCOUNT IDS")
print(alerts["ACCOUNT_ID"].tolist())

print("\nTRANSACTION COUNTS PER ACCOUNT")
print(tx["ACCOUNT_ID"].value_counts().head(10))

print("\nTRANSACTION AMOUNT SUMMARY")
print(tx["TXN_AMOUNT_ORIG"].describe())