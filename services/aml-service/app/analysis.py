import networkx as nx


def analyze_network(transactions):
    graph = nx.DiGraph()

    for tx in transactions:
        source = str(tx["account_id"])
        target = str(tx["counterparty_account_id"])
        amount = float(tx["amount"])

        graph.add_edge(source, target, amount=amount)

    suspicious_accounts = []

    for node in graph.nodes:
        incoming = graph.in_degree(node)
        outgoing = graph.out_degree(node)
        total_activity = incoming + outgoing

        reasons = []

        if incoming >= 3:
            reasons.append("High fan-in")

        if outgoing >= 3:
            reasons.append("High fan-out")

        if total_activity >= 5:
            reasons.append("High transaction activity")

        if reasons:
            suspicious_accounts.append({
                "account_id": node,
                "incoming_connections": incoming,
                "outgoing_connections": outgoing,
                "activity": total_activity,
                "reasons": reasons
            })

    cycles = list(nx.simple_cycles(graph))

    return {
        "nodes": graph.number_of_nodes(),
        "edges": graph.number_of_edges(),
        "suspicious_accounts": suspicious_accounts,
        "cycles": cycles
    }