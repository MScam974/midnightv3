import { state } from './state.js';
import { calculerTotalPoints } from './logic.js';

// Fonction utilitaire pour le verrouillage et le rendu global
export function renderStep(container, title, contentHtml, onLock) {
    container.innerHTML = `<h1>${title}</h1>` + contentHtml;
    const btn = container.querySelector('#btn-lock');
    if (btn && onLock) btn.onclick = onLock;
}

export async function renderRace(container, onNext) {
    const response = await fetch('./data/competences/races.json');
    const races = await response.json();
    
    let html = "<div>";
    races.forEach(r => {
        html += `<button id="${r.id}" style="margin:5px;">${r.nom}</button>`;
    });
    html += "</div>";
    
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
    const response = await fetch('./data/regles/statuts.json');
    const statuts = await response.json();
    const raceKey = state.race.nom.toLowerCase(); 
    const options = statuts[raceKey] || {};
    
    let html = `<p>Choisissez votre statut :</p>`;
    for (const [code, data] of Object.entries(options)) {
        html += `<button class="statut-btn" data-code="${code}" style="display:block; margin:5px;">${data.nom} (${code})</button>`;
    }
    
    renderStep(container, "2. Statut Social", html, null);
    
    container.querySelectorAll('.statut-btn').forEach(btn => {
        btn.onclick = () => {
            const code = btn.dataset.code;
            state.statut = { code, ...options[code] };
            if (options[code].bonus_caractere > 0) state.maxCaractere = 6;
            
            state.history.push({ title: "Statut", value: options[code].nom });
            onNext();
        };
    });
}

export function renderPersonnalite(container, onNext) {
    const total = calculerTotalPoints(state.personnalite);
    let html = `<p>Répartir 15 pts (max ${state.maxCaractere || 5} par spé) :</p>
                <p>Total : <span id="total-points">${total}</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        html += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }
    html += `<button id="btn-lock" ${total !== 15 ? 'disabled' : ''}>Valider</button>`;
    
    renderStep(container, "3. Caractère", html, () => {
        const resume = Object.entries(state.personnalite).map(([a, s]) => `${a}:${s}`).join(', ');
        state.history.push({ title: "Caractère", value: resume });
        onNext();
    });

    container.querySelectorAll('.aspect-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.personnalite[e.target.dataset.aspect] = parseInt(e.target.value) || 0;
            const t = calculerTotalPoints(state.personnalite);
            document.getElementById('total-points').innerText = t;
            document.getElementById('btn-lock').disabled = (t !== 15);
        });
    });
}

export async function renderTraits(container, onNext) {
    const data = await fetch('./data/regles/personnalite.json').then(r => r.json());
    let html = `<p>Choisir vos Vertus/Vices :</p>`;
    
    for (const [aspect, score] of Object.entries(state.personnalite)) {
        if (score >= 4 || score <= 2) {
            const type = (score >= 4) ? "majeur" : "mineur";
            html += `<div><h3>${aspect} (${type})</h3>
                <select class="trait-select" data-aspect="${aspect}">
                    <option value="">Choisir...</option>
                    ${data.aspects[aspect][type].vertus.map(v => `<option value="${v}">Vertu : ${v}</option>`).join('')}
                    ${data.aspects[aspect][type].vices.map(v => `<option value="${v}">Vice : ${v}</option>`).join('')}
                </select></div>`;
        }
    }
    html += `<button id="btn-lock">Terminer</button>`;
    
    renderStep(container, "4. Vices et Vertus", html, () => {
        const selected = Array.from(container.querySelectorAll('.trait-select')).map(s => s.value);
        state.history.push({ title: "Traits", value: selected.join(', ') });
        onNext();
    });
}