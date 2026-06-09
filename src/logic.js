export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

export function getStatsAvecBonus(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };
    
    // Application automatique des modificateurs de la race
    if (race && race.modificateurs) {
        for (const [trait, mod] of Object.entries(race.modificateurs)) {
            if (trait !== "choix_trait") {
                stats[trait] = (stats[trait] || 0) + mod;
            }
        }
    }
    
    // Bonus Statut (Logique : si bonus, on ajoute +1 à l'aspect de son choix)
    if (statut && statut.bonus_caractere > 0) {
        // Pour l'instant, on augmente l'aspect choisi via prompt ou par défaut
        stats.ideal = (stats.ideal || 0) + 1; 
    }
    
    return stats;


    export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

// On ne calcule plus les bonus dans le total de création, 
// les bonus sont des "ajouts" après coup.
export function getStatsFinales(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };
    if (race && race.modificateurs) {
        for (const [trait, mod] of Object.entries(race.modificateurs)) {
            stats[trait] += mod;
        }
    }
    if (statut && statut.bonus_caractere > 0) {
        stats.ideal += 1; // À remplacer par une sélection dynamique plus tard
    }
    return stats;
}
