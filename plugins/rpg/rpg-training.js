const trainingCooldown = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const trainingDelay = 1 * 60 * 1000; // 1 minute in milliseconds

let handler = async (m) => {
    let command = m.text.trim().toLowerCase();
    let user = m.sender;
    let chatId = m.chat;

    // Ensure the user's state exists
    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            attack: 0,
            lastTraining: 0
        };
    }

    let userData = global.db.data.users[user];
    let currentTime = Date.now();

    if (/^\.?training$/.test(command)) {
        // Check if user is still on cooldown
        if (currentTime - userData.lastTraining < trainingCooldown) {
            let remainingTime = formatTime(trainingCooldown - (currentTime - userData.lastTraining));
            conn.reply(chatId, `⏳ Kamu @${user.split('@')[0]}, perlu menunggu ${remainingTime} sebelum kamu bisa berlatih lagi.`, flok);
            return;
        }

        // Notify user that training has started
        conn.reply(chatId, `🚀 Pelatihan dimulai! @${user.split('@')[0]}, Mohon tunggu 1 menit untuk melihat hasilnya..`, flok);

        // Delay the training results by 1 minute
        setTimeout(() => {
            try {
                // Perform training after 1 minute
                let results = performTraining();

                // Update user's attack in the database
                userData.attack += results.attackGained;

                // Update the last training timestamp
                userData.lastTraining = currentTime;

                // Send the training summary to the user
                conn.reply(chatId, formatTrainingResults(user, results), flok);

                // Notify the user when they can train again
                setTimeout(() => {
                    conn.reply(chatId, `🔔 Kamu @${user.split('@')[0]}, sekarang bisa berlatih lagi! Ketik .training untuk memulai...`, flok);
                }, trainingCooldown);
            } catch (error) {
                console.error('Error during training:', error);
                conn.reply(chatId, `⚠️ Terjadi kesalahan saat pelatihan. Coba lagi nanti.`, flok);
            }
        }, trainingDelay);
    }
};

// Function to format time from milliseconds to HH:mm:ss
function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Function to pad single digits with leading zero
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

// Function to simulate training and calculate results
function performTraining() {
    const tasks = [
        { name: 'Kill Ants', success: Math.random() >= 0.2 },
        { name: 'Archery', success: Math.random() >= 0.2 },
        { name: 'Kill Goblin', success: Math.random() >= 0.2 },
        { name: 'Sword Training in Forest', success: Math.random() >= 0.2 },
        { name: 'Fight Orc', success: Math.random() >= 0.2 },
        { name: 'Conquer Small Dragon', success: Math.random() >= 0.2 },
        { name: 'Face Giant', success: Math.random() >= 0.2 },
        { name: 'Explore Dungeon', success: Math.random() >= 0.2 },
        { name: 'Face Minotaur', success: Math.random() >= 0.2 },
        { name: 'Train Martial Arts', success: Math.random() >= 0.2 }
    ];

    const pointsPerSuccess = 50;
    const successfulTasks = tasks.filter(task => task.success).length;
    const attackGained = successfulTasks * pointsPerSuccess;

    return {
        tasks,
        successfulTasks,
        attackGained
    };
}

// Function to format training results for display
function formatTrainingResults(user, results) {
    let tasksSummary = results.tasks.map(task => `│${task.success ? '✅' : '❌'} ${task.name}`).join('\n');

    return `⟣───「 *STATISTICS* 」───⟢
│🎯 [ *Player* : @${user.split('@')[0]} ]
│📃 [ *Successful Training* : ${results.successfulTasks}/${results.tasks.length} ]
│📋 [ *Info* : Good job! Keep training ]
⟣──────────⟢

⟣───「 *RESULTS* 」───⟢
${tasksSummary}
│
│💪 Attack diperoleh: ${results.attackGained}
⟣──────────⟢`;
}

handler.help = ['training'];
handler.tags = ['rpg'];
handler.command = /^(training|\.training)$/i;
handler.group = true;
handler.register = true;
handler.limit = 3;

export default handler;