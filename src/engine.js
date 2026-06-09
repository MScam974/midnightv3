// --- État Global ---
const char = {
    step: 0,
    raceId: null,
    personnalite: { combativite: 3, creativite: 3, indifference: 3, raison: 3, ideal: 3 },
    totalPoints: 15
};

const steps = [
    { id: 'race', title: '1. Choix de la Race' },
    { id: 'personnalite', title: '2. Personnalité (Répartir 15 pts)' }
];

// --- Moteur de Rendu ---
async function render() {
    const app = document.getElementById('app');
    const current = steps[char.step];
    app.innerHTML = `<h1>${current.title}</h1><div id="content"></div>`;

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
        btn.onclick = () => { char.raceId = r.id; char.step = 1; render(); };
        container.appendChild(btn);
    });
}

// --- Étape 2 : Personnalité ---
function renderPersonnalite() {
    const container = document.getElementById('content');
    container.innerHTML = `<p>Total points : <span id="total-points">0</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(char.personnalite)) {
        container.innerHTML += `
            <div>
                <label>${aspect.toUpperCase()}</label>
                <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}">
            </div>
        `;
    }

    // Calcul en temps réel
    document.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const aspect = e.target.dataset.aspect;
            char.personnalite[aspect] = parseInt(e.target.value) || 0;
            
            const total = Object.values(char.personnalite).reduce((a, b) => a + b, 0);
            document.getElementById('total-points').innerText = total;
            
            // Logique de validation
            if (total !== 15) e.target.style.borderColor = "red";
            else e.target.style.borderColor = "green";
        });
    });
}

// Lancement
render();
