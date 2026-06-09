// Moteur de création de personnage
const personnage = {
    race: null,
    personnalite: {}, // { aspect: score }
    competences: {},
    traits: {} // Vertus/Vices
};

async function initCreateur() {
    // 1. Charger tous les JSON (c'est le point d'entrée)
    const [races, personnalite, physique, mentales, sociales, origines] = await Promise.all([
        fetch('./data/competences/races.json').then(r => r.json()),
        fetch('./data/competences/personnalite.json').then(r => r.json()),
        fetch('./data/competences/physiques.json').then(r => r.json()),
        fetch('./data/competences/mentales.json').then(r => r.json()),
        fetch('./data/competences/sociales.json').then(r => r.json()),
        fetch('./data/competences/origines.json').then(r => r.json())
    ]);

    console.log("Données chargées, moteur prêt !");
    // Ici, vous pourriez appeler une fonction qui affiche le sélecteur de Race
}

initCreateur();
