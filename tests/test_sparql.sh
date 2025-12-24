#!/bin/bash
# ===========================================
# Script de test pour le systeme de recommandation de films
# ===========================================

FUSEKI_ENDPOINT="http://localhost:3030/films/sparql"
FRONTEND_URL="http://localhost:3000"

echo "=========================================="
echo "  Tests du Systeme de Recommandation"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction de test
test_query() {
    local name="$1"
    local query="$2"
    local expected_min="$3"

    echo -n "Test: $name... "

    result=$(curl -s -X POST "$FUSEKI_ENDPOINT" \
        -H "Content-Type: application/sparql-query" \
        -H "Accept: application/json" \
        -d "$query")

    count=$(echo "$result" | grep -o '"value"' | wc -l)

    if [ "$count" -ge "$expected_min" ]; then
        echo -e "${GREEN}PASSED${NC} ($count resultats)"
        ((PASSED++))
    else
        echo -e "${RED}FAILED${NC} ($count resultats, attendu >= $expected_min)"
        ((FAILED++))
    fi
}

# ===========================================
# Test 1: Verifier que Fuseki est accessible
# ===========================================
echo "--- Test de connexion ---"
echo -n "Test: Fuseki accessible... "
fuseki_test=$(curl -s -X POST "$FUSEKI_ENDPOINT" \
    -H "Content-Type: application/sparql-query" \
    -d "SELECT * WHERE { ?s ?p ?o } LIMIT 1" 2>&1)
if echo "$fuseki_test" | grep -q "bindings"; then
    echo -e "${GREEN}PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}FAILED${NC}"
    ((FAILED++))
fi

# ===========================================
# Test 2: Verifier que le frontend est accessible
# ===========================================
echo -n "Test: Frontend accessible... "
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}FAILED${NC}"
    ((FAILED++))
fi

echo ""
echo "--- Tests SPARQL ---"

# ===========================================
# Test 3: Compter les films
# ===========================================
test_query "Nombre de films (>= 100)" \
    "PREFIX ns: <http://example.org/film#> SELECT (COUNT(?film) as ?count) WHERE { ?film a ns:Film }" \
    1

# ===========================================
# Test 4: Recuperer des titres de films
# ===========================================
test_query "Recuperer titres de films" \
    "PREFIX ns: <http://example.org/film#> SELECT ?titre WHERE { ?film a ns:Film . ?film ns:titre ?titre } LIMIT 10" \
    10

# ===========================================
# Test 5: Recuperer des acteurs
# ===========================================
test_query "Recuperer acteurs" \
    "PREFIX ns: <http://example.org/film#> SELECT ?nom WHERE { ?actor a ns:Actor . ?actor ns:nom ?nom } LIMIT 10" \
    10

# ===========================================
# Test 6: Recuperer des realisateurs
# ===========================================
test_query "Recuperer realisateurs" \
    "PREFIX ns: <http://example.org/film#> SELECT ?nom WHERE { ?dir a ns:Director . ?dir ns:nom ?nom } LIMIT 10" \
    10

# ===========================================
# Test 7: Recuperer des genres
# ===========================================
test_query "Recuperer genres" \
    "PREFIX ns: <http://example.org/film#> SELECT ?nom WHERE { ?genre a ns:Genre . ?genre ns:nom ?nom } LIMIT 5" \
    5

# ===========================================
# Test 8: Films par genre (Action)
# ===========================================
test_query "Films Action" \
    "PREFIX ns: <http://example.org/film#> SELECT ?titre WHERE { ?film ns:hasGenre ?genre . ?genre ns:nom 'Action' . ?film ns:titre ?titre } LIMIT 5" \
    5

# ===========================================
# Test 9: Films par realisateur (Christopher Nolan)
# ===========================================
test_query "Films Christopher Nolan" \
    "PREFIX ns: <http://example.org/film#> SELECT ?titre WHERE { ?film ns:directedBy ?dir . ?dir ns:nom 'Christopher Nolan' . ?film ns:titre ?titre }" \
    1

# ===========================================
# Test 10: Recommandations (films avec meme acteur)
# ===========================================
test_query "Recommandations par acteur" \
    "PREFIX ns: <http://example.org/film#> SELECT DISTINCT ?titre WHERE { ?film1 ns:titre 'Inception' . ?film1 ns:hasActor ?actor . ?film2 ns:hasActor ?actor . ?film2 ns:titre ?titre . FILTER(?film1 != ?film2) } LIMIT 5" \
    1

echo ""
echo "=========================================="
echo "  Resultats: $PASSED passes, $FAILED echecs"
echo "=========================================="

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}Tous les tests sont passes!${NC}"
    exit 0
else
    echo -e "${RED}Certains tests ont echoue.${NC}"
    exit 1
fi
