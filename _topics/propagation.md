---
title: "Propagação de blocos e transações"
categories: ["Rede P2P"]
aliases: ["propagation", "propagated", "propagação", "compact block", "BIP 152"]
see_also: ["block-templates", "consensus-cleanup"]
---

Como blocos e transações se espalham pela rede P2P. Os blocos compactos (BIP152) evitam reenviar transações que o nó já tem na mempool, reduzindo latência e banda. Atrasos na propagação aumentam a taxa de blocos órfãos e favorecem os maiores mineradores.
