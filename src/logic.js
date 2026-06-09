export function getStatsAvecBonus(basePersonnalite, race, statut) {
    let stats = { ...basePersonnalite };
    // Bonus Race (ex: Dorns : Combativité +1 OU Idéal +1)
    if (race && race.bonus_caractere) {
        // Pour cet exemple simple, on applique le bonus directement
        stats[race.bonus_caractere] += 1;
    }
    // Bonus Statut (ex: 5d donne +1)
    if (statut && statut.bonus_caractere > 0) {
        // Ici, il faudra plus tard permettre au joueur de choisir l'aspect
        stats.ideal += 1; // Exemple : on augmente idéal par défaut
    }
    return stats;
}