---
title: "SegWit"
categories: ["Consenso e soft forks"]
aliases: ["SegWit", "Segregated Witness", "BIP 141", "P2WSH", "P2WPKH", "bech32"]
see_also: ["taproot", "soft-forks"]
---

Segregated Witness é o soft fork ativado em agosto de 2017 (BIP141) que move as assinaturas (a witness) para fora da parte da transação usada para calcular o txid.

Isso corrigiu a maleabilidade de txid causada por terceiros, o que viabilizou a Lightning Network, e introduziu o peso (weight) de bloco, que dá desconto aos dados de witness. Também trouxe os endereços bech32 (BIP173).
