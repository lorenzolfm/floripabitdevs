---
title: "Taproot"
categories: ["Consenso e soft forks", "Script e covenants"]
aliases: ["Taproot", "P2TR", "tapscript", "BIP 341", "BIP 342", "NUMS", "internal key"]
see_also: ["schnorr", "annex", "musig2", "simple-taproot-channels"]
---

Soft fork ativado em novembro de 2021 (BIPs 340, 341 e 342) que introduziu as assinaturas Schnorr, um novo tipo de saída (P2TR) e o tapscript.

Uma saída Taproot pode ser gasta por uma única chave — que pode agregar várias partes — ou revelando um de vários scripts alternativos organizados numa árvore de Merkle. Como os scripts não usados nunca aparecem on-chain, Taproot melhora a privacidade e reduz custos.
