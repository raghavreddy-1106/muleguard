import networkx as nx


def analyze_network(transactions):
    graph = nx.DiGraph()

    for tx in transactions:
        source = str(tx["account_id"])
        target = str(tx["counterparty_account_id"])
        amount = float(tx["amount"])

        graph.add_edge(
            source,
            target,
            amount=amount
        )

    results = []

    for node in graph.nodes:
        incoming = graph.in_degree(node)
        outgoing = graph.out_degree(node)

        reasons = []

        if incoming >= 3:
            reasons.append("High fan-in")

        if outgoing >= 3:
            reasons.append("High fan-out")

        if reasons:
            results.append({
                "account_id": node,
                "incoming_connections": incoming,
                "outgoing_connections": outgoing,
                "reasons": reasons
            })

    cycles = list(nx.simple_cycles(graph))

    return {
        "nodes": graph.number_of_nodes(),
        "edges": graph.number_of_edges(),
        "suspicious_accounts": results,
        "cycles": cycles
    }