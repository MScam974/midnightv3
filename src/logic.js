// Calcul de la somme des points de création (doit valoir 15)
export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

// Calcul des stats réelles incluant les bonus de race et de statut
export function getStatsFinales(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };
    
    // Application des bonus de race
    if (race && race.modificateurs) {
        for (const [trait, mod] of Object.entries(race.modificateurs)) {
            // On vérifie que la propriété existe dans stats avant d'ajouter
            if (stats.hasOwnProperty(trait)) {
                stats[trait] += mod;
            }
        }
    }
    
    // Application du bonus de statut
    if (statut && statut.bonus_caractere > 0) {
        // Pour l'instant, on applique sur "ideal" par défaut
        if (stats.hasOwnProperty('ideal')) {
            stats.ideal += 1;
        }
    }
    
    return stats;
}

// Alias pour la compatibilité avec votre code actuel
export const getStatsAvecBonus = getStatsFinales;