---
title: "Consensus Cleanup (BIP54)"
categories: ["Consenso e soft forks"]
aliases: ["Consensus Cleanup", "BIP 54", "timewarp", "time warp"]
see_also: ["soft-forks", "propagation"]
---

Proposta de soft fork, originalmente de Matt Corallo (2019) e retomada por Antoine Poinsot como BIP54, que corrige vulnerabilidades antigas do consenso:

* o ataque de timewarp, que permitiria a mineradores reduzir artificialmente a dificuldade;
* blocos construídos para levar muito tempo para validar;
* transações de 64 bytes, que podem confundir provas de Merkle de clientes leves;
* a possibilidade de transações coinbase com txids duplicados.
