import { promises as fs } from 'fs';
import path from 'path';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

const dataPath = path.join(process.cwd(), 'src', 'genshinimpact.json');

const genshinCharacters = {
    pyro: [
        { name: "Diluc", hp: 120, maxHp: 120, atk: 25, def: 10, skill: "Searing Onslaught" },
        { name: "Hu Tao", hp: 100, maxHp: 100, atk: 30, def: 8, skill: "Guide to Afterlife" },
        { name: "Klee", hp: 90, maxHp: 90, atk: 20, def: 7, skill: "Jumpy Dumpty" },
        { name: "Amber", hp: 80, maxHp: 80, atk: 18, def: 6, skill: "Fiery Rain" },
        { name: "Bennett", hp: 100, maxHp: 100, atk: 22, def: 8, skill: "Passion Overload" },
        { name: "Yoimiya", hp: 95, maxHp: 95, atk: 24, def: 7, skill: "Teika Fire-Dance" },
        { name: "Thoma", hp: 90, maxHp: 90, atk: 21, def: 9, skill: "Blazing Blessing" },
        { name: "Dehya", hp: 110, maxHp: 110, atk: 23, def: 11, skill: "Molten Inferno" },
        { name: "Lyney", hp: 95, maxHp: 95, atk: 25, def: 7, skill: "Prop Arrow" },
        { name: "Chevreuse", hp: 90, maxHp: 90, atk: 20, def: 8, skill: "Line Bayonet Thrust EX" },
        { name: "Xinyan", hp: 100, maxHp: 100, atk: 22, def: 9, skill: "Sweeping Fervor" },
        { name: "Mualani", hp: 95, maxHp: 95, atk: 24, def: 7, skill: "Surfing on Waves" }
    ],
    hydro: [
        { name: "Tartaglia", hp: 110, maxHp: 110, atk: 22, def: 12, skill: "Foul Legacy" },
        { name: "Mona", hp: 85, maxHp: 85, atk: 18, def: 6, skill: "Mirror Reflection" },
        { name: "Kokomi", hp: 95, maxHp: 95, atk: 15, def: 10, skill: "Kurage's Oath" },
        { name: "Xingqiu", hp: 90, maxHp: 90, atk: 20, def: 8, skill: "Guhua Sword: Fatal Rainscreen" },
        { name: "Yelan", hp: 100, maxHp: 100, atk: 23, def: 7, skill: "Exquisite Throw" },
        { name: "Furina", hp: 90, maxHp: 90, atk: 21, def: 8, skill: "Salon Solitaire" },
        { name: "Neuvillette", hp: 115, maxHp: 115, atk: 25, def: 10, skill: "O Tides, I Have Returned" },
        { name: "Barbara", hp: 85, maxHp: 85, atk: 16, def: 6, skill: "Whisper of Water" },
        { name: "Candace", hp: 95, maxHp: 95, atk: 19, def: 9, skill: "Heron’s Sanctum" }
    ],
    electro: [
        { name: "Raiden Shogun", hp: 115, maxHp: 115, atk: 28, def: 9, skill: "Transcendence: Baleful Omen" },
        { name: "Keqing", hp: 100, maxHp: 100, atk: 24, def: 8, skill: "Stellar Restoration" },
        { name: "Lisa", hp: 80, maxHp: 80, atk: 16, def: 5, skill: "Violet Arc" },
        { name: "Fischl", hp: 85, maxHp: 85, atk: 20, def: 7, skill: "Nightrider" },
        { name: "Kuki Shinobu", hp: 95, maxHp: 95, atk: 19, def: 8, skill: "Sacrificial Rite" },
        { name: "Cyno", hp: 100, maxHp: 100, atk: 25, def: 8, skill: "Secret Rite: Chasmic Soul" },
        { name: "Beidou", hp: 105, maxHp: 105, atk: 22, def: 10, skill: "Tidecaller" },
        { name: "Yukii", hp: 90, maxHp: 90, atk: 23, def: 7, skill: "Yakan Evocation: Sesshou Sakura" },
        { name: "Kujou Sara", hp: 95, maxHp: 95, atk: 21, def: 8, skill: "Tengu Stormcall" },
        { name: "Razor", hp: 100, maxHp: 100, atk: 23, def: 9, skill: "Claw and Thunder" },
        { name: "Clorinde", hp: 105, maxHp: 105, atk: 26, def: 8, skill: "Hunter’s Pursuit" }
    ],
    anemo: [
        { name: "Venti", hp: 90, maxHp: 90, atk: 20, def: 7, skill: "Skyward Sonnet" },
        { name: "Xiao", hp: 105, maxHp: 105, atk: 26, def: 9, skill: "Lemniscatic Wind Cycling" },
        { name: "Kazuha", hp: 95, maxHp: 95, atk: 22, def: 8, skill: "Chihayaburu" },
        { name: "Sucrose", hp: 80, maxHp: 80, atk: 18, def: 6, skill: "Alchemical Anemone" },
        { name: "Sayu", hp: 85, maxHp: 85, atk: 18, def: 7, skill: "Yukikaze" },
        { name: "Wanderer", hp: 100, maxHp: 100, atk: 24, def: 8, skill: "Hanega: Song of the Wind" },
        { name: "Jean", hp: 110, maxHp: 110, atk: 21, def: 10, skill: "Gale Blade" },
        { name: "Faruzan", hp: 85, maxHp: 85, atk: 19, def: 6, skill: "Wind Realm of Nasamjnin" },
        { name: "Anemo Traveler", hp: 90, maxHp: 90, atk: 20, def: 8, skill: "Palm Vortex" }
    ],
    geo: [
        { name: "Zhongli", hp: 130, maxHp: 130, atk: 18, def: 15, skill: "Dominus Lapidis" },
        { name: "Albedo", hp: 100, maxHp: 100, atk: 20, def: 10, skill: "Abiogenesis: Solar Isotoma" },
        { name: "Ningguang", hp: 90, maxHp: 90, atk: 21, def: 8, skill: "Jade Screen" },
        { name: "Noelle", hp: 100, maxHp: 100, atk: 23, def: 11, skill: "Favonius Bladework" },
        { name: "Geo Traveler", hp: 90, maxHp: 90, atk: 22, def: 10, skill: "Starfell Sword" },
        { name: "Arataki Itto", hp: 115, maxHp: 115, atk: 26, def: 12, skill: "Masatsu Zetsugi: Akaushi Burst!" },
        { name: "Yun Jin", hp: 95, maxHp: 95, atk: 19, def: 9, skill: "Opening Flourish" },
        { name: "Gorou", hp: 90, maxHp: 90, atk: 18, def: 8, skill: "Inuzaka All-Round Defense" },
        { name: "Chiori", hp: 95, maxHp: 95, atk: 22, def: 9, skill: "Fluttering Hasode" }
    ],
    cryo: [
        { name: "Ganyu", hp: 95, maxHp: 95, atk: 23, def: 7, skill: "Trail of the Qilin" },
        { name: "Ayaka", hp: 100, maxHp: 100, atk: 25, def: 8, skill: "Kamui: Senkai" },
        { name: "Eula", hp: 110, maxHp: 110, atk: 27, def: 10, skill: "Icetide Vortex" },
        { name: "Kaeya", hp: 90, maxHp: 90, atk: 20, def: 6, skill: "Frostgnaw" },
        { name: "Rosaria", hp: 95, maxHp: 95, atk: 22, def: 7, skill: "Rites of Termination" },
        { name: "Shenhe", hp: 95, maxHp: 95, atk: 22, def: 8, skill: "Divine Maiden's Deliverance" },
        { name: "Chongyun", hp: 90, maxHp: 90, atk: 21, def: 7, skill: "Spirit Blade: Chonghua's Layered Frost" },
        { name: "Diona", hp: 85, maxHp: 85, atk: 18, def: 6, skill: "Icy Paws" },
        { name: "Qiqi", hp: 90, maxHp: 90, atk: 17, def: 7, skill: "Adeptus Art: Herald of Frost" },
        { name: "Layla", hp: 85, maxHp: 85, atk: 19, def: 6, skill: "Nights of Formal Focus" },
        { name: "Freminet", hp: 95, maxHp: 95, atk: 21, def: 8, skill: "Pressurized Floe" }
    ],
    dendro: [
        { name: "Tighnari", hp: 100, maxHp: 100, atk: 24, def: 8, skill: "Vijnana-Phala" },
        { name: "Nahida", hp: 90, maxHp: 90, atk: 20, def: 7, skill: "Illusory Heart" },
        { name: "Collei", hp: 85, maxHp: 85, atk: 18, def: 6, skill: "Floral Brush" },
        { name: "Alhaitham", hp: 105, maxHp: 105, atk: 25, def: 9, skill: "Universality: An Elaboration on Form" },
        { name: "Baizhu", hp: 95, maxHp: 95, atk: 19, def: 8, skill: "Universal Diagnosis" },
        { name: "Yaoyao", hp: 90, maxHp: 90, atk: 18, def: 7, skill: "Raphanus Sky Cluster" },
        { name: "Kirara", hp: 95, maxHp: 95, atk: 20, def: 8, skill: "Meow-teor Kick" },
        { name: "Kaveh", hp: 100, maxHp: 100, atk: 22, def: 9, skill: "Artistic Ingenuity" },
        { name: "Dendro Traveler", hp: 90, maxHp: 90, atk: 20, def: 8, skill: "Razor Grass Blade" },
        { name: "Kinich", hp: 100, maxHp: 100, atk: 24, def: 8, skill: "Canopy Hunter: Riding High" }
    ]
};

