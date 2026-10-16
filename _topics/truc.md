---
title: "TRUC (transações v3)"
categories: ["Mempool e relay"]
aliases: ["TRUC", "v3 transaction", "P2A", "pay to anchor", "ephemeral anchor", "zero fee commitment"]
see_also: ["package-relay", "pinning", "rbf"]
---

Topologically Restricted Until Confirmation (BIP431): transações de versão 3 seguem regras de política mais restritas — no máximo um filho não confirmado e tamanho limitado — que tornam RBF e CPFP mais previsíveis e reduzem ataques de pinning.

Junto com as saídas pay-to-anchor (P2A) e os ephemeral anchors, viabilizam transações de commitment com taxa zero na Lightning.
