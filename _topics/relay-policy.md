---
title: "Política de relay"
categories: ["Mempool e relay"]
aliases: ["relay policy", "mempool policy", "Knots", "non-standard", "standardness", "minrelaytxfee", "blockmintxfee", "incrementalrelayfee", "sat/vb", "sat/vbyte", "feerate settings"]
see_also: ["op-return", "inscriptions", "rbf", "cluster-mempool", "bip110"]
---

Além das regras de consenso, cada nó aplica regras de política para decidir quais transações não confirmadas aceita na mempool e repassa aos pares: taxa mínima, tamanho de OP_RETURN, formatos de script aceitos ("standardness") e outras.

Essas regras não invalidam blocos, mas influenciam o que chega aos mineradores. Discordâncias sobre política — filtros contra spam, a taxa mínima de relay — motivaram debates intensos e o crescimento do Bitcoin Knots.
