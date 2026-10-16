---
title: "Cluster mempool"
categories: ["Mempool e relay"]
aliases: ["cluster mempool", "TxGraph", "getmempoolcluster"]
see_also: ["package-relay", "rbf", "pinning"]
---

Reestruturação da mempool do Bitcoin Core que agrupa transações relacionadas em clusters e mantém cada cluster ordenado por taxa. Isso torna consistentes as decisões de mineração, despejo (eviction) e substituição (RBF), resolvendo limitações antigas do algoritmo baseado em ancestrais e descendentes. Chegou no Bitcoin Core v31.
