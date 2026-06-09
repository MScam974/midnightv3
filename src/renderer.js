import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

// Fonction utilitaire pour le verrouillage
export function renderStep(container, title, contentHtml, onLock) {
    container.innerHTML = `<h1>${title}</h1>` + contentHtml;
    const btn = container.querySelector('#btn-lock');
    if (btn) btn.onclick = onLock;
}

export async function renderRace(container, onNext) {
    const races = await fetch('./data/competences/races.json').then(r => r.json());
    let html = "";
    races.forEach(r => {
        html += `<button id="${r.id}">${r.nom}</button>`;
    });
    
    renderStep(container, "1. Choix de la Race", html, null);
    
    races.forEach(r => {
        container.querySelector(`#${r.id}`).onclick = () => {
            state.race = r;
            state.history.push({ title: "Race", value: r.nom });
            onNext();
        };
    });
}

export async function renderStatut(container, onNext) {
    const statuts = await fetch('./data/regles/statuts.json').then(r => r.json());
    const raceKey = state.race.nom.toLowerCase(); // ex: 'dorn'
    const options = statuts[raceKey];
    
    let html = `<p>Choisissez votre statut :</p>`;
    for (const [code, data] of Object.entries(options)) {
        html += `<button class="statut-btn" data-code="${code}">${data.nom} (${code})</button>`;
    }
    
    renderStep(container, "2. Statut Social", html, null);
    
    container.querySelectorAll('.statut-btn').forEach(btn => {
        btn.onclick = () => {
            const code = btn.dataset.code;
            state.statut = { code, ...options[code] };
            // Si bonus caractère (rang 5d), on augmente la limite globale
            if (options[code].bonus_caractere > 0) state.maxCaractere = 6;
            
            state.history.push({ title: "Statut", value: options[code].nom });
            onNext();
        };
    });
}

export function renderPersonnalite(container, onNext) {
    let html = `<p>Répartir 15 pts (max ${state.maxCaractere || 5} par spé) :</p>`;
    // ... votre code existant pour les inputs ...
    renderStep(container, "3. Caractère", html + `<button id="btn-lock">Suivant</button>`, onNext);
}

export function renderTraits(container, onNext) {
    let html = `<p>Choisir vos Vertus/Vices...</p>`;
    renderStep(container, "4. Vices et Vertus", html + `<button id="btn-lock">Terminer</button>`, onNext);
}