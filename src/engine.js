// --- État Global ---
const state = {
    step: 0,
    history: [], // Stocke les choix validés : { title, value }
    race: null,
    personnalite: { combativite: 3, creativite: 3, indifference: 3, raison: 3, ideal: 3 },
    traits: {} // Stockera { aspect: { type: "majeur", choix: "courageux" } }
};

const steps = [
    { id: 'race', title: '1. Choix de la Race' },
    { id: 'personnalite', title: '2. Personnalité (Répartir 15 pts)' },
    { id: 'traits', title: '3. Vertus et Vices' }
];

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = ""; 

    // 1. Historique en haut
    state.history.forEach(h => {
        app.innerHTML += `<div class="summary">✅ ${h.title} : <strong>${h.value}</strong></div>`;
    });

    // 2. Étape en cours
    const current = steps[state.step];
    app.innerHTML += `<h1>${current.title}</h1><div id="content"></div>`;

    if (current.id === 'race') renderRace();
    if (current.id === 'personnalite') renderPersonnalite();
    if (current.id === 'traits') renderTraits();
}

async function renderRace() {
    const races = await fetch('./data/competences/races.json').then(r => r.json());
    const container = document.getElementById('content');
    races.forEach(r => {
        const btn = document.createElement('button');
        btn.innerText = r.nom;
        btn.onclick = () => {
            state.race = r; // On stocke l'objet race complet pour avoir les bonus
            state.history.push({ title: "Race", value: r.nom });
            state.step++;
            render();
        };
        container.appendChild(btn);
    });
}

function renderPersonnalite() {
    const container = document.getElementById('content');
    // Appliquer bonus race (exemple simple)
    container.innerHTML = `<p>Note : Votre race applique des bonus automatiques.</p>
                           <p>Total points (avec bonus) : <span id="total-points">15</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        container.innerHTML += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }
    container.innerHTML += `<button id="btn-lock" disabled>Verrouiller</button>`;

    document.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const total = Object.values(state.personnalite).reduce((a, b) => a + b, 0);
            document.getElementById('total-points').innerText = total;
            document.getElementById('btn-lock').disabled = (total !== 15);
        });
    });

    document.getElementById('btn-lock').onclick = () => {
        state.history.push({ title: "Personnalité", value: "Validée" });
        state.step++;
        render();
    };
}

async function renderTraits() {
    const data = await fetch('./data/regles/personnalite.json').then(r => r.json());
    const container = document.getElementById('content');
    
    // Pour chaque aspect, si > 4 ou < 2, proposer le choix
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        if (score >= 4 || score <= 2) {
            const type = (score >= 4) ? "majeur" : "mineur";
            container.innerHTML += `<div><h3>${aspect} (${type})</h3>
                <select class="trait-select" data-aspect="${aspect}">
                    <option value="">Choisir vertu/vice...</option>
                    ${data.aspects[aspect][type].vertus.map(v => `<option value="${v}">Vertu : ${v}</option>`).join('')}
                    ${data.aspects[aspect][type].vices.map(v => `<option value="${v}">Vice : ${v}</option>`).join('')}
                </select></div>`;
        }
    }
    container.innerHTML += `<button onclick="state.step++; render();">Terminer</button>`;
}

render();