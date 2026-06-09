import { state } from './state.js';
import { calculerTotalPoints, getStatsAvecBonus } from './logic.js';

export function renderStep(container, title, contentHtml, onLock) {
    container.innerHTML = `<h1>${title}</h1>` + contentHtml;
    const btn = container.querySelector('#btn-lock');
    if (btn && onLock) btn.onclick = onLock;
}

export async function renderRace(container, onNext) {
    const races = await fetch('./data/races/races.json').then(r => r.json());
    let html = "<div>";
    races.forEach(r => { html += `<button id="${r.id}" style="margin:5px;">${r.nom}</button>`; });
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
    const statuts = await fetch('./data/regles/statuts.json').then(r => r.json());
    const options = statuts[state.race.nom.toLowerCase()] || {};
    
    let html = `<p>Choisissez votre statut :</p>`;
    for (const [code, data] of Object.entries(options)) {
        html += `<button class="statut-btn" data-code="${code}" style="display:block; margin:5px;">${data.nom} (${code})</button>`;
    }
    
    renderStep(container, "2. Statut Social", html, null);
    container.querySelectorAll('.statut-btn').forEach(btn => {
        btn.onclick = () => {
            state.statut = { code: btn.dataset.code, ...options[btn.dataset.code] };
            state.history.push({ title: "Statut", value: state.statut.nom });
            onNext();
        };
    });
}

export function renderPersonnalite(container, onNext) {
    // Calcul des scores réels avec bonus race/statut
    const scores = getStatsAvecBonus(state.personnalite, state.race, state.statut);
    const total = calculerTotalPoints(scores);
    
    let html = `<p>Répartir 15 pts (Max par spé : ${state.statut.bonus_caractere ? 6 : 5}) :</p>
                <p>Total : <span id="total-points">${total}</span>/15</p>`;
    
    for (const [aspect, score] of Object.entries(scores)) {
        html += `<div><label>${aspect}</label> 
            <input type="number" class="aspect-input" data-aspect="${aspect}" value="${score}"></div>`;
    }
    html += `<button id="btn-lock" ${total !== 15 ? 'disabled' : ''}>Valider</button>`;
    
    renderStep(container, "3. Caractère", html, () => {
        state.history.push({ title: "Caractère", value: "Validé" });
        onNext();
    });
}

export async function renderTraits(container, onNext) {
    const data = await fetch('./data/regles/personnalite.json').then(r => r.json());
    const scores = getStatsAvecBonus(state.personnalite, state.race, state.statut);
    
    let html = `<table border="1" style="width:100%; border-collapse:collapse;">
        <tr><th>Vices</th><th>Trait</th><th>Vertus</th></tr>`;
    
    for (const [aspect, score] of Object.entries(scores)) {
        if (score >= 4 || score <= 2) {
            const type = (score >= 4) ? "majeur" : "mineur";
            html += `<tr>
                <td><select class="trait-select" data-type="vice" data-aspect="${aspect}">
                    <option value="">--</option>${data.aspects[aspect][type].vices.map(v => `<option value="${v}">${v}</option>`).join('')}
                </select></td>
                <td><strong>${aspect} (${score})</strong></td>
                <td><select class="trait-select" data-type="vertu" data-aspect="${aspect}">
                    <option value="">--</option>${data.aspects[aspect][type].vertus.map(v => `<option value="${v}">${v}</option>`).join('')}
                </select></td>
            </tr>`;
        }
    }
    html += `</table><br><button id="btn-lock">Terminer</button>`;
    
    renderStep(container, "4. Vices et Vertus", html, () => {
        state.history.push({ title: "Traits", value: "Validés" });
        onNext();
    });
}