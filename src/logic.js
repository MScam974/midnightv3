export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

export function getStatsFinales(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };

    if (race && race.modificateurs) {
        for (const [trait, mod] of Object.entries(race.modificateurs)) {
            if (stats.hasOwnProperty(trait)) {
                stats[trait] += mod;
            }
        }
    }

    if (statut && statut.bonus_caractere > 0) {
        if (stats.hasOwnProperty('ideal')) {
            stats.ideal += 1;
        }
    }

    return stats;
}

export function getStatsAvecBonus(basePersonnalite, race, statut) {
    return getStatsFinales(basePersonnalite, race, statut);
}