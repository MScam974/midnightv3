export const state = {
    step: 0,
    history: [], 
    race: null,
    personnalite: { combativite: 3, creativite: 3, indifference: 3, raison: 3, ideal: 3 },
};

export function updateState(key, value) {
    state[key] = value;
}