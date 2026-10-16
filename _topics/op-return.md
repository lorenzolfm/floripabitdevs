---
title: "OP_RETURN"
categories: ["Mempool e relay"]
aliases: ["OP_RETURN", "datacarrier", "datacarriersize"]
see_also: ["relay-policy", "inscriptions", "bip110"]
---

OP_RETURN marca uma saída como comprovadamente não gastável e é usado para gravar dados na blockchain sem inflar o conjunto UTXO.

Por anos o Bitcoin Core só repassou saídas OP_RETURN com até 80 bytes de dados (opção `-datacarriersize`). A remoção desse limite padrão na versão 30 gerou um dos maiores debates recentes da comunidade.
