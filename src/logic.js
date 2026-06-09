export function calculerTotalPoints(personnalite) {
    return Object.values(personnalite).reduce((a, b) => a + b, 0);
}