const elementToWeaponType = {
    pyro: 'fighter',
    hydro: 'mage',
    electro: 'marksman',
    anemo: 'mage',
    geo: 'tank',
    cryo: 'fighter',
    dendro: 'mage'
};

async function loadData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        const defaultData = {};
        await saveData(defaultData);
        return defaultData;
    }
}

async function saveData(data) {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

function getCurrentDate(timezone) {
    let offset;
    if (timezone === 'WIB') offset = 7;
    else if (timezone === 'WITA') offset = 8;
    else if (timezone === 'WIT') offset = 9;
    else offset = 7; // Default ke WIB kalau zona waktu gak valid
    return new Date(new Date().toLocaleString('en-US', { timeZone: `Etc/GMT-${offset}` })).toISOString().split('T')[0];
}

function regenerateHP(user) {
    const now = Date.now();
    if (!user.rpg.lastRegen) user.rpg.lastRegen = now;
    const baseInterval = 10 * 60 * 1000;
    const regenReduction = Math.min(0.5, (user.rpg.level - 1) * 0.015);
    const regenInterval = baseInterval * (1 - regenReduction);
    const elapsed = now - user.rpg.lastRegen;
    const regenCycles = Math.floor(elapsed / regenInterval);
    if (regenCycles > 0 && user.rpg.hp < user.rpg.maxHp) {
        const regenAmount = Math.floor(user.rpg.maxHp * 0.05) * regenCycles;
        user.rpg.hp = Math.min(user.rpg.maxHp, user.rpg.hp + regenAmount);
        user.rpg.lastRegen = now - (elapsed % regenInterval);
    }
}

function getHPStatus(user) {
    const now = Date.now();
    const baseInterval = 10 * 60 * 1000;
    const regenReduction = Math.min(0.5, (user.rpg.level - 1) * 0.015);
    const regenInterval = baseInterval * (1 - regenReduction);
    const hpPercentage = (user.rpg.hp / user.rpg.maxHp) * 100;
    const remainingHP = user.rpg.maxHp - user.rpg.hp;
    const regenAmount = user.rpg.maxHp * 0.05;
    const cyclesToFull = Math.ceil(remainingHP / regenAmount);
    const timeToFull = cyclesToFull * (regenInterval / 60000);
    const elapsed = now - user.rpg.lastRegen;
    const nextRegenIn = (regenInterval - (elapsed % regenInterval)) / 60000;
    
    return {
        hpText: `${user.rpg.hp}/${user.rpg.maxHp} (${hpPercentage.toFixed(2)}%)`,
        regenText: user.rpg.hp >= user.rpg.maxHp 
            ? "Full HP!" 
            : `Next Regen: ${nextRegenIn.toFixed(2)} menit | Full in: ${timeToFull.toFixed(2)} menit`
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addRandomSkill(user) {
    if (user.rpg.skills.length >= 3) return;
    const availableSkills = user.rpg.allSkills.filter(skill => !user.rpg.skills.includes(skill));
    if (availableSkills.length === 0) return;
    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    user.rpg.skills.push(randomSkill);
}

let handler = async (m, { conn, args, text }) => {
    let globalData = await loadData();
    let user = globalData[m.sender] || {};
    let globalDB = global.db.data.users[m.sender] || { money: 0 };

    const defaultRPG = {
        hero: null,
        level: 1,
        xp: 0,
        gold: 100,
        hp: 100,
        maxHp: 100,
        atk: 10,
        def: 5,
        skills: [],
        allSkills: [],
        dungeonWins: 0,
        lastDungeon: null,
        lastRegen: Date.now(),
        timezone: null,
        lastQuest: null,
        equippedWeapon: null,
        inventory: [],
        characters: [],
        activeCharacter: null
    };

    if (!user.rpg) {
        user.rpg = { ...defaultRPG };
    } else {
        user.rpg = { ...defaultRPG, ...user.rpg };
        if (user.rpg.equippedWeapon === undefined) user.rpg.equippedWeapon = null;
        if (user.rpg.inventory === undefined) user.rpg.inventory = [];
        if (user.rpg.allSkills === undefined) user.rpg.allSkills = [];
        if (user.rpg.characters === undefined) user.rpg.characters = [];
        if (user.rpg.activeCharacter === undefined) user.rpg.activeCharacter = null;
    }

    regenerateHP(user);
    globalData[m.sender] = user;
    await saveData(globalData);

    const skillProgression = {
        mage: [
            'fireball', 'iceblast', 'thunderstrike', 'meteor shower', 'frost nova',
            'chain lightning', 'arcane burst', 'blizzard', 'flame wave', 'storm call',
            'shadow bolt', 'lightning orb', 'ice shard', 'firestorm', 'thunder clap',
            'mana shield', 'teleport', 'gravity well', 'energy drain', 'elemental fury'
        ],
        fighter: [
            'slash', 'powerstrike', 'berserk', 'whirlwind', 'shield slam',
            'rage blow', 'dual strike', 'battle cry', 'piercing thrust', 'hammer smash',
            'counterattack', 'blinding slash', 'fury spin', 'iron fist', 'war stomp',
            'defensive stance', 'charge', 'vital strike', 'bloodlust', 'execution'
        ],
        marksman: [
            'headshot', 'rapidfire', 'snipe', 'arrow rain', 'explosive shot',
            'poison dart', 'multi-shot', 'piercing arrow', 'eagle eye', 'trap shot',
            'shadow arrow', 'barrage', 'wind shot', 'critical aim', 'frost arrow',
            'stealth shot', 'homing arrow', 'sniper stance', 'scatter shot', 'bullseye'
        ],
        tank: [
            'shieldbash', 'taunt', 'fortify', 'iron wall', 'ground smash',
            'bulwark', 'provoke', 'stone skin', 'bash combo', 'deflector',
            'war shield', 'staggering blow', 'endurance', 'shockwave', 'armor up',
            'reflect', 'hold the line', 'titan stance', 'earth guard', 'unbreakable'
        ]
    };

    const weapons = {
        mage: {
            rare: [
                { name: "Oak Staff", atk: 6, def: 1 },
                { name: "Moon Wand", atk: 8, def: 0 },
                { name: "Ember Rod", atk: 7, def: 2 }
            ],
            epic: [
                { name: "Crystal Wand", atk: 16, def: 4 },
                { name: "Storm Scepter", atk: 18, def: 3 },
                { name: "Frost Staff", atk: 15, def: 5 }
            ],
            legendary: [
                { name: "Star Scepter", atk: 32, def: 12 },
                { name: "Eclipse Staff", atk: 35, def: 10 },
                { name: "Aether Wand", atk: 30, def: 14 },
                { name: "Lumenveil", atk: 40, def: 22 }
            ]
        },
        fighter: {
            rare: [
                { name: "Iron Sword", atk: 5, def: 2 },
                { name: "Steel Axe", atk: 7, def: 1 },
                { name: "Bronze Mace", atk: 6, def: 3 }
            ],
            epic: [
                { name: "Dragon Blade", atk: 15, def: 5 },
                { name: "Rune Axe", atk: 17, def: 4 },
                { name: "War Hammer", atk: 16, def: 6 }
            ],
            legendary: [
                { name: "Excalibur", atk: 30, def: 10 },
                { name: "Titan Cleaver", atk: 33, def: 9 },
                { name: "Mjolnir", atk: 32, def: 11 }
            ]
        },
        marksman: {
            rare: [
                { name: "Steel Bow", atk: 7, def: 0 },
                { name: "Oak Crossbow", atk: 6, def: 1 },
                { name: "Iron Longbow", atk: 5, def: 2 }
            ],
            epic: [
                { name: "Wind Crossbow", atk: 18, def: 3 },
                { name: "Shadow Bow", atk: 16, def: 4 },
                { name: "Flame Arbalest", atk: 17, def: 2 }
            ],
            legendary: [
                { name: "Phoenix Bow", atk: 35, def: 8 },
                { name: "Storm Slinger", atk: 33, def: 9 },
                { name: "Eagle Crossbow", atk: 34, def: 7 }
            ]
        },
        tank: {
            rare: [
                { name: "Iron Shield", atk: 4, def: 3 },
                { name: "Steel Buckler", atk: 5, def: 2 },
                { name: "Bronze Guard", atk: 3, def: 4 }
            ],
            epic: [
                { name: "Fortress Shield", atk: 14, def: 6 },
                { name: "Stone Wall", atk: 13, def: 7 },
                { name: "Iron Bastion", atk: 15, def: 5 }
            ],
            legendary: [
                { name: "Aegis Shield", atk: 28, def: 14 },
                { name: "Titan Wall", atk: 30, def: 12 },
                { name: "Guardian Bulwark", atk: 29, def: 13 }
            ]
        }
    };

    if (!args[0]) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `✨ Halo Sensei! Selamat datang di GenshinImpact!\n\n🌟 Pilih menu di bawah ya:\n🌸 create - Buat hero baru\n🌿 dungeon - Tantang dungeon\n🌞 quest - Ambil misi harian\n🎰 gacha - Gacha weapon/karakter\n🗡️ equip - Pasang weapon\n❌ unequip - Lepas weapon\n🔄 changechar - Ganti karakter\n💸 topup - Topup gold`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Menu",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Menu 🌟",
                                        sections: [{
                                            title: "List Menu",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Create Hero", description: "Bikin hero baru", id: ".genshinimpact create" },
                                                { header: "", title: "Profile", description: "Cek profil hero", id: ".genshinimpact profile" },
                                                { header: "", title: "Skills", description: "Liat skill hero", id: ".genshinimpact skill" },
                                                { header: "", title: "Upskill", description: "Upgrade skill hero", id: ".genshinimpact upskill" },
                                                { header: "", title: "Dungeon", description: "Masuk dungeon", id: ".genshinimpact dungeon" },
                                                { header: "", title: "Quest", description: "Ambil misi harian", id: ".genshinimpact quest" },
                                                { header: "", title: "Gacha", description: "Gacha weapon/karakter baru", id: ".genshinimpact gacha" },
                                                { header: "", title: "Equip", description: "Pasang weapon", id: ".genshinimpact equip" },
                                                { header: "", title: "Unequip", description: "Lepas weapon", id: ".genshinimpact unequip" },
                                                { header: "", title: "Change Character", description: "Ganti karakter aktif", id: ".genshinimpact changechar" },
                                                { header: "", title: "Topup Gold", description: "Topup gold pake Money", id: ".genshinimpact topup" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    let command = args[0].toLowerCase();

    if (command === 'create') {
    if (user.rpg.hero) return m.reply('🚫 Sensei udah punya hero nih! Cek dulu pake .genshinimpact profile ya! 🌟');

    let heroType = args[1] ? args[1].toLowerCase().trim() : '';
    let timezone = args[2] ? args[2].toUpperCase().trim() : '';
    let characterName = args.slice(3).join(' ').toLowerCase().trim(); // Ambil nama karakter

    // Validasi elemen hero
    if (!heroType) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🌟 Pilih elemen hero buat petualangan di Teyvat, Sensei!`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Create Hero",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Elemen 🌟",
                                        sections: [{
                                            title: "Tipe Elemen",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Pyro", description: "Kekuatan api yang membara!", id: ".genshinimpact create pyro" },
                                                { header: "", title: "Hydro", description: "Kekuatan air yang menyembuhkan!", id: ".genshinimpact create hydro" },
                                                { header: "", title: "Electro", description: "Kekuatan petir yang menyetrum!", id: ".genshinimpact create electro" },
                                                { header: "", title: "Anemo", description: "Kekuatan angin yang bebas!", id: ".genshinimpact create anemo" },
                                                { header: "", title: "Geo", description: "Kekuatan batu yang kokoh!", id: ".genshinimpact create geo" },
                                                { header: "", title: "Cryo", description: "Kekuatan es yang membekukan!", id: ".genshinimpact create cryo" },
                                                { header: "", title: "Dendro", description: "Kekuatan tumbuhan yang menghidupkan!", id: ".genshinimpact create dendro" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    if (!genshinCharacters[heroType]) return m.reply('🚫 Elemen gak valid, Sensei! 😅 Pilih: pyro, hydro, electro, anemo, geo, cryo, atau dendro! 🌟');

    // Validasi zona waktu
    if (!timezone || !['WIB', 'WITA', 'WIT'].includes(timezone)) {
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let oya = `🌟 Pilih zona waktu buat Sensei dulu ya!`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Pilih Zona Waktu",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Zona Waktu 🌟",
                                    sections: [{
                                        title: "Zona Waktu",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "WIB", description: "Waktu Indonesia Barat (UTC+7)", id: `.genshinimpact create ${heroType} WIB` },
                                            { header: "", title: "WITA", description: "Waktu Indonesia Tengah (UTC+8)", id: `.genshinimpact create ${heroType} WITA` },
                                            { header: "", title: "WIT", description: "Waktu Indonesia Timur (UTC+9)", id: `.genshinimpact create ${heroType} WIT` }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    return;
}

    // Validasi karakter
    if (!characterName) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🌟 Pilih karakter ${heroType} buat Sensei!\n\nKarakter tersedia:\n${genshinCharacters[heroType].map(c => `👤 ${c.name} (HP: ${c.hp}, ATK: ${c.atk}, DEF: ${c.def})`).join('\n')}`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Pilih Karakter",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Karakter 🌟",
                                        sections: [{
                                            title: `Karakter ${heroType.charAt(0).toUpperCase() + heroType.slice(1)}`,
                                            highlight_label: "RPG",
                                            rows: genshinCharacters[heroType].map(c => ({
                                                header: "", 
                                                title: c.name, 
                                                description: `HP: ${c.hp}, ATK: ${c.atk}, DEF: ${c.def}`, 
                                                id: `.genshinimpact create ${heroType} ${timezone} ${c.name}`
                                            }))
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    // Normalisasi dan cari karakter
    let normalizedInput = characterName.replace(/\s+/g, ' ').trim().toLowerCase();
    let selectedCharacter = genshinCharacters[heroType].find(c => 
        c.name.toLowerCase() === normalizedInput
    );

    if (!selectedCharacter) {
        let availableChars = genshinCharacters[heroType].map(c => c.name).join(', ');
        return m.reply(`🚫 Ups, karakter *${characterName}* gak ada di elemen ${heroType}! 😅 Pilih dari: ${availableChars}. Coba lagi ya, Sensei! 🌟`);
    }

    // Set waktu pembuatan akun sesuai zona waktu
    const timeZoneMap = { WIB: 'Asia/Jakarta', WIT: 'Asia/Jayapura' };
    const createdAt = new Date().toLocaleString('en-US', { timeZone: timeZoneMap[timezone] });

    // Simpan data hero
    user.rpg.hero = heroType;
    user.rpg.characters = [selectedCharacter];
    user.rpg.activeCharacter = selectedCharacter;
    user.rpg.hp = selectedCharacter.hp;
    user.rpg.maxHp = selectedCharacter.maxHp;
    user.rpg.atk = selectedCharacter.atk;
    user.rpg.def = selectedCharacter.def;
    user.rpg.skills = [selectedCharacter.skill];
    user.rpg.allSkills = skillProgression[heroType] || [];
    user.rpg.lastRegen = Date.now();
    user.rpg.timezone = timezone;
    user.rpg.createdAt = createdAt; // Simpan waktu lokal

    globalData[m.sender] = user;
    await saveData(globalData);

    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let result = `🎉 Hero Sensei berhasil dibuat! 🎉\n🌟 Elemen: ${heroType.charAt(0).toUpperCase() + heroType.slice(1)}\n👤 Karakter: ${selectedCharacter.name}\n⏰ Zona Waktu: ${timezone}\n📅 Dibuat: ${createdAt}\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n✨ Skill: ${user.rpg.skills.join(', ')}\n🌟 Ayo jelajah Teyvat bareng ${selectedCharacter.name}!`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: result },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Create Hero",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" },
                                            { header: "", title: "Cek Profil", description: "Liat profil hero", id: ".genshinimpact profile" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

if (command === 'profile') {
    if (!user.rpg.activeCharacter) {
        return m.reply('🚫 Sensei belum punya hero aktif! Buat dulu pakai *.genshinimpact create* ya!');
    }

    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let hpStatus = getHPStatus(user);
    let regenTime = Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15));
    let weaponInfo = user.rpg.equippedWeapon ? `${user.rpg.equippedWeapon.name} (ATK: ${user.rpg.equippedWeapon.atk}, DEF: ${user.rpg.equippedWeapon.def})` : "Belum equip weapon";
    let inventoryList = user.rpg.inventory.length > 0 ? user.rpg.inventory.map(w => `${w.name} (ATK: ${w.atk}, DEF: ${w.def})`).join('\n') : "Kosong";
    let charactersList = user.rpg.characters.length > 0 ? user.rpg.characters.map(c => `${c.name} (HP: ${c.hp}, ATK: ${c.atk}, DEF: ${c.def})`).join('\n') : "Hanya karakter aktif";
    
    let profile = `🌟 *Profil Sensei* 🌟\n` +
                  `👤 *Karakter Aktif*: ${user.rpg.activeCharacter.name}\n` +
                  `🔥 *Elemen*: ${user.rpg.hero || 'Belum dipilih'}\n` +
                  `⏰ *Zona Waktu*: ${user.rpg.timezone || 'Belum diset'}\n` +
                  `📊 *Level*: ${user.rpg.level}\n` +
                  `✨ *XP*: ${user.rpg.xp}/${user.rpg.level * 100}\n` +
                  `💰 *Gold*: ${user.rpg.gold}\n` +
                  `❤️ *HP*: ${hpStatus.hpText}\n` +
                  `⏳ *Regen*: ${hpStatus.regenText}\n` +
                  `⚔️ *ATK*: ${user.rpg.atk}\n` +
                  `🛡️ *DEF*: ${user.rpg.def}\n` +
                  `🌠 *Active Skills*: ${user.rpg.skills.join(', ')}\n` +
                  `🏆 *Dungeon Wins*: ${user.rpg.dungeonWins}\n` +
                  `🗡️ *Equipped Weapon*: ${weaponInfo}\n` +
                  `🎒 *Inventory*: \n${inventoryList}\n` +
                  `👥 *Karakter Dimiliki*: \n${charactersList}`;

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: profile },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Profile",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: {
                                        url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                    },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" },
                                            { header: "", title: "Gacha", description: "Gacha karakter baru", id: ".genshinimpact gacha" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

    if (command === 'skill') {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let skillText = `🌠 *Active Skills Sensei* 🌠\n✨ ${user.rpg.skills.join('\n✨ ')}\n\n💡 Skill nambah otomatis tiap level up, upgrade pake .genshinimpact upskill ya!`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: skillText },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Skills",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }

    if (command === 'upskill') {
    // Normalisasi input skill
    let skillInput = args.slice(1).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
    if (!skillInput) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🌟 Pilih skill aktif yang mau diupgrade, Sensei!\n\nSkill aktif:\n${user.rpg.skills.length > 0 ? user.rpg.skills.map(s => `✨ ${s}`).join('\n') : 'Belum ada skill aktif!'}\n> Naikin ATK pake 50 Gold!`;
        let rows = user.rpg.skills.map(s => ({
            header: "", 
            title: s, 
            description: `Upgrade ${s} (50 Gold)`, 
            id: `.genshinimpact upskill ${s.replace(/\s+/g, ' ').trim()}`
        }));
        if (user.rpg.skills.length === 0) {
            return m.reply('🚫 Yah, Sensei belum punya skill aktif! Coba cek .genshinimpact profile atau gacha karakter baru! 🌟');
        }
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Upskill",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Skill 🌟",
                                        sections: [{ title: "Active Skills", highlight_label: "RPG", rows }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    // Validasi skill dengan normalisasi
    let foundSkill = user.rpg.skills.find(s => 
        s.replace(/\s+/g, ' ').trim().toLowerCase() === skillInput
    );
    
    if (!foundSkill) {
        let skillList = user.rpg.skills.length > 0 ? user.rpg.skills.join(', ') : 'Belum ada skill';
        return m.reply(`🚫 Ups, skill *${skillInput}* gak ada di skill aktif Sensei! 😅\nSkill yang bisa diupgrade: ${skillList}\nCek dulu pake .genshinimpact skill ya! 🌟`);
    }

    if (user.rpg.gold < 50) return m.reply('💰 Gold Sensei kurang nih! Butuh 50 gold buat upgrade! 🌟');

    // Upgrade skill
    user.rpg.gold -= 50;
    user.rpg.atk += 5;
    globalData[m.sender] = user;
    await saveData(globalData);

    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let result = `🎉 Skill *${foundSkill}* berhasil diupgrade!\n⚔️ ATK Sensei naik +5, jadi *${user.rpg.atk}*!\n💰 Sisa Gold: ${user.rpg.gold}\n🌟 Keren banget, Sensei! Ayo taklukin Teyvat!`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: result },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Upskill Result",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

    if (command === 'topup') {
        const topupOptions = [10, 30, 50, 70, 140, 300, 500, 1000, 2000, 5000, 12900];
        let goldAmount = args[1] ? parseInt(args[1]) : '';
        
        if (!goldAmount || !topupOptions.includes(goldAmount)) {
            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
            let oya = `💸 *Topup Gold Teyvat!*\n💰 Money Sensei: ${globalDB.money.toLocaleString()}`;
            let msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© Lann4youOfc 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Topup Gold",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: `${global.namebot}`
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ CastoAyaka - Ai ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Pilih Jumlah Gold 🌟",
                                            sections: [{
                                                title: "Pilihan Topup",
                                                highlight_label: "RPG",
                                                rows: topupOptions.map(g => ({
                                                    header: "", title: `${g} Gold`, description: `${(g * 500000).toLocaleString()} Money`, id: `.genshinimpact topup ${g}`
                                                }))
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
            return;
        }

        let moneyCost = goldAmount * 500000;
        if (globalDB.money < moneyCost) return m.reply(`🚫 Money Sensei kurang nih! Butuh ${(moneyCost).toLocaleString()} Money buat topup ${goldAmount} Gold! 🌟`);

        globalDB.money -= moneyCost;
        user.rpg.gold += goldAmount;
        globalData[m.sender] = user;
        global.db.data.users[m.sender] = globalDB;
        await saveData(globalData);
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let result = `💸 *Topup Berhasil!* 💸\nSensei dapet *${goldAmount} Gold*!\n💰 Sisa Money: ${(globalDB.money).toLocaleString()}\n💰 Total Gold: ${user.rpg.gold}`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: result },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Topup Result",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }

    if (command === 'gacha') {
    if (!args[1]) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🎰 *Gacha Teyvat*\n\nPilih tingkat gacha:\n🌟 Normal (30 Gold) - Zonk/XP/Gold\n✨ Rare (50 Gold) - Zonk/XP/Gold/Weapon Rare\n🌌 Epic (150 Gold) - Zonk/XP/Gold/Weapon Epic\n⚡ Legendary (500 Gold) - Zonk/XP/Gold/Weapon Legendary\n🎭 Character (200 Gold) - Dapatkan karakter baru!`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Gacha",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Gacha 🌟",
                                        sections: [{
                                            title: "Tingkat Gacha",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Normal", description: "30 Gold", id: ".genshinimpact gacha normal" },
                                                { header: "", title: "Rare", description: "50 Gold", id: ".genshinimpact gacha rare" },
                                                { header: "", title: "Epic", description: "150 Gold", id: ".genshinimpact gacha epic" },
                                                { header: "", title: "Legendary", description: "500 Gold", id: ".genshinimpact gacha legendary" },
                                                { header: "", title: "Character", description: "200 Gold", id: ".genshinimpact gacha character" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    let gachaType = args[1].toLowerCase();
    let gachaCosts = { normal: 30, rare: 50, epic: 150, legendary: 500, character: 200 };

    if (!gachaCosts[gachaType]) return m.reply('🚫 Pilih gacha yang bener ya, Sensei: normal, rare, epic, legendary, character! 🌟');
    if (user.rpg.gold < gachaCosts[gachaType]) return m.reply(`💰 Gold Sensei kurang nih! Butuh ${gachaCosts[gachaType]} gold buat gacha ${gachaType}! 🌟`);
    if (!user.rpg.hero || !elementToWeaponType[user.rpg.hero]) {
        return m.reply('🚫 Ups, elemen hero Sensei gak valid nih! Coba bikin hero baru pake .genshinimpact create ya! 🌟');
    }

    user.rpg.gold -= gachaCosts[gachaType];
    let result = '';

    if (gachaType === 'character') {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        const roll = Math.random() * 100;
        if (roll < 60) {
            let availableCharacters = genshinCharacters[user.rpg.hero].filter(c => !user.rpg.characters.some(owned => owned.name === c.name));
            if (availableCharacters.length === 0) {
                user.rpg.gold += 50;
                result = `🎉 *Gacha Karakter!* 🎉\nUps, karakter ${user.rpg.hero} udah Sensei miliki semua! 😅\n💰 Dapet 50 Gold sebagai ganti!\n🌟 Sisa Gold: ${user.rpg.gold}`;
            } else {
                let newCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
                user.rpg.characters.push(newCharacter);
                result = `🎉 *Gacha Karakter Berhasil!* 🎉\n👤 Sensei dapet *${newCharacter.name}*!\n❤️ HP: ${newCharacter.hp}\n⚔️ ATK: ${newCharacter.atk}\n🛡️ DEF: ${newCharacter.def}\n✨ Skill: ${newCharacter.skill}\n🌟 Sisa Gold: ${user.rpg.gold}\n💡 Ganti karakter pake .genshinimpact changechar`;
            }
        } else if (roll < 80) {
            user.rpg.gold += 140;
            result = `💰 *Gacha Karakter!* 💰\nWow, Sensei dapet *140 Gold*! Keren banget! 😎\n🌟 Sisa Gold: ${user.rpg.gold}`;
        } else if (roll < 95) {
            let expGain = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
            user.rpg.xp += expGain;
            result = `✨ *Gacha Karakter!* ✨\nSensei dapet *${expGain} XP*! Ayo level up! 🚀\n📊 XP Sekarang: ${user.rpg.xp}/${user.rpg.level * 100}\n🌟 Sisa Gold: ${user.rpg.gold}`;
        } else {
            result = `😅 *Gacha Karakter Zonk!* 😅\nHaha, kayaknya keberuntungan Sensei lagi main petak umpet! 😜\n💪 Coba lagi, siapa tahu dapet jackpot!\n🌟 Sisa Gold: ${user.rpg.gold}`;
        }
    } else {
        const gachaOutcomes = {
            normal: [
                { type: 'zonk', chance: 0.4, message: '💥 Zonk! Sayur kolplay nih, Sensei, coba lagi ya!' },
                { type: 'xp', chance: 0.35, value: Math.floor(Math.random() * 10) + 1, message: '✨ Dapet XP dikit!' },
                { type: 'gold', chance: 0.25, value: Math.min(user.rpg.level <= 5 ? 1 : user.rpg.level <= 10 ? 15 : 25, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold!' }
            ],
            rare: [
                { type: 'zonk', chance: 0.35, message: '💥 Zonk! Apes banget, Sensei, gacha lagi yuk!' },
                { type: 'xp', chance: 0.3, value: Math.floor(Math.random() * 20) + 5, message: '✨ Dapet XP!' },
                { type: 'gold', chance: 0.2, value: Math.min(user.rpg.level <= 5 ? 5 : user.rpg.level <= 10 ? 20 : 40, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold!' },
                { type: 'weapon', chance: 0.15, pool: elementToWeaponType[user.rpg.hero] ? weapons[elementToWeaponType[user.rpg.hero]].rare : weapons.fighter.rare, message: '🗡️ Dapet Weapon Rare!' }
            ],
            epic: [
                { type: 'zonk', chance: 0.3, message: '💥 Zonk! Sabar ya, Sensei, keberuntungan lagi nyanyi!' },
                { type: 'xp', chance: 0.25, value: Math.floor(Math.random() * 50) + 10, message: '✨ Dapet XP lumayan!' },
                { type: 'gold', chance: 0.2, value: Math.min(user.rpg.level <= 5 ? 10 : user.rpg.level <= 10 ? 50 : 100, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold banyak!' },
                { type: 'weapon', chance: 0.25, pool: elementToWeaponType[user.rpg.hero] ? weapons[elementToWeaponType[user.rpg.hero]].epic : weapons.fighter.epic, message: '🗡️ Dapet Weapon Epic!' }
            ],
            legendary: [
                { type: 'zonk', chance: 0.25, message: '💥 Zonk! Hoki Sensei lagi tidur, coba lagi!' },
                { type: 'xp', chance: 0.2, value: Math.floor(Math.random() * 100) + 20, message: '✨ Dapet XP gede!' },
                { type: 'gold', chance: 0.15, value: Math.min(user.rpg.level <= 5 ? 20 : user.rpg.level <= 10 ? 100 : 200, gachaCosts[gachaType] - 1), message: '💰 Dapet Gold melimpah!' },
                { type: 'weapon', chance: 0.4, pool: elementToWeaponType[user.rpg.hero] ? weapons[elementToWeaponType[user.rpg.hero]].legendary : weapons.fighter.legendary, message: '🗡️ Dapet Weapon Legendary!' }
            ]
        };

        const outcomes = gachaOutcomes[gachaType];
        const rand = Math.random();
        let cumulativeChance = 0;
        let outcome;

        for (let i = 0; i < outcomes.length; i++) {
            cumulativeChance += outcomes[i].chance;
            if (rand <= cumulativeChance) {
                outcome = outcomes[i];
                break;
            }
        }

        if (outcome.type === 'xp') {
            user.rpg.xp += outcome.value;
            result = `${outcome.message}\n✨ XP +${outcome.value}\n💰 Sisa Gold: ${user.rpg.gold}`;
        } else if (outcome.type === 'gold') {
            user.rpg.gold += outcome.value;
            result = `${outcome.message}\n💰 Gold +${outcome.value}\n💰 Sisa Gold: ${user.rpg.gold}`;
        } else if (outcome.type === 'weapon') {
            let newWeapon = outcome.pool[Math.floor(Math.random() * outcome.pool.length)];
            user.rpg.inventory.push(newWeapon);
            result = `${outcome.message}\n🗡️ *${newWeapon.name}*\n⚔️ ATK: ${newWeapon.atk}\n🛡️ DEF: ${newWeapon.def}\n💰 Sisa Gold: ${user.rpg.gold}\n✨ Masuk inventory, equip pake .genshinimpact equip ya!`;
        } else {
            result = `${outcome.message}\n💰 Sisa Gold: ${user.rpg.gold}`;
        }
    }

    globalData[m.sender] = user;
    await saveData(globalData);
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: result },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Gacha Result",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: {
                                        url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                    },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });

    if (user.rpg.xp >= user.rpg.level * 100) {
        user.rpg.level += 1;
        user.rpg.xp = 0;
        user.rpg.maxHp += 20;
        user.rpg.hp = user.rpg.maxHp;
        user.rpg.atk += 5;
        user.rpg.def += 3;
        addRandomSkill(user);
        globalData[m.sender] = user;
        await saveData(globalData);
        let levelUp = `🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`;
        let msgLevelUp = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: levelUp },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Level Up",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msgLevelUp.key.remoteJid, msgLevelUp.message, { messageId: msgLevelUp.key.id });
    }
}

    if (command === 'changechar') {
    if (user.rpg.characters.length <= 1) return m.reply('🚫 Sensei cuma punya satu karakter nih! Gacha karakter baru pake .genshinimpact gacha character ya! 🌟');

    let characterName = args.slice(1).join(' ').toLowerCase().trim(); // Ambil semua argumen setelah command
    if (!characterName) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        // Filter karakter yang bukan aktif
        let availableCharacters = user.rpg.characters.filter(c => c.name !== user.rpg.activeCharacter.name);
        if (availableCharacters.length === 0) return m.reply('🚫 Yah, semua karakter udah dipake, Sensei! Gacha lagi yuk pake .genshinimpact gacha character! 🌟');
        let oya = `🌟 Pilih karakter baru buat Sensei!\n\nKarakter yang bisa dipake:\n${availableCharacters.map(c => `👤 ${c.name} (HP: ${c.hp}, ATK: ${c.atk}, DEF: ${c.def})`).join('\n')}`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Ganti Karakter",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Karakter 🌟",
                                        sections: [{
                                            title: "Karakter Tersedia",
                                            highlight_label: "RPG",
                                            rows: availableCharacters.map(c => ({
                                                header: "", 
                                                title: c.name, 
                                                description: `HP: ${c.hp}, ATK: ${c.atk}, DEF: ${c.def}`, 
                                                id: `.genshinimpact changechar ${c.name}`
                                            }))
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    // Normalisasi input dan cari karakter
    let normalizedInput = characterName.replace(/\s+/g, ' ').trim();
    let selectedCharacter = user.rpg.characters.find(c => 
        c.name.toLowerCase() === normalizedInput || 
        c.name.toLowerCase().includes(normalizedInput)
    );

    if (!selectedCharacter) {
        let suggestions = user.rpg.characters
            .filter(c => c.name.toLowerCase().includes(normalizedInput.slice(0, 3)))
            .map(c => c.name)
            .join(', ') || "ga ada saran, cek daftar karakter ya!";
        return m.reply(`🚫 Ups, karakter *${characterName}* gak ketemu, Sensei! 😅 Mungkin maksudnya: ${suggestions}. Atau ketik .genshinimpact changechar buat lihat daftar! 🌟`);
    }

    if (selectedCharacter.name === user.rpg.activeCharacter.name) {
        return m.reply(`🚫 Sensei udah pake *${selectedCharacter.name}* sekarang! Pilih karakter lain yuk, ketik .genshinimpact changechar buat lihat daftar! 🌟`);
    }

    // Simpan stats karakter lama sebelum ganti
    let oldCharacter = user.rpg.activeCharacter;
    if (oldCharacter) {
        oldCharacter.hp = user.rpg.hp;
        oldCharacter.maxHp = user.rpg.maxHp;
        oldCharacter.atk = user.rpg.atk - (user.rpg.equippedWeapon ? user.rpg.equippedWeapon.atk : 0);
        oldCharacter.def = user.rpg.def - (user.rpg.equippedWeapon ? user.rpg.equippedWeapon.def : 0);
    }

    // Update ke karakter baru
    user.rpg.activeCharacter = selectedCharacter;
    user.rpg.hp = selectedCharacter.hp;
    user.rpg.maxHp = selectedCharacter.maxHp;
    user.rpg.atk = selectedCharacter.atk + (user.rpg.equippedWeapon ? user.rpg.equippedWeapon.atk : 0);
    user.rpg.def = selectedCharacter.def + (user.rpg.equippedWeapon ? user.rpg.equippedWeapon.def : 0);
    user.rpg.skills = [selectedCharacter.skill];

    // Update elemen berdasarkan karakter baru
    user.rpg.hero = Object.keys(genshinCharacters).find(key => 
        genshinCharacters[key].some(c => c.name === selectedCharacter.name)
    ) || user.rpg.hero; // Jaga elemen lama kalau gagal deteksi

    globalData[m.sender] = user;
    await saveData(globalData);

    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let result = `🔄 *Karakter Diganti!* 🔄\n👤 Sekarang Sensei pake *${selectedCharacter.name}*\n🔥 Elemen: ${user.rpg.hero.charAt(0).toUpperCase() + user.rpg.hero.slice(1)}\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n✨ Skill: ${user.rpg.skills.join(', ')}\n🌟 Siap lanjut petualangan di Teyvat!`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: result },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Change Character",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: { url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8" },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" },
                                            { header: "", title: "Cek Profil", description: "Liat profil karakter baru", id: ".genshinimpact profile" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

if (command === 'equip') {
    if (user.rpg.inventory.length === 0) return m.reply('🚫 Inventory Sensei kosong nih! Gacha dulu pake .genshinimpact gacha ya! 🌟');
    
    // Ambil semua argumen setelah 'equip' sebagai nama senjata
    let weaponName = args.slice(1).join(' ').toLowerCase().trim();
    if (!weaponName) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🗡️ *Pilih Weapon buat Equip, Sensei!* 🗡️\n\nInventory:\n${user.rpg.inventory.map(w => `${w.name} (ATK: ${w.atk}, DEF: ${w.def})`).join('\n')}`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Equip Weapon",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Pilih Weapon 🌟",
                                        sections: [{
                                            title: "Inventory",
                                            highlight_label: "RPG",
                                            rows: user.rpg.inventory.map(w => ({
                                                header: "", 
                                                title: w.name, 
                                                description: `ATK: ${w.atk}, DEF: ${w.def}`, 
                                                id: `.genshinimpact equip ${w.name}`
                                            }))
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    // Cari senjata dengan nama yang cocok, case-insensitive
    let selectedWeapon = user.rpg.inventory.find(w => w.name.toLowerCase() === weaponName);
    if (!selectedWeapon) {
        // Coba kasih saran kalau nama gak exact match
        let suggestions = user.rpg.inventory
            .filter(w => w.name.toLowerCase().includes(weaponName))
            .map(w => w.name)
            .join(', ') || "gak ada saran, cek inventory ya!";
        return m.reply(`🚫 Weapon *${weaponName}* gak ada di inventory Sensei! 😅 Mungkin maksudnya: ${suggestions}. Cek lagi pake .genshinimpact equip! 🌟`);
    }

    // Lepas senjata yang lagi dipake, kalau ada
    if (user.rpg.equippedWeapon) {
        user.rpg.atk -= user.rpg.equippedWeapon.atk;
        user.rpg.def -= user.rpg.equippedWeapon.def;
        user.rpg.inventory.push(user.rpg.equippedWeapon);
    }

    // Equip senjata baru
    user.rpg.equippedWeapon = selectedWeapon;
    user.rpg.atk += selectedWeapon.atk;
    user.rpg.def += selectedWeapon.def;
    user.rpg.inventory = user.rpg.inventory.filter(w => w.name !== selectedWeapon.name);

    globalData[m.sender] = user;
    await saveData(globalData);
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let result = `🗡️ *Weapon Equipped!* 🗡️\nSensei sekarang pake *${selectedWeapon.name}*\n⚔️ ATK: ${user.rpg.atk} (+${selectedWeapon.atk})\n🛡️ DEF: ${user.rpg.def} (+${selectedWeapon.def})`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: result },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Equip Result",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: {
                                        url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                    },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Kembali ke Menu 🌟",
                                    sections: [{
                                        title: "Menu Utama",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

if (command === 'unequip') {
    // Cek apakah ada weapon yang equipped
    if (!user.rpg.equippedWeapon) return m.reply('🚫 Sensei belum equip weapon nih! Pilih weapon dulu pake .genshinimpact equip ya! 🌟');

    // Cek apakah ini panggilan konfirmasi
    if (args[1] && args[1].toLowerCase() === 'confirm') {
        // Pastikan weapon masih ada (untuk handle double confirm)
        if (!user.rpg.equippedWeapon) return m.reply('🚫 Weapon udah dilepas, Sensei! Ga perlu konfirmasi lagi nih! 😅 Cek profil pake .genshinimpact profile ya! 🌟');

        let removedWeapon = user.rpg.equippedWeapon;
        user.rpg.atk -= removedWeapon.atk;
        user.rpg.def -= removedWeapon.def;
        user.rpg.inventory.push(removedWeapon);
        user.rpg.equippedWeapon = null;

        globalData[m.sender] = user;
        await saveData(globalData);

        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let result = `🗡️ *Weapon Dilepas!* 🗡️\nSensei lepas *${removedWeapon.name}*\n⚔️ ATK sekarang: ${user.rpg.atk}\n🛡️ DEF sekarang: ${user.rpg.def}\n✨ Weapon kembali ke inventory!`;
        let msgConfirm = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: result },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Unequip Result",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msgConfirm.key.remoteJid, msgConfirm.message, { messageId: msgConfirm.key.id });
    } else {
        // Tampilkan pesan konfirmasi hanya kalo belum confirm
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🗡️ *Yakin mau lepas ${user.rpg.equippedWeapon.name}, Sensei?*\n⚔️ ATK bakal berkurang ${user.rpg.equippedWeapon.atk}\n🛡️ DEF bakal berkurang ${user.rpg.equippedWeapon.def}\n\nPilih opsi di bawah ya!`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Unequip Weapon",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Konfirmasi Unequip 🌟",
                                        sections: [{
                                            title: "Opsi",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Ya, Lepas!", description: "Lepas weapon sekarang", id: ".genshinimpact unequip confirm" },
                                                { header: "", title: "Batal", description: "Kembali ke menu", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    }
}

if (command === 'dungeon') {
    // Cek kondisi awal dungeon
    if (user.rpg.hp < user.rpg.maxHp * 0.2) return m.reply('🚫 HP Sensei kurang dari 20% nih! Regen dulu atau topup HP ya! 🌟');
    
    let currentDate = getCurrentDate(user.rpg.timezone);
    if (user.rpg.lastDungeon === currentDate) return m.reply('🚫 Dungeon hari ini udah Sensei taklukin! Tunggu besok jam 00:00 ' + user.rpg.timezone + ' ya! 🌟');

    // Kalo ada argumen 'fight', langsung ke pertarungan
    if (args[1] && args[1].toLowerCase() === 'fight') {
        // Daftar monster: 10 per level, dibagi gampang, sedang, susah
        const monsterPool = {
            low: [
                { name: "Hilichurl Lv", hpBase: 20, atkBase: 5, defBase: 2, xpBase: 10, goldBase: 5 },
                { name: "Slime Lv", hpBase: 15, atkBase: 3, defBase: 1, xpBase: 8, goldBase: 4 },
                { name: "Treasure Hoarder Lv", hpBase: 25, atkBase: 6, defBase: 3, xpBase: 12, goldBase: 6 },
                { name: "Whopperflower Lv", hpBase: 22, atkBase: 4, defBase: 2, xpBase: 9, goldBase: 5 },
                { name: "Specter Lv", hpBase: 18, atkBase: 5, defBase: 1, xpBase: 10, goldBase: 4 },
                { name: "Cicin Lv", hpBase: 16, atkBase: 4, defBase: 1, xpBase: 8, goldBase: 3 },
                { name: "Samachurl Lv", hpBase: 20, atkBase: 6, defBase: 2, xpBase: 11, goldBase: 5 },
                { name: "Blazing Axe Hilichurl Lv", hpBase: 24, atkBase: 7, defBase: 3, xpBase: 12, goldBase: 6 },
                { name: "Mushroom Hound Lv", hpBase: 19, atkBase: 5, defBase: 2, xpBase: 9, goldBase: 4 },
                { name: "Hydro Slime Lv", hpBase: 17, atkBase: 4, defBase: 1, xpBase: 8, goldBase: 3 }
            ],
            mid: [
                { name: "Abyss Mage Lv", hpBase: 50, atkBase: 10, defBase: 5, xpBase: 20, goldBase: 10 },
                { name: "Mitachurl Lv", hpBase: 70, atkBase: 12, defBase: 7, xpBase: 25, goldBase: 12 },
                { name: "Fatui Agent Lv", hpBase: 60, atkBase: 11, defBase: 6, xpBase: 22, goldBase: 11 },
                { name: "Mirror Maiden Lv", hpBase: 55, atkBase: 10, defBase: 5, xpBase: 21, goldBase: 10 },
                { name: "Geovishap Hatchling Lv", hpBase: 65, atkBase: 13, defBase: 8, xpBase: 24, goldBase: 12 },
                { name: "Electro Cicin Mage Lv", hpBase: 52, atkBase: 11, defBase: 5, xpBase: 20, goldBase: 10 },
                { name: "Rock Shield Mitachurl Lv", hpBase: 75, atkBase: 14, defBase: 9, xpBase: 26, goldBase: 13 },
                { name: "Pyro Abyss Mage Lv", hpBase: 58, atkBase: 12, defBase: 6, xpBase: 22, goldBase: 11 },
                { name: "Cryo Regisvine Lv", hpBase: 68, atkBase: 13, defBase: 7, xpBase: 25, goldBase: 12 },
                { name: "Anemo Hypostasis Lv", hpBase: 62, atkBase: 11, defBase: 6, xpBase: 23, goldBase: 11 }
            ],
            high: [
                { name: "Ruin Guard Lv", hpBase: 100, atkBase: 15, defBase: 10, xpBase: 35, goldBase: 18 },
                { name: "Fatui Skirmisher Lv", hpBase: 90, atkBase: 14, defBase: 9, xpBase: 30, goldBase: 15 },
                { name: "Geovishap Lv", hpBase: 120, atkBase: 18, defBase: 12, xpBase: 40, goldBase: 20 },
                { name: "Ruin Hunter Lv", hpBase: 110, atkBase: 16, defBase: 11, xpBase: 38, goldBase: 19 },
                { name: "Thunderhelm Lawachurl Lv", hpBase: 130, atkBase: 20, defBase: 13, xpBase: 45, goldBase: 22 },
                { name: "Oceanid Lv", hpBase: 115, atkBase: 17, defBase: 11, xpBase: 42, goldBase: 21 },
                { name: "Pyro Regisvine Lv", hpBase: 125, atkBase: 19, defBase: 12, xpBase: 43, goldBase: 21 },
                { name: "Electro Hypostasis Lv", hpBase: 105, atkBase: 15, defBase: 10, xpBase: 36, goldBase: 18 },
                { name: "Maguu Kenki Lv", hpBase: 118, atkBase: 18, defBase: 12, xpBase: 41, goldBase: 20 },
                { name: "Stormterror Lv", hpBase: 140, atkBase: 22, defBase: 14, xpBase: 50, goldBase: 25 }
            ]
        };

        // Pilih monster berdasarkan level pemain
        let enemyLevel = Math.max(1, Math.floor(user.rpg.level + (Math.random() * 6 - 3))); // Variasi level musuh
        let pool;
        if (enemyLevel <= 5) pool = monsterPool.low; // Level 1-5: monster gampang
        else if (enemyLevel <= 10) pool = monsterPool.mid; // Level 6-10: monster sedang
        else pool = monsterPool.high; // Level 11+: monster susah

        let monster = pool[Math.floor(Math.random() * pool.length)]; // Pilih 1 dari 10 monster
        let enemy = {
            name: `${monster.name}${enemyLevel}`,
            hp: monster.hpBase * enemyLevel,
            maxHp: monster.hpBase * enemyLevel,
            atk: monster.atkBase * enemyLevel,
            def: monster.defBase * enemyLevel
        };

        let damageToEnemy = Math.max(1, user.rpg.atk - enemy.def);
        let damageToPlayer = Math.max(1, enemy.atk - user.rpg.def);
        let battleLog = `⚔️ *Pertarungan di Dungeon Dimulai!* ⚔️\nSensei (${user.rpg.activeCharacter.name}) vs ${enemy.name}\n\n`;

        while (user.rpg.hp > 0 && enemy.hp > 0) {
            enemy.hp -= damageToEnemy;
            battleLog += `🗡️ Sensei nyerang! ${enemy.name} kehilangan ${damageToEnemy} HP (Sisa: ${Math.max(0, enemy.hp)})\n`;
            if (enemy.hp <= 0) break;
            user.rpg.hp -= damageToPlayer;
            battleLog += `💥 ${enemy.name} balas menyerang! Sensei kehilangan ${damageToPlayer} HP (Sisa: ${Math.max(0, user.rpg.hp)})\n`;
            await sleep(1000);
        }

        let result;
        if (user.rpg.hp > 0) {
            let xpGain = Math.floor(monster.xpBase * enemyLevel + Math.random() * 10);
            let goldGain = Math.floor(monster.goldBase * enemyLevel + Math.random() * 5);
            user.rpg.xp += xpGain;
            user.rpg.gold += goldGain;
            user.rpg.dungeonWins += 1;
            user.rpg.lastDungeon = currentDate; // Set cooldown dungeon
            battleLog += `\n🏆 *Keren, Sensei Menang!* 🏆\n✨ Dapet ${xpGain} XP\n💰 Dapet ${goldGain} Gold\n🏅 Total Dungeon Wins: ${user.rpg.dungeonWins}\n⏳ Dungeon reset jam 00:00 ${user.rpg.timezone}`;
            result = battleLog;
        } else {
            user.rpg.hp = 0;
            user.rpg.lastDungeon = currentDate; // Tetap set cooldown meski kalah
            battleLog += `\n😓 *Yah, Sensei Kalah...* 😓\nTenang, HP bakal regen perlahan! Coba lagi besok jam 00:00 ${user.rpg.timezone}!`;
            result = battleLog;
        }

        globalData[m.sender] = user;
        await saveData(globalData);
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let msgResult = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: result },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Dungeon Result",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msgResult.key.remoteJid, msgResult.message, { messageId: msgResult.key.id });

        if (user.rpg.xp >= user.rpg.level * 100) {
            user.rpg.level += 1;
            user.rpg.xp = 0;
            user.rpg.maxHp += 20;
            user.rpg.hp = user.rpg.maxHp;
            user.rpg.atk += 5;
            user.rpg.def += 3;
            addRandomSkill(user);
            globalData[m.sender] = user;
            await saveData(globalData);
            let levelUp = `🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`;
            let msgLevelUp = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: levelUp },
                                footer: { text: "© Lann4youOfc 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Level Up",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: `${global.namebot}`
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ CastoAyaka - Ai ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Kembali ke Menu 🌟",
                                            sections: [{
                                                title: "Menu Utama",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msgLevelUp.key.remoteJid, msgLevelUp.message, { messageId: msgLevelUp.key.id });
        }
        return; // Keluar dari blok dungeon setelah pertarungan selesai
    }

    // Kalo gak ada argumen 'fight', tampilkan pesan konfirmasi dungeon
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
    let oya = `🏰 *Masuk Dungeon Teyvat, Sensei!*\n\nSiap lawan musuh? Stats Sensei:\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n\nPilih opsi di bawah ya!`;
    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: "© Lann4youOfc 🌟" },
                        header: {
                            title: "",
                            subtitle: "Dungeon",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: {
                                        url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                    },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: `${global.namebot}`
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "[ CastoAyaka - Ai ]",
                                body: "",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Masuk Dungeon 🌟",
                                    sections: [{
                                        title: "Opsi",
                                        highlight_label: "RPG",
                                        rows: [
                                            { header: "", title: "Tantang!", description: "Mulai dungeon sekarang", id: ".genshinimpact dungeon fight" },
                                            { header: "", title: "Batal", description: "Kembali ke menu", id: ".genshinimpact" }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );
    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

if (command === 'quest') {
    let currentDate = getCurrentDate(user.rpg.timezone);

    // Cek apakah quest harian sudah diambil
    if (user.rpg.lastQuest === currentDate) {
        return m.reply('🚫 Quest harian Sensei udah selesai! Tunggu besok ya! 🌟');
    }

    // Tambah state untuk tracking apakah user udah konfirmasi quest
    if (!user.rpg.isQuestConfirmed) user.rpg.isQuestConfirmed = false;

    // Kalo user belum konfirmasi, tampilkan pesan konfirmasi
    if (!user.rpg.isQuestConfirmed && (!args[1] || args[1].toLowerCase() !== 'start')) {
        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let oya = `🌟 *Quest Harian Teyvat!*\n\nSiap ambil tantangan hari ini, Sensei?\n📜 Hadiah: XP, Gold, dan kejutan!\n\nPilih opsi di bawah ya!`;
        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Quest",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Ambil Quest 🌟",
                                        sections: [{
                                            title: "Opsi",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Mulai Quest!", description: "Ambil quest harian sekarang", id: ".genshinimpact quest start" },
                                                { header: "", title: "Batal", description: "Kembali ke menu", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    // Proses quest hanya kalo user udah konfirmasi dengan 'start'
    if (args[1] && args[1].toLowerCase() === 'start') {
        // Set state bahwa user udah konfirmasi
        user.rpg.isQuestConfirmed = true;

        let questTypes = [
            { name: "Kumpulin Bahan", reward: { xp: 30, gold: 20 } },
            { name: "Buruan Hilichurl", reward: { xp: 40, gold: 15 } },
            { name: "Patroli Mondstadt", reward: { xp: 25, gold: 25 } },
            { name: "Bantu Penduduk Liyue", reward: { xp: 35, gold: 18 } }
        ];
        let quest = questTypes[Math.floor(Math.random() * questTypes.length)];
        user.rpg.lastQuest = currentDate;

        // Cek apakah quest gagal (20% peluang)
        let failureChance = Math.random();
        let isFailed = failureChance < 0.2; // 20% chance to fail

        if (isFailed) {
            // Reset state konfirmasi setelah quest selesai (meskipun gagal)
            user.rpg.isQuestConfirmed = false;
            globalData[m.sender] = user;
            await saveData(globalData);

            let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
            let failResult = `💥 *Quest Gagal!* 💥\nSayang banget, Sensei gagal selesain *${quest.name}*.\nJangan sedih ya, coba lagi besok! 🌟`;
            let msgFail = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: failResult },
                                footer: { text: "© Lann4youOfc 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Quest Failed",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: `${global.namebot}`
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ CastoAyaka - Ai ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Kembali ke Menu 🌟",
                                            sections: [{
                                                title: "Menu Utama",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msgFail.key.remoteJid, msgFail.message, { messageId: msgFail.key.id });
            return; // Keluar dari blok biar ga lanjut ke proses sukses
        }

        // Kalo berhasil, kasih reward seperti biasa
        user.rpg.xp += quest.reward.xp;
        user.rpg.gold += quest.reward.gold;

        // Reset state konfirmasi setelah quest selesai
        user.rpg.isQuestConfirmed = false;

        globalData[m.sender] = user;
        await saveData(globalData);

        let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4dovtu");
        let result = `📜 *Quest Harian Selesai!* 📜\nSensei sukses jalani *${quest.name}*\n✨ Dapet ${quest.reward.xp} XP\n💰 Dapet ${quest.reward.gold} Gold\n🌟 Quest berikutnya besok ya!`;
        let msgResult = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: {
                            body: { text: result },
                            footer: { text: "© Lann4youOfc 🌟" },
                            header: {
                                title: "",
                                subtitle: "Quest Result",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000
                                    },
                                    { upload: conn.waUploadToServer }
                                ))
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `${global.namebot}`
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ CastoAyaka - Ai ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                    renderLargerThumbnail: true
                                }
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "Kembali ke Menu 🌟",
                                        sections: [{
                                            title: "Menu Utama",
                                            highlight_label: "RPG",
                                            rows: [
                                                { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                            ]
                                        }]
                                    })
                                }]
                            }
                        }
                    }
                }
            },
            { quoted: m }
        );
        await conn.relayMessage(msgResult.key.remoteJid, msgResult.message, { messageId: msgResult.key.id });

        // Cek level up setelah quest selesai
        if (user.rpg.xp >= user.rpg.level * 100) {
            user.rpg.level += 1;
            user.rpg.xp = 0;
            user.rpg.maxHp += 20;
            user.rpg.hp = user.rpg.maxHp;
            user.rpg.atk += 5;
            user.rpg.def += 3;
            addRandomSkill(user);
            globalData[m.sender] = user;
            await saveData(globalData);
            let levelUp = `🎉 *Level Up!* 🎉\n📊 Sensei sekarang *Level ${user.rpg.level}*\n❤️ HP: ${user.rpg.hp}/${user.rpg.maxHp}\n⚔️ ATK: ${user.rpg.atk}\n🛡️ DEF: ${user.rpg.def}\n🌠 Skill aktif: ${user.rpg.skills.join(', ')}\n⏳ Regen HP jadi tiap ${Math.max(5, 10 - Math.floor((user.rpg.level - 1) * 0.15))} menit!`;
            let msgLevelUp = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                            interactiveMessage: {
                                body: { text: levelUp },
                                footer: { text: "© Lann4youOfc 🌟" },
                                header: {
                                    title: "",
                                    subtitle: "Level Up",
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: {
                                                url: "https://chat.whatsapp.com/JYYgpxQEMLJGuK9vZSwlW8"
                                            },
                                            mimetype: "image/webp",
                                            fileName: `[ Hello ${m.pushName || 'Sensei'} ]`,
                                            pageCount: 2024,
                                            jpegThumbnail: await conn.resize(pp, 400, 400),
                                            fileLength: 2024000
                                        },
                                        { upload: conn.waUploadToServer }
                                    ))
                                },
                                contextInfo: {
                                    forwardingScore: 2024,
                                    isForwarded: true,
                                    mentionedJid: [m.sender],
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: "9999999@newsletter",
                                        serverMessageId: null,
                                        newsletterName: `${global.namebot}`
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: "[ CastoAyaka - Ai ]",
                                        body: "",
                                        mediaType: 1,
                                        sourceUrl: "",
                                        thumbnailUrl: "https://files.catbox.moe/4dovtu",
                                        renderLargerThumbnail: true
                                    }
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Kembali ke Menu 🌟",
                                            sections: [{
                                                title: "Menu Utama",
                                                highlight_label: "RPG",
                                                rows: [
                                                    { header: "", title: "Kembali", description: "Balik ke menu awal", id: ".genshinimpact" }
                                                ]
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            );
            await conn.relayMessage(msgLevelUp.key.remoteJid, msgLevelUp.message, { messageId: msgLevelUp.key.id });
        }
    }
}

};

handler.help = ['genshinimpact'];
handler.tags = ['rpg'];
handler.command = /^(genshinimpact|genshin)$/i;
handler.register = true;
handler.limit = true;
handler.group = true;

export default handler;