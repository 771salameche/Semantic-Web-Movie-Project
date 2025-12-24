# Tests

Scripts de tests automatises pour valider le systeme.

## Fichiers

| Fichier         | Description                          |
|-----------------|--------------------------------------|
| test_sparql.sh  | Tests des endpoints SPARQL et frontend |

## Execution

```bash
cd tests
bash test_sparql.sh
```

## Tests inclus

| #  | Test                        | Description                              |
|----|-----------------------------|------------------------------------------|
| 1  | Fuseki accessible           | Verifie la connexion au serveur SPARQL   |
| 2  | Frontend accessible         | Verifie que React tourne sur port 3000   |
| 3  | Nombre de films             | Verifie qu'il y a des films charges      |
| 4  | Recuperer titres            | Teste la requete des titres              |
| 5  | Recuperer acteurs           | Teste la requete des acteurs             |
| 6  | Recuperer realisateurs      | Teste la requete des realisateurs        |
| 7  | Recuperer genres            | Teste la requete des genres              |
| 8  | Films par genre             | Filtre les films Action                  |
| 9  | Films par realisateur       | Films de Christopher Nolan               |
| 10 | Recommandations par acteur  | Recommandations basees sur Inception     |

## Resultat attendu

```
==========================================
  Resultats: 10 passes, 0 echecs
==========================================
Tous les tests sont passes!
```

## Prerequis

- Apache Jena Fuseki en cours d'execution (port 3030)
- Frontend React en cours d'execution (port 3000)
- Git Bash (Windows) ou terminal Unix
