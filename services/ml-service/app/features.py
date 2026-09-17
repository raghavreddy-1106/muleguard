import pandas as pd

accounts = pd.read_csv("../../data/raw/accounts.csv")
tx = pd.read_csv("../../data/raw/tx.csv")

features = tx.groupby("ACCOUNT_ID").agg(
    transaction_count=("TXN_ID", "count"),
    total_amount=("TXN_AMOUNT_ORIG", "sum"),
    avg_amount=("TXN_AMOUNT_ORIG", "mean"),
    max_amount=("TXN_AMOUNT_ORIG", "max"),
    unique_counterparties=("COUNTER_PARTY_ACCOUNT_NUM", "nunique")
).reset_index()

features = accounts[
    ["ACCOUNT_ID", "country", "business", "isFraud"]
].merge(
    features,
    on="ACCOUNT_ID",
    how="left"
)

features = features.fillna(0)

print(features)
print("\nShape:", features.shape)

features.to_csv("../../data/processed/ml_features.csv", index=False)
print("\nSaved: data/processed/ml_features.csv")