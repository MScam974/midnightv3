/**
 * Calcule la somme des points de création.
 * @param {Object} personnalite 
 * @returns {number}
 */
export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

/**
 * Applique les bonus de race et de statut aux stats de base.
 * @param {Object} basePersonnalite 
 * @param {Object} race 
 * @param {Object} statut 
 * @returns {Object}
 */
export function getStatsFinales(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };

    // Application des bonus de race
    if (race && race.modificateurs) {
        for (const [trait, mod] of Object.entries(race.modificateurs)) {
            // Vérification sécurisée de la propriété
            if (Object.prototype.hasOwnProperty.call(stats, trait)) {
                stats[trait] += mod;
            }
        }
    }

    // Application du bonus de statut
    if (statut && statut.bonus_caractere != null) {
        if (Object.prototype.hasOwnProperty.call(stats, 'ideal')) {
            stats.ideal += 1;
        }
    }

    return stats;
}

/**
 * Alias pour la compatibilité avec le reste du code.
 */
export function getStatsAvecBonus(basePersonnalite, race, statut) {
    return getStatsFinales(basePersonnalite, race, statut);
}