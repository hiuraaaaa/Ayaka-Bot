const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms));

export async function all(m) {
    // Auto-view status if it's from status@broadcast
    if (m.key.remoteJid === 'status@broadcast') {
        await delay(1000); // Optionally add a delay for viewing the status
        await this.readMessages([m.key]); // Mark the status as viewed
    }
}