---
title: "Package relay"
categories: ["Mempool e relay", "Rede P2P"]
aliases: ["package relay", "submitpackage", "1p1c", "CPFP"]
see_also: ["truc", "pinning", "cluster-mempool"]
---

Package relay permite que nós avaliem e repassem um grupo de transações relacionadas em conjunto, para que um filho com taxa alta possa pagar (CPFP) por um pai com taxa abaixo do mínimo da mempool.

É essencial para protocolos como a Lightning, que assinam transações com antecedência sem saber qual será a taxa necessária. O Bitcoin Core 28 introduziu o relay oportunista de pacotes de um pai e um filho (1p1c).
