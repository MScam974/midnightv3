export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}

export function appliquerModifsRaciaux(personnalite, race) {
    if (!race || !race.modificateurs) return personnalite;
    let stats = { ...personnalite };
    for (const [key, value] of Object.entries(race.modificateurs)) {
        if (stats[key] !== undefined) stats[key] += value;
    }
    return stats;
}