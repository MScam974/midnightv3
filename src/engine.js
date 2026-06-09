// --- État Global ---
const state = {
    step: 0,
    history: [], // Stocke les résumés des étapes validées
    race: null,
    personnalite: { combativite: 3, creativite: 3, indifference: 3, raison: 3, ideal: 3 },
};

const steps = [
    { id: 'race', title: '1. Choix de la Race' },
    { id: 'personnalite', title: '2. Personnalité (Répartir 15 pts)' },
    { id: 'origine', title: '3. Origine (Langues & Statut)' }
];

// --- Moteur de Rendu ---
async function render() {
    const app = document.getElementById('app');
    app.innerHTML = ""; // Nettoie tout

    // 1. Afficher les étapes validées (Historique)
    state.history.forEach(h => {
        app.innerHTML += `<div class="summary">✅ ${h.title} : <strong>${h.value}</strong></div>`;
    });

    // 2. Afficher l'étape en cours
    const current = steps[state.step];
    app.innerHTML += `<h1>${current.title}</h1><div id="content"></div>`;

    if (current.id === 'race') renderRace();
    if (current.id === 'personnalite') renderPersonnalite();
}

// --- Étape 1 : Race ---
async function renderRace() {
    const races = await fetch('./data/competences/races.json').then(r => r.json());
    const container = document.getElementById('content');
    
    races.forEach(r => {
        const btn = document.createElement('button');
        btn.innerText = r.nom;
        btn.onclick = () => {
            state.race = r.nom;
            state.history.push({ title: "Race", value: r.nom });
            state.step++;
            render();
        };
        container.appendChild(btn);
    });
}

// --- Étape 2 : Personnalité ---
function renderPersonnalite() {
    const container = document.getElementById('content');
    container.innerHTML = `<p>Total points : <span id="total-points">15</span>/15</p>`;
    
    // Création des inputs
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        container.innerHTML += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }

    container.innerHTML += `<button id="btn-lock" disabled>Verrouiller l'étape</button>`;

    // Logique temps réel
    document.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const total = Object.values(state.personnalite).reduce((a, b) => a + b, 0);
            document.getElementById('total-points').innerText = total;
            document.getElementById('btn-lock').disabled = (total !== 15);
        });
    });

    // Bouton Valider
    document.getElementById('btn-lock').onclick = () => {
        state.history.push({ title: "Personnalité", value: "Validée (15 pts)" });
        state.step++;
        render();
    };
}

// --- Lancement ---
render();