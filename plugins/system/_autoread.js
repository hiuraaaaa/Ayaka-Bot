const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms));

export async function all(m) {
    if (m.message) {
        await delay(0);
        await this.readMessages([m.key]);
    }
}