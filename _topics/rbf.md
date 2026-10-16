---
title: "Replace-by-fee (RBF)"
categories: ["Mempool e relay"]
aliases: ["RBF", "replace by fee", "BIP 125", "full RBF", "mempoolfullrbf"]
see_also: ["pinning", "cluster-mempool", "truc"]
---

Replace-by-fee permite substituir uma transação não confirmada por outra versão que paga mais taxa. O BIP125 definiu uma sinalização opcional para isso, mas desde a versão 28 o Bitcoin Core aceita substituir qualquer transação (full RBF) por padrão, o que tornou a sinalização obsoleta.
