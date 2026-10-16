---
title: "OP_CHECKTEMPLATEVERIFY (CTV)"
categories: ["Script e covenants"]
aliases: ["OP_CHECKTEMPLATEVERIFY", "CHECKTEMPLATEVERIFY", "OP_CTV", "CTV", "BIP 119"]
see_also: ["covenants", "op-checksigfromstack", "vaults"]
---

Opcode proposto por Jeremy Rubin no BIP119 que verifica se a transação que gasta uma saída corresponde a um template (um hash) definido previamente.

É uma forma simples e limitada de covenant, útil para vaults, árvores de pagamentos e pools de pagamento. Costuma ser proposto em conjunto com o OP_CHECKSIGFROMSTACK.
