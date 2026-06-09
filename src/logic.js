export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

export function getStatsAvecBonus(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };
    
    // Bonus Race
    if (race && race.bonus_caractere) {
        if (stats.hasOwnProperty(race.bonus_caractere)) {
            stats[race.bonus_caractere] += 1;
        }
    }
    
    // Bonus Statut
    if (statut && statut.bonus_caractere > 0) {
        // NOTE: Ici, si le statut donne un bonus, il faudra idéalement 
        // laisser le joueur choisir l'aspect. Pour l'instant on garde votre logique.
        if (stats.hasOwnProperty('ideal')) {
            stats.ideal += 1;
        }
    }
    return stats;
}