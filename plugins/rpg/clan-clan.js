import fs from 'fs';
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

const clanFile = './clan.json';

const defaultClanData = {
  id: '',
  name: '',
  owner: '',
  members: [],
  resources: {
    wood: 0,
    iron: 0,
    diamond: 0,
    rock: 0,
    coal: 0,
    string: 0,
    apple: 0,
    berry: 0,
    meat: 0,
    bone: 0,
    feather: 0,
    skin: 0,
    fang: 0,
    mango: 0,
    banana: 0,
    grape: 0
  },
  artifacts: {
    grimoire: 0,
    scepter: 0,
    crown: 0,
    gemstone: 0,
    cloak: 0,
    spear: 0
  },
  defenseLevel: 1,
  attackLevel: 1,
  exp: 0,
  level: 1,
  aegis: 50,
  basics: 25,
  activityLog: [],
  settings: { approval: false },
  bank: 0,
  profile: null,
  officers: [],
  transferHistory: {},
  alliances: [],
  pendingAlliances: [],
  pendingMembers: [],
  isRaiding: false,
  raidMonster: null,
  raidPeriod: 0,
  raidAllies: [],
  lastRaid: 0,
  campLevel: 1,
  troops: {},
  troopRecovery: {},
  season: 1,
  seasonStart: new Date('2025-04-10').getTime() // Tanggal mulai season pertama
};

const calculateSeason = (currentTime) => {
  const startDate = new Date('2025-04-10').getTime();
  const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // 90 hari
  const timeDiff = currentTime - startDate;
  const seasonNumber = Math.max(1, Math.floor(timeDiff / threeMonths) + 1); // Minimal season 1
  const seasonStart = startDate + (seasonNumber - 1) * threeMonths;
  const seasonEnd = seasonStart + threeMonths;
  return { seasonNumber, seasonStart, seasonEnd };
};

// Fungsi buat reset data season
const resetSeasonData = (clan) => {
  clan.resources = { ...defaultClanData.resources };
  clan.artifacts = { ...defaultClanData.artifacts };
  clan.defenseLevel = 1;
  clan.attackLevel = 1;
  clan.aegis = 50;
  clan.basics = 25;
  clan.bank = 0;
  clan.troops = {};
  clan.troopRecovery = {};
};

const troopTypes = {
  skeleton: { basics: 1, aegis: 2, clanLevel: 1, maxLevel: 5 },
  barbar: { basics: 2, aegis: 3, clanLevel: 5, maxLevel: 6 },
  pemanah: { basics: 2, aegis: 2, clanLevel: 16, maxLevel: 6 },
  balon: { basics: 3, aegis: 4, clanLevel: 25, maxLevel: 5 },
  penyihir: { basics: 4, aegis: 3, clanLevel: 36, maxLevel: 5 },
  bayi_naga: { basics: 5, aegis: 5, clanLevel: 55, maxLevel: 4 },
  pekka: { basics: 6, aegis: 6, clanLevel: 65, maxLevel: 5 },
  naga_elektro: { basics: 7, aegis: 7, clanLevel: 77, maxLevel: 4 },
  titan_elektro: { basics: 8, aegis: 8, clanLevel: 87, maxLevel: 3 },
  golem_es: { basics: 10, aegis: 10, clanLevel: 99, maxLevel: 3 }
};

// Fungsi untuk menghitung batas pasukan berdasarkan level camp
const getMaxTroops = (campLevel) => campLevel * 20;

// Fungsi untuk memeriksa dan memulihkan pasukan
const recoverTroops = (clan, currentTime) => {
  const recoveryTimePerUnit = 60 * 1000; // 1 menit per unit
  for (const type in clan.troopRecovery) {
    const recoveryData = clan.troopRecovery[type];
    if (!recoveryData) continue;
    const unitsToRecover = recoveryData.count;
    const timeElapsed = currentTime - recoveryData.startTime;
    const unitsRecovered = Math.min(unitsToRecover, Math.floor(timeElapsed / recoveryTimePerUnit));
    if (unitsRecovered > 0) {
      clan.troops[type].count += unitsRecovered;
      if (unitsRecovered >= unitsToRecover) {
        delete clan.troopRecovery[type];
      } else {
        clan.troopRecovery[type].count -= unitsRecovered;
        clan.troopRecovery[type].startTime += unitsRecovered * recoveryTimePerUnit;
      }
    }
  }
};

const loadClan = () => {
  try {
    const data = fs.readFileSync(clanFile);
    const parsedData = JSON.parse(data);
    const currentTime = Date.now();

    for (const clanId in parsedData.clans) {
      const clan = parsedData.clans[clanId];
      const { seasonNumber, seasonStart } = calculateSeason(currentTime);

      // Sinkronin struktur data
      const syncNestedObject = (target, defaultObj) => {
        if (!target) return { ...defaultObj };
        for (const key in defaultObj) {
          if (!(key in target)) {
            target[key] = defaultObj[key];
          }
        }
        return target;
      };

      for (const key in defaultClanData) {
        if (!(key in clan)) {
          clan[key] = typeof defaultClanData[key] === 'object' && defaultClanData[key] !== null
            ? { ...defaultClanData[key] }
            : defaultClanData[key];
        } else if (typeof defaultClanData[key] === 'object' && defaultClanData[key] !== null && !Array.isArray(defaultClanData[key])) {
          clan[key] = syncNestedObject(clan[key], defaultClanData[key]);
        }
      }

      // Cek dan reset season kalo perlu
      if (!clan.seasonStart || currentTime >= clan.seasonStart + 3 * 30 * 24 * 60 * 60 * 1000) {
        resetSeasonData(clan);
        clan.season = seasonNumber;
        clan.seasonStart = seasonStart;
      }
    }

    return parsedData;
  } catch (err) {
    console.error('Gagal membaca file clan.json. Mulai dengan data kosong.');
    return { clans: {}, members: {} };
  }
};

// Menyimpan data ke clan.json
const saveClan = (data) => {
  try {
    fs.writeFileSync(clanFile, JSON.stringify(data, null, 2));
    console.log('Data clan berhasil disimpan.');
  } catch (err) {
    console.error('Gagal menyimpan data clan:', err);
  }
};

// Data clan di-load saat server dimulai
let { clans, members } = (() => {
  const data = loadClan();
  return { clans: data.clans, members: data.members };
})();

// Fungsi untuk mencatat aktivitas
const logActivity = (clanId, message) => {
  if (!clans[clanId]) return;
  if (!clans[clanId].activityLog) clans[clanId].activityLog = [];
  clans[clanId].activityLog.push({
    message,
    timestamp: Date.now(),
  });
  if (clans[clanId].activityLog.length > 100) {
    clans[clanId].activityLog.shift(); // Batasi log hingga 100 entri
  }
  saveClan({ clans, members });
};

// Handler utama
let handler = async (m, { text, args, command, isOwner }) => {
  const sender = m.sender;

  if (!args[0]) {
    return m.reply(`
\`F E A T U R E   C L A N\`

*A. Manajemen Clan*
1. *clan create <name>*  
   ╰╼ Membuat clan baru.  
2. *clan profile*  
   ╰╼ Menampilkan profil clan.  
3. *clan private on/off*  
   ╰╼ Mengatur privasi clan agar orang lain tidak bisa masuk.  
4. *clan setprofile*  
   ╰╼ Menambahkan gambar di profil clan.  
5. *clan delprofile*  
   ╰╼ Menghapus gambar di profil clan.  
6. *clan leaderboard*  
   ╰╼ Menampilkan peringkat top clan.  
7. *clan alliance request <id clan>*  
   ╰╼ Ngajak clan lain buat aliansi (Owner only).  
8. *clan alliance accept <id clan>*  
   ╰╼ Nerima ajakan aliansi dari clan lain.  
9. *clan alliance break <id clan>*  
   ╰╼ Mutusin aliansi sama clan tertentu (Owner only).  
10. *clan alliance list*  
   ╰╼ Ngecek daftar aliansi clan kamu (Owner only).
11. *clan rename*  
   ╰╼ Mengganti nama clan.
12. *clan pasukan*  
   ╰╼ Formasi Pasukan.
13. *clan pasukan camp*  
   ╰╼ Lihat isi pasukan.
14. *clan pasukan add*  
   ╰╼ Menambahkan jumlah pasukan.
15. *clan pasukan edit*  
   ╰╼ Mengubah Formasi Pasukan.
16. *clan pasukan up*  
   ╰╼ Upgrade Pasukan.
17. *clan pasukan hapus*  
   ╰╼ Menghapus Pasukan Tertentu.
   
*B. Keanggotaan Clan*
1. *clan join <id>*  
   ╰╼ Bergabung dengan clan.  
2. *clan out*  
   ╰╼ Keluar dari clan.  
3. *clan kick <memberid>*  
   ╰╼ Mengeluarkan anggota dari clan.  
4. *clan member*  
   ╰╼ Melihat daftar anggota clan.  
5. *clan owner @tag*  
   ╰╼ Mentransfer kepemilikan clan.
6. *clan promote @tag*  
   ╰╼ Angkat anggota ke officer.  
7. *clan demote @tag*  
   ╰╼ Turunkan officer ke anggota.  
8. *clan approve @tag*  
   ╰╼ Menyetujui permintaan bergabung.  
9. *clan deny @tag*  
   ╰╼ Menolak permintaan bergabung.  
10. *clan pending*  
   ╰╼ List permintaan bergabung.  

*C. Perang dan Pertahanan*
1. *clan war <id>*  
   ╰╼ Menantang clan lain untuk perang.  
2. *clan repair*  
   ╰╼ Memperbaiki pertahanan yang rusak.  
3. *clan up <type>*  
   ╰╼ Upgrade pertahanan atau serangan clan.  
4. *clan raid*  
   ╰╼ Melawan monster kuat (Hari Minggu only).  
5. *clan raid start*  
   ╰╼ Mulai raid solo.  
6. *clan raid alliance*  
   ╰╼ Ajak aliansi buat raid bareng.  
7. *clan raid lanjut*  
   ╰╼ Lanjut ke periode raid berikutnya.  
8. *clan raid mundur*  
   ╰╼ Mundur dari raid.  

*D. Aktivitas dan Ekonomi Clan*
1. *clan jelajah*  
   ╰╼ Mencari bahan (wood, iron, diamond, dll).  
2. *clan shop buy <barang> <jumlah>*  
   ╰╼ Membeli bahan untuk clan.  
3. *clan transfer <id clan> <item> <jumlah>*  
   ╰╼ Mentransfer barang ke clan lain.  
4. *clan activity*  
   ╰╼ Menampilkan aktivitas seluruh anggota clan.  
5. *clan dungeon*  
   ╰╼ Menjelajahi dungeon untuk mendapatkan reward.  
6. *clan nebang*  
   ╰╼ Menebang kayu. 
7. *clan hunter*
   ╰╼ Berburu Monster. 
8. *clan mining*
   ╰╼ Mining KeGoa. 

*E. Informasi dan Lainnya*
1. *clan list*  
   ╰╼ Menampilkan daftar clan yang ada.
2. *clan pasukan list*  
   ╰╼ Melihat List Pasukan.
    `.trim());
  }

  const subCommand = args[0]?.toLowerCase();
  
  // Cek season sebelum eksekusi perintah
  const currentTime = Date.now();
  const clanId = members[sender];
  if (clanId) {
    const clan = clans[clanId];
    const { seasonNumber, seasonStart } = calculateSeason(currentTime);
    if (clan && currentTime >= clan.seasonStart + 3 * 30 * 24 * 60 * 60 * 1000) {
      resetSeasonData(clan);
      clan.season = seasonNumber;
      clan.seasonStart = seasonStart;
      logActivity(clanId, `Season baru dimulai: Season ${seasonNumber}. Resource, artefak, defense, attack, dan bank direset.`);
      saveClan({ clans, members });
      m.reply(`Season baru dimulai, Senpai! Sekarang Season ${seasonNumber}, semua resource, artefak, defense, attack, sama bank direset.`);
    }
  }

  switch (subCommand) {
    case 'create': {
  if (members[sender]) throw 'Kamu udah di clan, Senpai!';

  const userMoney = global.db.data.users[sender].money;
  const clanCreationCost = 2500000;
  if (userMoney < clanCreationCost) throw 'Uangmu kurang buat bikin clan, Senpai. Butuh 2.5 juta!';

  global.db.data.users[sender].money -= clanCreationCost;

  const clanName = args.slice(1).join(' ').trim();
  if (!clanName) throw 'Nama clan harus diisi, Senpai!\nContoh: .clan create Clan Uchiha';
  if (clanName.length < 3) throw 'Nama clan minimal 3 huruf, Senpai!';
  if (clanName.length > 16) throw 'Nama clan maksimal 16 huruf, Senpai!';
  if (!/^[a-zA-Z0-9 ]+$/.test(clanName)) throw 'Nama clan cuma boleh pake huruf, angka, sama spasi, Senpai! Gak boleh emoji atau simbol lain!';

  const clanId = Math.random().toString(36).slice(2, 8);
  
  const currentTime = Date.now();
  const { seasonNumber, seasonStart } = calculateSeason(currentTime);

  clans[clanId] = {
    ...defaultClanData,
    id: clanId,
    name: clanName,
    owner: sender,
    members: [sender],
    season: seasonNumber,
    seasonStart: seasonStart
  };

  members[sender] = clanId;
  logActivity(clanId, `Clan "${clanName}" dibuat sama ${global.db.data.users[sender]?.name || sender}.`);
  saveClan({ clans, members });
  m.reply(`Clan berhasil dibuat, Senpai!\n\nNama: ${clanName}\nID: ${clanId}\nBiaya 2.5 juta udah dipotong dari uangmu.`);
  break;
}

    case 'profile': {
  if (!members[sender]) {
    return m.reply('Kamu belum bergabung dengan clan, Senpai.\nCari atau buat clan dulu yuk!');
  }
  const clanId = members[sender];
  const clan = clans[clanId];

  // Fungsi untuk menghitung total kontribusi aegis dan basics dari semua pasukan
  const calculateTroopContributions = () => {
    let totalAegis = 0;
    let totalBasics = 0;
    const debugLog = []; // Buat debug, bisa dihapus kalo udah OK
    for (const type in clan.troops) {
      const troop = clan.troops[type];
      // Fallback nilai aegis/basics jika troopTypes gak lengkap
      const troopData = troopTypes[type] || { aegis: 1, basics: 1 };
      const aegisContrib = troopData.aegis * troop.level * troop.count;
      const basicsContrib = troopData.basics * troop.level * troop.count;
      totalAegis += aegisContrib;
      totalBasics += basicsContrib;
      debugLog.push(`${type} (L${troop.level}, ${troop.count}): +${aegisContrib} aegis, +${basicsContrib} basics`);
    }
    // console.log('Debug Troop Contributions:\n' + debugLog.join('\n')); // Uncomment kalo mau debug
    return { totalAegis, totalBasics };
  };
  
  // Fungsi untuk menghitung limit maksimal aegis dan basics
  const getMaxLimits = () => {
    const { totalAegis, totalBasics } = calculateTroopContributions();
    const baseMaxAegis = (clan.defenseLevel || 1) * 50;
    const baseMaxBasics = (clan.attackLevel || 1) * 25;
    const maxAegis = baseMaxAegis + totalAegis;
    const maxBasics = baseMaxBasics + totalBasics;
    // console.log(`Debug Limits: baseAegis=${baseMaxAegis}, troopAegis=${totalAegis}, maxAegis=${maxAegis}`); // Uncomment kalo mau debug
    return { maxAegis, maxBasics };
  };

  // Ambil limit maksimal
  const { maxAegis, maxBasics } = getMaxLimits();

  
  // Koreksi aegis dan basics jika melebihi limit (untuk data lama/bug)
  clan.aegis = Math.max(0, Math.min(clan.aegis || 0, maxAegis));
  clan.basics = Math.max(0, Math.min(clan.basics || 0, maxBasics));
  
  // Pulihkan pasukan yang sedang dalam recovery
  recoverTroops(clan, Date.now());

  // Tambah verifikasi berdasarkan level
  let verifiedBadge = '';
  if (clan.level >= 100) {
    verifiedBadge = '[✅] ';
  } else if (clan.level >= 50) {
    verifiedBadge = '[☑️] ';
  }
  const clanNameWithBadge = `${verifiedBadge}${clan.name}`;

  // Daftar anggota dengan penanganan data pengguna yang hilang
  const memberNames = clan.members && clan.members.length > 0
    ? clan.members
        .map(memberId => {
          const user = global.db.data.users[memberId];
          return `- ${user?.name || memberId || 'Gak diketahui'}`;
        })
        .join('\n')
    : 'Belum ada anggota, Senpai!';

  // Daftar officer dengan penanganan data pengguna yang hilang
  const officerNames = clan.officers && clan.officers.length > 0
    ? clan.officers
        .map(officerId => {
          const user = global.db.data.users[officerId];
          return `- ${user?.name || officerId || 'Gak diketahui'}`;
        })
        .join('\n')
    : 'Belum ada officer, Senpai!';

  // Nama owner dengan penanganan data pengguna yang hilang
  const ownerName = global.db.data.users[clan.owner]?.name || clan.owner || 'Gak diketahui';

  // Daftar artefak
  const artifactEmojis = {
    grimoire: '📜 Grimoire',
    scepter: '⚡ Scepter',
    crown: '👑 Crown',
    gemstone: '💎 Gemstone',
    cloak: '🧥 Cloak',
    spear: '⚔️ Spear',
  };
  const artifacts = clan.artifacts || { grimoire: 0, scepter: 0, crown: 0, gemstone: 0, cloak: 0, spear: 0 };
  const artifactList = Object.keys(artifacts)
    .filter(artifact => artifacts[artifact] > 0)
    .map(artifact => `${artifactEmojis[artifact]} x${artifacts[artifact].toLocaleString('id-ID')}`)
    .join('\n') || 'Belum ada artefak, Senpai!';

  // Daftar aliansi
  const allianceList = clan.alliances && clan.alliances.length > 0
    ? clan.alliances.map(id => `- *${clans[id]?.name || 'Unknown Clan'}* (ID: ${id})`).join('\n')
    : 'Belum ada aliansi, Senpai!';

  // Daftar resource
  const resourceEmojis = {
    wood: '🌲',
    iron: '⛏️',
    diamond: '💎',
    rock: '🪨',
    coal: '🖤',
    string: '🧵',
    apple: '🍎',
    berry: '🫐',
    meat: '🍖',
    bone: '🦴',
    feather: '🪶',
    skin: '🐍',
    fang: '🦷',
    mango: '🥭',
    banana: '🍌',
    grape: '🍇'
  };
  const resourceList = Object.entries(clan.resources || {})
    .filter(([_, qty]) => qty > 0)
    .map(([item, qty]) => `${resourceEmojis[item] || '❓'} ${item}: ${qty.toLocaleString('id-ID')}`)
    .join('\n') || 'Belum ada resource, Senpai!';

  // Hitung sisa hari season
  const currentTime = Date.now();
  const seasonEndTime = clan.seasonStart + 3 * 30 * 24 * 60 * 60 * 1000; // 3 bulan dari seasonStart
  const daysLeft = Math.ceil((seasonEndTime - currentTime) / (24 * 60 * 60 * 1000)); // Konversi ke hari

  // Informasi pasukan
  const maxTroops = getMaxTroops(clan.campLevel);
  let totalTroops = 0;
  const troopList = clan.troops && Object.keys(clan.troops).length > 0
    ? Object.entries(clan.troops).map(([type, data]) => {
        totalTroops += data.count;
        return `- ${type} (Level ${data.level}): ${data.count} pasukan`;
      }).join('\n')
    : 'Belum ada pasukan, Senpai!';

  const recoveringTroops = clan.troopRecovery && Object.keys(clan.troopRecovery).length > 0
    ? Object.entries(clan.troopRecovery).map(([type, data]) => {
        const remainingTime = Math.ceil((data.count * 60 * 1000 - (Date.now() - data.startTime)) / 1000);
        return `- ${type}: ${data.count} pasukan (Sisa waktu: ${Math.floor(remainingTime / 60)} menit ${remainingTime % 60} detik)`;
      }).join('\n')
    : 'Tidak ada pasukan dalam pemulihan, Senpai!';

  // Hitung max defense dan attack
  const maxDefense = clan.defenseLevel * 50;
  const maxAttack = clan.attackLevel * 25;

  const profileCaption = `
\`C L A N   P R O F I L E\`

- 🪪 *Name:* ${clanNameWithBadge}
- 🆔 *ID:* ${clan.id}
- 🌟 *Season:* ${clan.season}
      ╰╼ *End:* ${daysLeft} Days
- 👑 *Leader:* ${ownerName}
- 🎖️ *Officers* (${clan.officers.length.toLocaleString('id-ID')} | 3):\n${officerNames}
- 👥 *Members* (${clan.members.length.toLocaleString('id-ID')} | 15):\n${memberNames}
- 🤝 *Alliances* (${(clan.alliances?.length || 0).toLocaleString('id-ID')} | 3):\n${allianceList}

- 📦 *Resources:*\n${resourceList}
- 🏺 *Artefak:*\n${artifactList}

- 🏕️ *Camp:* Level ${clan.campLevel} (Kapasitas: ${maxTroops})
- ⚔️ *Pasukan Aktif:*\n${troopList}

- 🔄 *Pasukan dalam Pemulihan:*\n${recoveringTroops}

- 🛡️ *Defense:* Level ${clan.defenseLevel.toLocaleString('id-ID')}
      ╰╼ 🌀 *Aegis:* ${clan.aegis.toLocaleString('id-ID')} | ${maxDefense.toLocaleString('id-ID')}
- ⚔️ *Attack:* Level ${clan.attackLevel.toLocaleString('id-ID')}
      ╰╼ 🔪 *Basics:* ${clan.basics.toLocaleString('id-ID')} | ${maxBasics.toLocaleString('id-ID')}
      
- 📈 *Exp:* ${clan.exp} / ${(clan.level * 1000).toLocaleString('id-ID')}
- 🔥 *Level Clan:* ${clan.level.toLocaleString('id-ID')}
- 🏦 *Bank:* Cp. ${clan.bank.toLocaleString('id-ID')}
- 🔒 *Private:* ${clan.settings.approval ? 'ON' : 'OFF'}`.trim();

  if (clan.profile) {
    await conn.sendMessage(m.chat, { image: { url: clan.profile }, caption: profileCaption }, { quoted: m });
  } else {
    m.reply(profileCaption);
  }
  break;
}

    case 'jelajah': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForJelajah = members[sender];
  const clanForJelajah = clans[clanIdForJelajah];

  // Cek apakah pengguna sedang dalam cooldown
  const lastJelajahTime = clanForJelajah.memberCooldowns?.[sender] || 0;
  const cooldownTime = 15 * 60 * 1000; // 15 menit dalam milidetik
  const currentTime = Date.now();

  if (currentTime - lastJelajahTime < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (currentTime - lastJelajahTime)) / 60000);
    throw `Kamu harus menunggu ${remainingTime} menit lagi sebelum dapat melakukan jelajah lagi.`;
  }

  // Update waktu terakhir jelajah untuk member
  clanForJelajah.memberCooldowns = clanForJelajah.memberCooldowns || {};
  clanForJelajah.memberCooldowns[sender] = currentTime;

  // Mendapatkan semua resource dengan jumlah acak
  const resources = ['wood', 'iron', 'diamond', 'rock', 'coal', 'string'];
  
  // Menentukan jumlah bahan yang ditemukan secara acak untuk setiap resource
  let foundResources = {};
  const levelMultiplier = 1 + (clanForJelajah.level * 0.5); // Pengali berdasarkan level clan (50% per level)

  resources.forEach(resource => {
    const baseAmount = Math.floor(Math.random() * 10) + 1; // Mendapatkan 1-10 bahan untuk setiap resource
    foundResources[resource] = Math.ceil(baseAmount * levelMultiplier); // Pendapatan dengan pengali
  });

  // Menghitung pendapatan berdasarkan uang di bank
  const bank = clanForJelajah.bank;
  let minIncome = 10, maxIncome = 15;
  if (bank >= 1000) {
    minIncome = 15;
    maxIncome = 30;
  }
  if (bank >= 5000) {
    minIncome = 30;
    maxIncome = 50;
  }

  const income = Math.ceil((Math.random() * (maxIncome - minIncome + 1) + minIncome) * levelMultiplier);
  clanForJelajah.bank += income; // Menambahkan pendapatan ke bank clan

  // Menambahkan bahan yang ditemukan ke resources clan
  resources.forEach(resource => {
    clanForJelajah.resources[resource] += foundResources[resource];
  });

  // Menambahkan EXP ke clan setelah jelajah
  const baseExp = Math.floor(Math.random() * 10) + 5; // EXP yang diperoleh antara 5 hingga 15
  const expGained = Math.ceil(baseExp * levelMultiplier); // EXP dengan pengali
  clanForJelajah.exp += expGained;

  // Hitung kebutuhan EXP untuk level berikutnya
  const requiredExp = clanForJelajah.level * 1000;

  // Periksa apakah clan naik level
  if (clanForJelajah.exp >= requiredExp) {
    clanForJelajah.exp -= requiredExp; // Sisa EXP diteruskan ke level berikutnya
    clanForJelajah.level++; // Naik level
  }

  m.reply(`\`C L A N   R E S O U R C E S\`\n\n
- 🌲 Wood: ${foundResources.wood}  
- ⛏️ Iron: ${foundResources.iron}  
- 💎 Diamond: ${foundResources.diamond}  
- 🪨 Rock: ${foundResources.rock}  
- 🖤 Coal: ${foundResources.coal}  
- 🧵 String: ${foundResources.string}  

💰 Kamu juga mendapatkan uang sebanyak: Cp. ${income}  

📈 EXP yang didapat: ${expGained}  
🔥 Level Clan: ${clanForJelajah.level} (${clanForJelajah.exp}/${clanForJelajah.level * 1000})`);
   logActivity(clanIdForJelajah, `${global.db.data.users[sender]?.name || sender} melakukan jelajah.`);
  saveClan({ clans, members }); // Simpan perubahan ke Clan
  break;
}

    case 'up': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForUpgrade = members[sender];
  const clanForUpgrade = clans[clanIdForUpgrade];
  const upgradeType = args[1]?.toLowerCase();

  // Kalo ga ada tipe upgrade, tampilin info
  if (!upgradeType) {
    const nextDefenseLevel = clanForUpgrade.defenseLevel + 1;
    const nextAttackLevel = clanForUpgrade.attackLevel + 1;
    const nextCampLevel = clanForUpgrade.campLevel + 1;

    const defenseResources = {
      wood: 5 + 10 * (clanForUpgrade.defenseLevel - 1),
      iron: 5 + 15 * (clanForUpgrade.defenseLevel - 1),
      diamond: 5 + 8 * (clanForUpgrade.defenseLevel - 1),
      rock: 5 + 25 * (clanForUpgrade.defenseLevel - 1),
      coal: 5 + 10 * (clanForUpgrade.defenseLevel - 1),
      string: 5 + 12 * (clanForUpgrade.defenseLevel - 1),
    };

    const attackResources = {
      wood: 10 + 15 * (clanForUpgrade.attackLevel - 1),
      iron: 10 + 20 * (clanForUpgrade.attackLevel - 1),
      diamond: 8 + 12 * (clanForUpgrade.attackLevel - 1),
      rock: 10 + 35 * (clanForUpgrade.attackLevel - 1),
      coal: 8 + 15 * (clanForUpgrade.attackLevel - 1),
      string: 8 + 18 * (clanForUpgrade.attackLevel - 1),
    };

    const campResources = {
      wood: 20 + 20 * (clanForUpgrade.campLevel - 1),
      iron: 15 + 15 * (clanForUpgrade.campLevel - 1),
      diamond: 10 + 10 * (clanForUpgrade.campLevel - 1),
      rock: 30 + 30 * (clanForUpgrade.campLevel - 1),
      coal: 15 + 15 * (clanForUpgrade.campLevel - 1),
      string: 10 + 10 * (clanForUpgrade.campLevel - 1),
    };

    const defenseInfo = `
🛡️ Defense ${clanForUpgrade.defenseLevel} > ${nextDefenseLevel}
*Bahan yang Dibutuhkan:*
- 🌲 Wood: ${defenseResources.wood}
- ⛏️ Iron: ${defenseResources.iron}
- 💎 Diamond: ${defenseResources.diamond}
- 🪨 Rock: ${defenseResources.rock}
- 🖤 Coal: ${defenseResources.coal}
- 🧵 String: ${defenseResources.string}
    `.trim();

    const attackInfo = `
⚔️ Attack ${clanForUpgrade.attackLevel} > ${nextAttackLevel}
*Bahan yang Dibutuhkan:*
- 🌲 Wood: ${attackResources.wood}
- ⛏️ Iron: ${attackResources.iron}
- 💎 Diamond: ${attackResources.diamond}
- 🪨 Rock: ${attackResources.rock}
- 🖤 Coal: ${attackResources.coal}
- 🧵 String: ${attackResources.string}
    `.trim();

    const campInfo = `
🏕️ Camp ${clanForUpgrade.campLevel} > ${nextCampLevel}
*Bahan yang Dibutuhkan:*
- 🌲 Wood: ${campResources.wood}
- ⛏️ Iron: ${campResources.iron}
- 💎 Diamond: ${campResources.diamond}
- 🪨 Rock: ${campResources.rock}
- 🖤 Coal: ${campResources.coal}
- 🧵 String: ${campResources.string}
    `.trim();

    m.reply(`
Gunakan: .clan up <defense/attack/camp>

Contoh Upgrade, Senpai:
${defenseInfo}

${attackInfo}

${campInfo}
    `.trim());
    break;
  }

  if (!['defense', 'attack', 'camp'].includes(upgradeType)) throw 'Upgrade hanya bisa dilakukan pada defense, attack, atau camp.\n> contoh: .clan up defense';

  // Menentukan kebutuhan resources untuk upgrade
  let neededResources = {};
  if (upgradeType === 'defense') {
    neededResources = {
      wood: 5 + 10 * (clanForUpgrade.defenseLevel - 1),
      iron: 5 + 15 * (clanForUpgrade.defenseLevel - 1),
      diamond: 5 + 8 * (clanForUpgrade.defenseLevel - 1),
      rock: 5 + 25 * (clanForUpgrade.defenseLevel - 1),
      coal: 5 + 10 * (clanForUpgrade.defenseLevel - 1),
      string: 5 + 12 * (clanForUpgrade.defenseLevel - 1),
    };
  } else if (upgradeType === 'attack') {
    neededResources = {
      wood: 10 + 15 * (clanForUpgrade.attackLevel - 1),
      iron: 10 + 20 * (clanForUpgrade.attackLevel - 1),
      diamond: 8 + 12 * (clanForUpgrade.attackLevel - 1),
      rock: 10 + 35 * (clanForUpgrade.attackLevel - 1),
      coal: 8 + 15 * (clanForUpgrade.attackLevel - 1),
      string: 8 + 18 * (clanForUpgrade.attackLevel - 1),
    };
  } else if (upgradeType === 'camp') {
    neededResources = {
      wood: 20 + 20 * (clanForUpgrade.campLevel - 1),
      iron: 15 + 15 * (clanForUpgrade.campLevel - 1),
      diamond: 10 + 10 * (clanForUpgrade.campLevel - 1),
      rock: 30 + 30 * (clanForUpgrade.campLevel - 1),
      coal: 15 + 15 * (clanForUpgrade.campLevel - 1),
      string: 10 + 10 * (clanForUpgrade.campLevel - 1),
    };
  }

  // Cek apakah clan punya cukup resource untuk upgrade
  let hasEnoughResources = true;
  let missingResources = '';
  for (let resource in neededResources) {
    const current = clanForUpgrade.resources[resource] || 0;
    const required = neededResources[resource];
    if (current < required) {
      hasEnoughResources = false;
      missingResources += `- ${resource}: ${current}/${required}\n`;
    }
  }

  if (!hasEnoughResources) {
    m.reply(`Kamu tidak memiliki cukup resource untuk upgrade ${upgradeType}.\n\nResource yang masih kurang:\n${missingResources.trim()}`);
    break;
  }

  // Kurangi resource sesuai dengan kebutuhan
  for (let resource in neededResources) {
    clanForUpgrade.resources[resource] -= neededResources[resource];
  }

  // Naikkan level sesuai tipe upgrade
  if (upgradeType === 'defense') {
    clanForUpgrade.defenseLevel += 1;
    clanForUpgrade.aegis = clanForUpgrade.defenseLevel * 50;
  } else if (upgradeType === 'attack') {
    clanForUpgrade.attackLevel += 1;
    clanForUpgrade.basics = 25 + (clanForUpgrade.attackLevel - 1) * 25;
  } else if (upgradeType === 'camp') {
    clanForUpgrade.campLevel += 1;
  }

  logActivity(clanIdForUpgrade, `${global.db.data.users[sender]?.name || sender} meng-upgrade ${upgradeType} clan.`);
  saveClan({ clans, members });
  m.reply(`Berhasil upgrade ${upgradeType}!\nLevel baru: ${clanForUpgrade[`${upgradeType}Level`]} ${upgradeType}`);
  break;
}

    case 'war': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai!';
  const clanIdWar = members[sender];
  const myClan = clans[clanIdWar];

  if (myClan.isInWar) throw 'Clan kamu lagi war, Senpai. Tunggu selesai dulu ya!';
  const lastWarTime = myClan.lastWar || 0;
  const cooldownTime = 10 * 60 * 1000;
  const currentTime = Date.now();
  if (currentTime - lastWarTime < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (currentTime - lastWarTime)) / 60000);
    throw `Clan kamu harus nunggu ${remainingTime} menit lagi sebelum war lagi, Senpai!`;
  }
  if (myClan.aegis <= 0) throw 'Defense clan kamu habis, Senpai! Pakai .clan repair dulu!';

  let opponentClan;
  const targetId = args[1];
  if (targetId) {
    opponentClan = clans[targetId];
    if (!opponentClan) throw 'Clan itu gak ada, Senpai!';
    if (opponentClan.id === clanIdWar) throw 'Gak bisa war sama diri sendiri, Senpai!';
    if (myClan.alliances?.includes(targetId)) throw 'Gak bisa nyerang sekutu, Senpai!'; // Pengecekan aliansi
    if (opponentClan.isInWar || opponentClan.aegis <= 0) throw 'Clan lawan gak bisa di-war, mungkin lagi war atau defense-nya habis!';
  } else {
    const availableClans = Object.values(clans).filter(clan =>
      clan.id !== clanIdWar && !clan.isInWar && (Date.now() - (clan.lastWar || 0)) >= cooldownTime && 
      clan.aegis > 0 && !myClan.alliances?.includes(clan.id) // Jangan pilih sekutu
    );
    if (availableClans.length === 0) throw 'Gak ada lawan yang bisa di-war, Senpai!';
    opponentClan = availableClans[Math.floor(Math.random() * availableClans.length)];
  }

  myClan.isInWar = true;
  opponentClan.isInWar = true;

  const myCurrentAegis = myClan.aegis;
  const myCurrentBasics = myClan.basics;
  const opponentCurrentAegis = opponentClan.aegis;
  const opponentCurrentBasics = opponentClan.basics;

  m.reply(`*⚔️ CLAN WAR ⚔️*

*${myClan.name}* VS *${opponentClan.name}*

📊 Status Awal:

📝 Clan: ${myClan.name}
🛡 Defense (Aegis): ${myCurrentAegis}
⚔️ Attack (Basics): ${myCurrentBasics}

📝 Clan: ${opponentClan.name}
🛡 Defense (Aegis): ${opponentCurrentAegis}
⚔️ Attack (Basics): ${opponentCurrentBasics}

War berlangsung selama 5 menit...`);

  let mAyakagis = myCurrentAegis;
  let opponentAegis = opponentCurrentAegis;

  while (mAyakagis > 0 && opponentAegis > 0) {
    opponentAegis -= myCurrentBasics;
    if (opponentAegis <= 0) break;
    mAyakagis -= opponentCurrentBasics;
  }

  const winner = mAyakagis > 0 ? myClan : opponentClan;
  const loser = winner === myClan ? opponentClan : myClan;

  const winnerExp = Math.floor(Math.random() * 101) + 100;
  const winnerMoney = Math.floor(Math.random() * 201) + 500;
  const loserExpLoss = Math.floor(Math.random() * 41) + 10;
  const loserMoneyLoss = Math.floor(Math.random() * 101) + 100;

  setTimeout(() => {
    winner.exp += winnerExp;
    winner.bank += winnerMoney;
    loser.exp = Math.max(0, loser.exp - loserExpLoss);
    loser.bank = Math.max(0, loser.bank - loserMoneyLoss);

    myClan.aegis = Math.max(0, mAyakagis);
    opponentClan.aegis = Math.max(0, opponentAegis);

    myClan.lastWar = Date.now();
    opponentClan.lastWar = Date.now();

    myClan.isInWar = false;
    opponentClan.isInWar = false;

    saveClan({ clans, members });

    m.reply(`*⚔️ CLAN WAR ⚔️*

🏆 Winner: ${winner.name}
💥 Loser: ${loser.name}

📊 Status Akhir:

📝 ${winner.name}:
⚔️ Attack: ${myCurrentBasics}
🛡 Defense: ${winner.aegis}
🧪 EXP: +${winnerExp}
💰 Bank: +${winnerMoney}

📝 ${loser.name}:
⚔️ Attack: ${opponentCurrentBasics}
🛡 Defense: ${loser.aegis}
🧪 EXP: -${loserExpLoss}
💰 Bank: -${loserMoneyLoss}

🔥 Selamat untuk pemenang!`);
  }, 300000);

  break;
}

  case 'shop': {
  const action = args[1]?.toLowerCase();
  const item = args[2]?.toLowerCase();
  let amount = parseInt(args[3]);

  if (!amount || amount <= 0) {
    amount = 1;
  }

  const pAyakas = { wood: 5, iron: 10, diamond: 20, rock: 5, coal: 5, string: 5 };
  const sellPAyakas = { 
    wood: 2.5, 
    iron: 5, 
    diamond: 10, 
    rock: 2.5, 
    coal: 2.5, 
    string: 2.5, 
    apple: 5, 
    berry: 3, 
    meat: 10, 
    bone: 8,
    feather: 4,
    skin: 6,
    fang: 12,
    mango: 6,
    banana: 4,
    grape: 5
  };
  const artifactPAyakas = { grimoire: 1000, scepter: 1750, crown: 1890, gemstone: 2150, cloak: 2100, spear: 2000 };

  const clanIdShop = members[sender];
  const myClan = clans[clanIdShop];

  if (!myClan) throw 'Kamu gak di clan, Senpai!';

  if (!myClan.artifacts) {
    myClan.artifacts = {
      grimoire: 0,
      scepter: 0,
      crown: 0,
      gemstone: 0,
      cloak: 0,
      spear: 0,
    };
  }

  if (action === 'buy') {
    if (!item) throw 'Gunakan format: .clan shop buy <item> <jumlah>';

    if (!pAyakas[item]) throw 'Item gak ada, Senpai! Pilihan: wood, iron, diamond, rock, coal, string.';
    const pAyaka = pAyakas[item] * amount;

    if (myClan.bank < pAyaka) throw `Bank gak cukup, Senpai. Butuh Cp. ${pAyaka}, cuma punya Cp. ${myClan.bank}.`;

    myClan.bank -= pAyaka;
    myClan.resources[item] = (myClan.resources[item] || 0) + amount;

    logActivity(clanIdShop, `${global.db.data.users[sender]?.name || sender} beli ${amount} ${item} seharga Cp. ${pAyaka}`);
    saveClan({ clans, members });

    m.reply(`Berhasil beli ${amount} ${item} seharga Cp. ${pAyaka}, Senpai!`);
  } else if (action === 'sell') {
    if (!item) throw 'Gunakan format: .clan shop sell <item> <jumlah>';

    let sellPAyaka = 0;

    if (sellPAyakas[item]) {
      if ((myClan.resources[item] || 0) < amount) throw `Gak punya cukup ${item} buat dijual, Senpai!`;
      sellPAyaka = Math.floor(sellPAyakas[item] * amount);
      myClan.resources[item] -= amount;
      myClan.bank += sellPAyaka;

      logActivity(clanIdShop, `${global.db.data.users[sender]?.name || sender} jual ${amount} ${item} seharga Cp. ${sellPAyaka}`);
    } else if (artifactPAyakas[item]) {
      if (myClan.owner !== sender && (!myClan.officers || !myClan.officers.includes(sender))) {
        throw 'Cuma owner atau officer yang bisa jual artefak, Senpai!';
      }

      if ((myClan.artifacts[item] || 0) < amount) {
        throw `Cuma punya ${myClan.artifacts[item]} ${item}, gak cukup buat jual ${amount}, Senpai!`;
      }

      myClan.artifacts[item] -= amount;
      sellPAyaka = artifactPAyakas[item] * amount;
      myClan.bank += sellPAyaka;

      logActivity(clanIdShop, `${global.db.data.users[sender]?.name || sender} jual ${amount} ${item} seharga Cp. ${sellPAyaka}`);
    } else {
      throw 'Item gak ada, Senpai! Pilihan: wood, iron, diamond, rock, coal, string, apple, berry, meat, bone, feather, skin, fang, mango, banana, grape, atau artifact.';
    }

    saveClan({ clans, members });

    m.reply(`Berhasil jual ${amount} ${item} dan dapet Cp. ${sellPAyaka}, Senpai!`);
  } else {
    m.reply(`🛒 \`C L A N   S H O P\` 🛒\n
💲 *Harga bahan (Beli & Jual):*
- 🌲 Wood: Beli Cp. 5, Jual Cp. 2.5  
- ⛏️ Iron: Beli Cp. 10, Jual Cp. 5  
- 💎 Diamond: Beli Cp. 20, Jual Cp. 10  
- 🪨 Rock: Beli Cp. 5, Jual Cp. 2.5  
- 🖤 Coal: Beli Cp. 5, Jual Cp. 2.5  
- 🧵 String: Beli Cp. 5, Jual Cp. 2.5  
- 🍎 Apple: Jual Cp. 5
- 🫐 Berry: Jual Cp. 3
- 🍖 Meat: Jual Cp. 10
- 🦴 Bone: Jual Cp. 8
- 🪶 Feather: Jual Cp. 4
- 🐍 Skin: Jual Cp. 6
- 🦷 Fang: Jual Cp. 12
- 🥭 Mango: Jual Cp. 6
- 🍌 Banana: Jual Cp. 4
- 🍇 Grape: Jual Cp. 5

🎁 *Harga Artefak (Hanya Jual):*
- 📜 Grimoire: Cp. 1000
- ⚡ Scepter: Cp. 1750
- 👑 Crown: Cp. 1890
- 💎 Gemstone: Cp. 2150
- 🧥 Cloak: Cp. 2100
- ⚔️ Spear: Cp. 2000

📌 Gunakan: 
- .clan shop buy <item> <jumlah>
- .clan shop sell <item> <jumlah>`);
  }
  break;
}

    case 'join': {
  if (members[sender]) throw 'Kamu sudah berada di sebuah clan, Senpai!';
  const clanIdJoin = args[1];
  const clan = clans[clanIdJoin];
  if (!clan) throw 'Clan gak ketemu, Senpai. Cek ID-nya!\nKetik .clan list buat liat daftar clan.\nContoh: .clan join 0phtuh';
  
  clan.pendingMembers = clan.pendingMembers || [];

  if (clan.settings.approval) {
    if (clan.pendingMembers.includes(sender)) {
      throw 'Request join kamu udah dikirim, Senpai. Sabar ya, nunggu owner atau officer setujuin!';
    }
    clan.pendingMembers.push(sender);
    logActivity(clanIdJoin, `${global.db.data.users[sender]?.name || sender} minta join clan (pending approval).`);
    saveClan({ clans, members });
    m.reply(`Clan "${clan.name}" private, Senpai! Request join udah dikirim, tunggu owner atau officer setujuin ya.`);
  } else {
    clan.members.push(sender);
    members[sender] = clanIdJoin;
    logActivity(clanIdJoin, `${global.db.data.users[sender]?.name || sender} bergabung ke clan.`);
    saveClan({ clans, members });
    m.reply(`Kamu berhasil gabung ke clan "${clan.name}", Senpai! Selamat datang!`);
  }
  break;
}

    case 'out': {
  const clanIdOut = members[sender];
  if (!clanIdOut) throw 'Kamu tidak berada dalam clan.';
  const clan = clans[clanIdOut];

  // Hapus member dari clan
  clan.members = clan.members.filter((m) => m !== sender);
  delete members[sender];

  // Jika pengguna adalah officer, hapus dari daftar officer
  if (clan.officers?.includes(sender)) {
    clan.officers = clan.officers.filter((officer) => officer !== sender);
  }

  if (clan.owner === sender) {
    if (clan.members.length > 0) {
      // Tetapkan anggota tertua sebagai owner baru
      const newOwner = clan.members[0];
      clan.owner = newOwner;
      m.reply(`Kamu telah keluar dari clan. Kepemilikan clan "${clan.name}" sekarang diberikan kepada @${newOwner.split('@')[0]}.`);
    } else {
      // Hapus clan jika tidak ada anggota
      delete clans[clanIdOut];
      m.reply(`Kamu telah keluar dari clan, dan clan "${clan.name}" telah dihapus karena tidak ada anggota tersisa.`);
    }
  } else {
    m.reply(`Kamu telah keluar dari clan "${clan.name}".`);
  }

   logActivity(clanIdOut, `${global.db.data.users[sender]?.name || sender} keluar dari clan.`);
  saveClan({ clans, members });
  break;
}
  
    case 'private': { // Fitur mengubah pengaturan private
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForPrivate = members[sender];
  const clanForPrivate = clans[clanIdForPrivate];

  // Cek apakah pengirim adalah owner atau officer
  const isOwner = clanForPrivate.owner === sender;
  const isOfficer = clanForPrivate.officers.includes(sender);
  if (!isOwner && !isOfficer) throw 'Hanya owner atau officer clan yang dapat mengubah pengaturan privasi.';

  const toggle = args[1]?.toLowerCase();
  if (!['on', 'off'].includes(toggle)) throw 'Gunakan: .clan private <on/off>';

  clanForPrivate.settings.approval = toggle === 'on';
  saveClan({ clans, members });

  // Tambahkan logActivity
  logActivity(clanIdForPrivate, `${global.db.data.users[sender]?.name || sender} mengubah privasi clan menjadi ${toggle === 'on' ? 'ON (Private)' : 'OFF (Public)'}`);

  m.reply(`Privasi clan berhasil diubah menjadi ${toggle === 'on' ? 'ON (Private)' : 'OFF (Public)'}`);
  break;
}
   
   case 'list': {
  if (Object.keys(clans).length === 0) {
    return m.reply('Belum ada clan yang tersedia.');
  }

  // Ambil semua clan dalam array
  const allClans = Object.values(clans);

  // Acak array clans
  const shuffledClans = allClans.sort(() => Math.random() - 0.5);

  // Ambil maksimal 5 clan
  const displayedClans = shuffledClans.slice(0, 5);

  // Format output
  const clanList = displayedClans
    .map(
      (clan, index) =>
        `${index + 1}. 📝 Clan Name: *${clan.name}*\n🆔 ID: ${clan.id}\n👤 Members: ${clan.members.length} / 15\n🔒 Private: ${clan.settings.approval ? 'ON' : 'OFF'}`
    )
    .join('\n\n');

  m.reply(`
*List Clan (Total: ${Object.keys(clans).length})*
${clanList}
  `.trim());
  break;
}
   
   case 'repair': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForRepair = members[sender];
  const clanForRepair = clans[clanIdForRepair];

  // Pastikan properti clan tersedia
  if (!clanForRepair.resources) clanForRepair.resources = {};
  if (clanForRepair.aegis == null) clanForRepair.aegis = 0; // Inisialisasi Aegis
  if (clanForRepair.defenseLevel == null) clanForRepair.defenseLevel = 1; // Inisialisasi Defense Level

  // Maksimal Aegis berdasarkan level defense
  const maxAegis = clanForRepair.defenseLevel * 50;

  // Nilai Aegis saat ini
  const currentAegis = clanForRepair.aegis;

  // Jika Aegis sudah maksimal
  if (currentAegis >= maxAegis) {
    return m.reply(`Defense clan sudah maksimal:\n- Aegis: ${currentAegis}/${maxAegis}`);
  }

  // Cek resources untuk repair
  const repairCost = {
    wood: 10 * clanForRepair.defenseLevel,
    iron: 5 * clanForRepair.defenseLevel,
    diamond: 2 * clanForRepair.defenseLevel,
    rock: 8 * clanForRepair.defenseLevel,
    coal: 6 * clanForRepair.defenseLevel,
    string: 4 * clanForRepair.defenseLevel,
  };

  // Pastikan resource mencukupi
  let hasEnoughResources = true;
  let missingResources = '';
  for (let resource in repairCost) {
    const available = clanForRepair.resources[resource] || 0;
    const required = repairCost[resource];
    if (available < required) {
      hasEnoughResources = false;
      missingResources += `- ${resource}: ${available}/${required}\n`;
    }
  }

  if (!hasEnoughResources) {
    return m.reply(`Resource tidak mencukupi untuk repair:\n${missingResources}`);
  }

  // Kurangi resource dan perbaiki Aegis
  for (let resource in repairCost) {
    clanForRepair.resources[resource] -= repairCost[resource];
  }
  clanForRepair.aegis = maxAegis; // Perbaiki langsung ke maksimal

  saveClan({ clans, members });
  m.reply(`Defense clan berhasil diperbaiki hingga maksimal:\n- Defense: ${clanForRepair.aegis}/${maxAegis}`);
  break;
}

    case 'kick': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForKick = members[sender];
  const clanForKick = clans[clanIdForKick];

  // Pengecekan apakah sender adalah owner atau officer
  const isOwner = clanForKick.owner === sender;
  const isOfficer = (clanForKick.officers || []).includes(sender);
  if (!isOwner && !isOfficer) {
    throw 'Hanya owner atau officer clan yang dapat mengeluarkan anggota.';
  }

  const memberToKick = args[1]?.replace('@', '').trim(); // Hapus "@" jika ada
  if (!memberToKick) throw 'Gunakan: .clan kick @tag atau .clan kick <nomor ID>';

  // Cari member berdasarkan ID atau @tag
  const targetMember = clanForKick.members.find((m) => m.includes(memberToKick));
  if (!targetMember) throw 'Member tidak ditemukan dalam clan.';

  // Validasi: officer tidak dapat mengeluarkan owner atau sesama officer
  if (targetMember === clanForKick.owner) {
    throw 'Tidak dapat mengeluarkan owner clan.';
  }
  if (isOfficer && (clanForKick.officers || []).includes(targetMember)) {
    throw 'Officer tidak dapat mengeluarkan sesama officer.';
  }

  // Hapus dari daftar officer jika target adalah officer
  clanForKick.officers = clanForKick.officers || [];
  if (clanForKick.officers.includes(targetMember)) {
    clanForKick.officers = clanForKick.officers.filter((id) => id !== targetMember);
  }

  // Mengeluarkan anggota dari clan
  clanForKick.members = clanForKick.members.filter((m) => m !== targetMember);
  delete members[targetMember]; // Hapus data member dari global data

  logActivity(clanIdForKick, `${global.db.data.users[sender]?.name || sender} mengeluarkan @${targetMember.split('@')[0]}`);

  saveClan({ clans, members });
  m.reply(`Berhasil mengeluarkan anggota: @${targetMember.split('@')[0]} dari clan *${clanForKick.name}*.`, null, {
    mentions: [targetMember],
  });
  break;
}
   
   case 'setprofile': {
    if (!members[sender]) throw 'Kamu belum bergabung dengan clan.\nCari atau buat clan terlebih dahulu.';
    
    function formatBytes(bytes) {
        if (bytes === 0) return "0 B";
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
    }

    async function catbox(content) {
        const { ext, mime } = await fileTypeFromBuffer(content) || {};
        if (!ext || !mime || !mime.startsWith('image/')) throw 'Hanya gambar yang diperbolehkan sebagai profil clan.';
        
        const blob = new Blob([content], { type: mime });
        const formData = new FormData();
        const randomBytes = crypto.randomBytes(5).toString("hex");
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", blob, `${randomBytes}.${ext}`);
        
        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw 'Gagal mengunggah file ke Catbox.';
        const url = await response.text();
        return url;
    }

    // Ambil clan terkait
    const clanId = members[sender];
    const clan = clans[clanId];

    if (clan.owner !== sender) throw 'Hanya owner clan yang dapat mengatur profil.';

    // Periksa apakah pengguna mengirim gambar langsung atau mereply gambar
    let media;
    let caption = m.message?.imageMessage?.caption || '';
    if (m.type === 'imageMessage' && m.message.imageMessage) {
        // Jika mengirim gambar langsung dengan caption
        media = await m.download();
    } else if (m.quoted && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')) {
        // Jika mereply gambar
        media = await m.quoted.download();
        caption = m.message?.extendedTextMessage?.text || ''; // Ambil pesan dari reply
    } else {
        throw 'Reply gambar dengan caption "clan setprofile" untuk mengatur gambar profil clan.';
    }

    if (!media) throw 'Gagal mengunduh media. Coba lagi.';
    
    // Ubah gambar menjadi URL
    let profileUrl = await catbox(media);
    if (!profileUrl) throw 'Gagal mengunggah gambar. Coba lagi.';
    
    // Simpan URL sebagai profil clan
    clan.profile = profileUrl;
    clan.profileMessage = caption || 'Tidak ada pesan'; // Tambahkan pesan opsional
    saveClan({ clans, members });

    m.reply(`✅ Profil clan berhasil diperbarui!\n\n*Nama Clan*: ${clan.name}`);
    break;
}

    case 'delprofile': {
    if (!members[sender]) throw 'Kamu belum bergabung dengan clan.\nCari atau buat clan terlebih dahulu.';

    // Ambil clan terkait
    const clanId = members[sender];
    const clan = clans[clanId];

    if (clan.owner !== sender) throw 'Hanya owner clan yang dapat menghapus profil clan.';

    if (!clan.profile) throw 'Clan ini tidak memiliki profil yang diatur.';

    // Hapus profil clan
    delete clan.profile;
    delete clan.profileMessage;
    saveClan({ clans, members });

    m.reply(`✅ Profil clan berhasil dihapus!\n\n*Nama Clan*: ${clan.name}`);
    break;
}

    case 'leaderboard': {
    // Mengambil daftar clan dan menghitung skor total (level + exp)
    const sortedClans = Object.values(clans)
        .map(clan => ({
            ...clan,
            totalScore: clan.level + clan.exp, // Menggabungkan level dan exp
        }))
        .sort((a, b) => b.totalScore - a.totalScore); // Urutkan berdasarkan totalScore

    // Mengambil 5 clan teratas
    const leaderboard = sortedClans.slice(0, 5);

    // Menyiapkan pesan leaderboard
    let leaderboardMessage = '*Clan Leaderboard*\n\n';
leaderboard.forEach((clan, index) => {
    leaderboardMessage += `${index + 1}. 📝 Clan: ${clan.name}\n📊 Level: ${clan.level}\n🧪 Exp: ${clan.exp}\n💯 Total Score: ${clan.totalScore}\n💰 Bank: Cp. ${clan.bank}\n\n`;
});

    // Mengirimkan pesan leaderboard
    m.reply(leaderboardMessage);
    break;
}
    
    case 'member': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.\nCari atau buat clan terlebih dahulu.';
  
  const clanIdForMembers = members[sender];
  const clanForMembers = clans[clanIdForMembers];
  
  if (clanForMembers.members.length === 0) throw 'Clan ini belum memiliki anggota selain kamu.';

  // Dapatkan daftar nama member dan mention user
  const memberMentions = clanForMembers.members.map((m) => {
    const user = global.db.data.users[m];
    const userName = user?.name || 'Tidak diketahui';
    return `@${m.split('@')[0]} - ${userName}`;
  }).join('\n');
  
  // Kirim daftar member dengan mention
  m.reply(`*Anggota Clan:*\n\nTotal Anggota: ${clanForMembers.members.length} | 15\n\n${memberMentions}`, null, {
    mentions: clanForMembers.members,
  });
  break;
}
 
 case 'dungeon': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForDungeon = members[sender];
  const clanForDungeon = clans[clanIdForDungeon];

  if (clanForDungeon.attackLevel < 3 || clanForDungeon.defenseLevel < 3) {
    throw `⚔️ Clan kamu harus memiliki level *Attack* dan *Defense* minimal 3 untuk menjelajahi dungeon. 
Naikkan level Defense dan Attack terlebih dahulu!`;
  }

  const lastCompletedTime = clanForDungeon.dungeonCooldown?.[sender]?.lastCompleted || 0;
  const dungeonCooldown15min = 15 * 60 * 1000; // 15 menit cooldown
  const currentTime = Date.now();

  if (currentTime - lastCompletedTime < dungeonCooldown15min) {
    const remainingTime = Math.ceil((dungeonCooldown15min - (currentTime - lastCompletedTime)) / 1000);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    throw `⏳ Kamu masih kelelahan tunggu dalam *${hours} jam ${minutes} menit ${seconds} detik*.`;
  }

  const resources = {
    iron: '⛏️',
    diamond: '💎',
    rock: '🪨',
    coal: '⛓️',
    string: '🧵'
  };
  const levelMultiplier = 1 + (clanForDungeon.level * 0.5);
  let foundResources = {};

  Object.keys(resources).forEach(resource => {
    const baseAmount = Math.floor(Math.random() * 15) + 5;
    foundResources[resource] = Math.ceil(baseAmount * levelMultiplier);
  });

  const minIncome = 50, maxIncome = 100;
  const income = Math.ceil((Math.random() * (maxIncome - minIncome + 1) + minIncome) * levelMultiplier);

  const artifacts = [
    { name: 'grimoire', emoji: '📜' },
    { name: 'scepter', emoji: '⚡' },
    { name: 'crown', emoji: '👑' },
    { name: 'gemstone', emoji: '💎' },
    { name: 'cloak', emoji: '🧥' },
    { name: 'spear', emoji: '⚔️' }
  ];
  const artifactChance = Math.random() * 100;
  const foundArtifact = artifactChance <= 1
    ? artifacts[Math.floor(Math.random() * artifacts.length)]
    : null;

  const baseExp = Math.floor(Math.random() * 20) + 10;
  const expGained = Math.ceil(baseExp * levelMultiplier);

  let response = `\`D U N G E O N   R E S U L T S\`\n\n`;

  Object.keys(resources).forEach(resource => {
    response += `- ${resources[resource]} ${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${foundResources[resource]}\n`;
  });

  response += `
💰 Bank: Cp. ${income}
📈 EXP: ${expGained}
🔥 Clan Level: ${clanForDungeon.level} (${clanForDungeon.exp}/${clanForDungeon.level * 1000})`;

  if (foundArtifact) {
    response += `\n\n🎉 *You found a rare artifact!*: ${foundArtifact.emoji} ${foundArtifact.name.charAt(0).toUpperCase() + foundArtifact.name.slice(1)}\n`;
    response += `📦 Total ${foundArtifact.name.charAt(0).toUpperCase() + foundArtifact.name.slice(1)}: ${(clanForDungeon.artifacts[foundArtifact.name] || 0) + 1}`;
  }

  conn.reply(m.chat, response, m);

  // Update clan resources and income
  Object.keys(resources).forEach(resource => {
    clanForDungeon.resources[resource] += foundResources[resource];
  });
  clanForDungeon.bank += income;

  // Update artifacts
  clanForDungeon.artifacts = clanForDungeon.artifacts || { 
    grimoire: 0, 
    scepter: 0, 
    crown: 0, 
    gemstone: 0, 
    cloak: 0, 
    spear: 0 
  };
  
  if (foundArtifact) {
    const artifactKey = foundArtifact.name; // Key sesuai nama artefak
    if (clanForDungeon.artifacts[artifactKey] !== undefined) {
      clanForDungeon.artifacts[artifactKey]++;
    }
  }

  // Update experience and level
  clanForDungeon.exp += expGained;
  const requiredExp = clanForDungeon.level * 1000;
  if (clanForDungeon.exp >= requiredExp) {
    clanForDungeon.exp -= requiredExp;
    clanForDungeon.level++;
  }

  // Update dungeon cooldown
  if (!clanForDungeon.dungeonCooldown) clanForDungeon.dungeonCooldown = {};
  clanForDungeon.dungeonCooldown[sender] = {
    lastCompleted: currentTime
  };

  logActivity(clanIdForDungeon, `${global.db.data.users[sender]?.name || sender} menyelesaikan dungeon.`);
  saveClan({ clans, members });

  break;
}

  case 'fix': {
  // Cek apakah user adalah owner bot
  if (!isOwner) throw 'Perintah ini hanya dapat digunakan oleh pemilik bot, Senpai!';

  const subAction = args[1]?.toLowerCase();

  // Kalo ga ada sub-action, kasih daftar opsi
  if (!subAction) {
    m.reply(`
Command Fix, Senpai:
- .clan fix raid (Reset semua data raid di semua clan ke default, termasuk cooldown)
Catatan: Cuma owner bot yang bisa pake ini, hati-hati ya!
    `.trim());
    break;
  }

  switch (subAction) {
    case 'raid': {
      // Reset semua data raid di semua clan
      let resetCount = 0;
      for (const clanId in clans) {
        const clan = clans[clanId];
        if (clan.isRaiding || clan.raidMonster || clan.raidPeriod || clan.raidAllies || clan.lastRaid) {
          clan.isRaiding = false;
          delete clan.raidMonster;
          delete clan.raidPeriod;
          delete clan.raidAllies;
          delete clan.lastRaid;
          resetCount++;
        }
      }

      // Simpan data clan setelah reset
      saveClan({ clans, members });

      // Konfirmasi ke user
      m.reply(`*✅ Data raid di ${resetCount} clan udah direset ke default, Senpai!* Cooldown ilang, semua clan bisa raid lagi dari nol.`);
      break;
    }

    default:
      m.reply('Pilih opsi fix yang bener, Senpai! Ketik .clan fix buat liat daftar.');
      break;
  }
  break;
}

  case 'owner': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForTransfer = members[sender];
  const clanForTransfer = clans[clanIdForTransfer];

  if (clanForTransfer.owner !== sender) throw 'Hanya owner clan yang dapat mentransfer kepemilikan.';

  const targetMemberId = args[1]?.replace('@', '').trim(); // Hapus "@" jika ada
  if (!targetMemberId) throw 'Gunakan: .clan owner @tag atau .clan owner <nomor ID>';

  // Cari target berdasarkan ID atau nomor
  const targetOwner = clanForTransfer.members.find((m) => m.includes(targetMemberId));
  if (!targetOwner) throw 'Pengguna tersebut tidak ditemukan dalam clan.';

  if (targetOwner === sender) throw 'Kamu sudah menjadi owner clan.';

  // Transfer owner ke target
  clanForTransfer.owner = targetOwner;

  saveClan({ clans, members });
  m.reply(`Kepemilikan clan "${clanForTransfer.name}" berhasil ditransfer ke @${targetOwner.split('@')[0]}`, null, { mentions: [targetOwner] });
  break;
}

  case 'transfer': {
  const targetClanId = args[1];
  const item = args[2]?.toLowerCase();
  const amount = parseInt(args[3]);

  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdTf = members[sender];
  const clan = clans[clanIdTf];

  // Pengecekan owner dan officer
  const isOwner = clan.owner === sender; // Pengecekan apakah user adalah owner
  const isOfficer = (clan.officers || []).includes(sender); // Pengecekan apakah user adalah officer

  // Jika bukan owner atau officer, tolak akses
  if (!isOwner && !isOfficer) {
    throw 'Hanya owner atau officer clan yang bisa melakukan transfer.';
  }

  // Daftar item dengan emoji
  const validItemsWithEmoji = {
    wood: '🪵 Wood',
    iron: '🪨 Iron',
    diamond: '💎 Diamond',
    rock: '🪨 Rock',
    coal: '⚫ Coal',
    string: '🧵 String',
    bank: '🏦 Bank',
  };

  // Validasi input
  if (!targetClanId || !item || !amount || amount <= 0 || !Object.keys(validItemsWithEmoji).includes(item)) {
    throw `\`C L A N  T R A N S F E R\`
    
${Object.values(validItemsWithEmoji).join('\n')}
    
Gunakan format: 
.clan transfer <id clan> <item> <jumlah>`;
  }

  const targetClan = clans[targetClanId];
  if (!targetClan) throw 'Clan tujuan tidak ditemukan.';

  // Cek apakah memiliki cukup item
  if (item === 'bank') {
    if (clan.bank < amount) throw 'Saldo bank tidak mencukupi untuk transfer.';
    clan.bank -= amount;
    targetClan.bank = (targetClan.bank || 0) + amount;
  } else {
    clan.resources = clan.resources || {};
    targetClan.resources = targetClan.resources || {};

    if (clan.resources[item] < amount) throw `Kamu tidak memiliki cukup ${validItemsWithEmoji[item]} untuk ditransfer.`;
    clan.resources[item] -= amount;
    targetClan.resources[item] = (targetClan.resources[item] || 0) + amount;
  }

  // Log aktivitas
  logActivity(clanIdTf, `${global.db.data.users[sender]?.name || sender} mentransfer ${amount} ${validItemsWithEmoji[item]} ke clan *${targetClan.name}*`);
  saveClan({ clans, members }); // Simpan perubahan

  m.reply(`Berhasil mentransfer ${amount} ${validItemsWithEmoji[item]} ke clan *${targetClan.name}*.`);
  break;
}

   case 'activity': {
  if (!members[sender]) return m.reply('Kamu belum bergabung dengan clan.');
  const activityClanId = members[sender];
  const activityLog = clans[activityClanId].activityLog || [];
  if (activityLog.length === 0) return m.reply('Belum ada aktivitas dalam clan ini.');
  
  const latestLogs = activityLog.slice(-10).reverse(); // Reverse the order of the last 10 logs
  const formattedLog = latestLogs.map(entry => {
    // Adjust timestamp to WIB (UTC+7)
    const time = new Date(entry.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    return `- [${time}] ${entry.message}`;
  }).join('\n');
  
  m.reply(`*Log Aktivitas Clan (10 Terakhir):*\n${formattedLog}`);
  break;
}
  
  case 'promote': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdPromote = members[sender];
  const clan = clans[clanIdPromote];

  if (!clan) throw 'Clan tidak ditemukan.';
  if (clan.owner !== sender) throw 'Hanya owner clan yang bisa menjadikan seseorang sebagai officer.';

  const targetMemberId = args[1]?.replace('@', '').trim(); // Hapus "@" jika ada
  if (!targetMemberId) throw 'Gunakan: .clan promote @tag atau .clan promote <nomor ID>';

  // Cari target berdasarkan ID atau nomor
  const targetUser = clan.members.find((m) => m.includes(targetMemberId));
  if (!targetUser) throw 'Pengguna tersebut tidak ditemukan dalam clan.';

  // Pastikan pengguna bukan owner
  if (targetUser === sender) throw 'Kamu tidak dapat mempromosikan diri sendiri.';

  // Inisialisasi daftar officer jika belum ada
  clan.officers = clan.officers || [];

  // Cek batas maksimal officer
  if (clan.officers.length >= 3) throw 'Officer dalam clan ini sudah mencapai batas maksimal (3).';

  // Pastikan pengguna belum menjadi officer
  if (clan.officers.includes(targetUser)) throw 'Pengguna tersebut sudah menjadi officer.';

  // Tambahkan pengguna ke daftar officer
  clan.officers.push(targetUser);
  logActivity(clanIdPromote, `${global.db.data.users[sender]?.name || sender} promote @${targetUser.split('@')[0]}`);
  saveClan({ clans, members });

  m.reply(`@${targetUser.split('@')[0]} telah diangkat menjadi officer di clan *${clan.name}*.`, null, {
    mentions: [targetUser],
  });
  break;
}

  case 'nebang': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdForNebang = members[sender];
  const clanForNebang = clans[clanIdForNebang];

  // Cek apakah pengguna sedang dalam cooldown
  const lastNebangTime = clanForNebang.memberCooldownsV2?.[sender] || 0;
  const cooldownTime = 15 * 60 * 1000; // 15 menit dalam milidetik
  const currentTime = Date.now();

  if (currentTime - lastNebangTime < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (currentTime - lastNebangTime)) / 60000);
    throw `Kamu harus menunggu ${remainingTime} menit lagi sebelum dapat melakukan nebang lagi.`;
  }

  // Update waktu terakhir nebang untuk member
  clanForNebang.memberCooldownsV2 = clanForNebang.memberCooldownsV2 || {};
  clanForNebang.memberCooldownsV2[sender] = currentTime;

  // Menentukan hasil sesuai level clan
  const levelMultiplier = 1 + (clanForNebang.level - 1) * 0.5; // Pengali berdasarkan level clan (50% per level)

  const wood = Math.floor((10 + Math.random() * 10) * levelMultiplier); // 10-20 * multiplier
  const strings = Math.floor((10 + Math.random() * 10) * levelMultiplier); // 10-20 * multiplier
  const expGained = Math.floor((10 + Math.random() * 20) * levelMultiplier); // 10-30 * multiplier
  const bankIncome = Math.floor((20 + Math.random() * 30) * levelMultiplier); // 20-50 * multiplier

  // Tambahkan hasil ke resources clan
  clanForNebang.resources.wood = (clanForNebang.resources.wood || 0) + wood;
  clanForNebang.resources.string = (clanForNebang.resources.string || 0) + strings;
  clanForNebang.bank += bankIncome;
  clanForNebang.exp += expGained;

  // Hitung EXP untuk naik level clan
  const requiredExp = clanForNebang.level * 1000;

  // Periksa apakah clan naik level
  if (clanForNebang.exp >= requiredExp) {
    clanForNebang.exp -= requiredExp; // Sisa EXP diteruskan
    clanForNebang.level++; // Naik level
  }

  // Notifikasi hasil ke pemain
  m.reply(`🪵 *Hasil Nebang*
  
  - 🌲 Wood: ${wood}  
  - 🧵 String: ${strings}  
  - 💰 Bank Clan: ${bankIncome}  
  - ⭐ EXP: ${expGained}  

🔥 *Level Clan*: ${clanForNebang.level} (${clanForNebang.exp}/${requiredExp})`);

  // Log aktivitas dan simpan data clan
  logActivity(clanIdForNebang, `${global.db.data.users[sender]?.name || sender} melakukan nebang.`);
  saveClan({ clans, members });

  break;
}

  case 'hunter': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai. Gabung dulu yuk!';
  const clanId = members[sender];
  const myClan = clans[clanId];

  const user = global.db.data.users[sender] || {};
  const lastHunt = user.lastHunt || 0;
  const cooldownTime = 60 * 60 * 1000;
  const currentTime = Date.now();
  if (currentTime - lastHunt < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (currentTime - lastHunt)) / 60000);
    throw `Kamu harus nunggu ${remainingTime} menit lagi sebelum berburu lagi, Senpai!`;
  }

  const targets = [
    { name: 'Serigala', drops: ['meat', 'bone', 'fang'], chance: 0.4, emoji: '🐺' },
    { name: 'Rusa', drops: ['meat', 'bone', 'skin'], chance: 0.3, emoji: '🦌' },
    { name: 'Beruang', drops: ['meat', 'bone', 'skin'], chance: 0.2, emoji: '🐻' },
    { name: 'Kelinci', drops: ['meat', 'bone'], chance: 0.5, emoji: '🐰' },
    { name: 'Pohon Apel', drops: ['apple', 'berry'], chance: 0.6, emoji: '🌳🍎' },
    { name: 'Babi', drops: ['meat', 'skin'], chance: 0.4, emoji: '🐷' },
    { name: 'Ayam', drops: ['meat', 'feather'], chance: 0.5, emoji: '🐔' },
    { name: 'Ular', drops: ['skin', 'fang'], chance: 0.3, emoji: '🐍' },
    { name: 'Harimau', drops: ['meat', 'fang', 'skin'], chance: 0.2, emoji: '🐅' },
    { name: 'Pohon Mangga', drops: ['mango', 'banana'], chance: 0.5, emoji: '🌴🥭' },
    { name: 'Pohon Anggur', drops: ['grape', 'berry'], chance: 0.4, emoji: '🍇🌿' }
  ];

  const target = targets.find(t => Math.random() < t.chance) || targets[0];
  
  const drops = {};
  target.drops.forEach(item => {
    drops[item] = Math.floor(Math.random() * 50) + 1;
  });

  const expGained = Math.floor(Math.random() * 151) + 50;
  const cpGained = Math.floor(Math.random() * 401) + 100;

  // Kurangi pasukan secara acak jika ada
  const troopLossChance = 0.3; // 30% peluang kehilangan pasukan
  let troopLossMessage = '';
  if (myClan.troops && Object.keys(myClan.troops).length > 0 && Math.random() < troopLossChance) {
    const availableTroops = Object.keys(myClan.troops).filter(type => myClan.troops[type].count > 0);
    if (availableTroops.length > 0) {
      const randomTroop = availableTroops[Math.floor(Math.random() * availableTroops.length)];
      const lossAmount = Math.min(myClan.troops[randomTroop].count, Math.floor(Math.random() * 5) + 1);
      myClan.troops[randomTroop].count -= lossAmount;
      myClan.troopRecovery[randomTroop] = {
        count: lossAmount,
        startTime: currentTime
      };
      troopLossMessage = `\n⚠️ Kehilangan ${lossAmount} ${randomTroop} dalam perburuan! Pemulihan dimulai.`;
    }
  }

  for (const item in drops) {
    myClan.resources[item] = (myClan.resources[item] || 0) + drops[item];
  }
  myClan.exp = (myClan.exp || 0) + expGained;
  myClan.bank = (myClan.bank || 0) + cpGained;
  
  user.lastHunt = currentTime;
  global.db.data.users[sender] = user;

  const expNeeded = myClan.level * 1000;
  if (myClan.exp >= expNeeded) {
    myClan.level += 1;
    myClan.exp -= expNeeded;
    myClan.aegis = Math.min(myClan.aegis + 50, myClan.defenseLevel * 50);
    myClan.basics = Math.min(myClan.basics + 25, myClan.attackLevel * 25);
  }

  const dropLog = Object.entries(drops).map(([item, qty]) => `${item}: ${qty}`).join(', ');
  logActivity(clanId, `${global.db.data.users[sender]?.name || sender} melakukan berburu ${target.name}`);
  saveClan({ clans, members });

  const itemEmojis = {
    meat: '🍖',
    bone: '🦴',
    fang: '🦷',
    skin: '🐍',
    feather: '🪶',
    apple: '🍎',
    berry: '🫐',
    mango: '🥭',
    banana: '🍌',
    grape: '🍇'
  };

  const dropList = Object.entries(drops)
    .map(([item, qty]) => `${itemEmojis[item]} ${item}: ${qty}`)
    .join('\n');

  const huntDisplay = `
\`H U N T   R E S U L T S\`
${target.emoji} *${target.name}*

${dropList}

💰 Bank: Cp. ${cpGained}
📈 EXP: ${expGained}
🔥 Clan Level: ${myClan.level} (${myClan.exp}/${myClan.level * 1000})
${troopLossMessage}
  `.trim();

  m.reply(huntDisplay);
  break;
}

  case 'mining': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai. Gabung dulu yuk!';
  const clanId = members[sender];
  const myClan = clans[clanId];

  const user = global.db.data.users[sender] || {};
  const lastMine = user.lastMine || 0;
  const cooldownTime = 60 * 60 * 1000;
  const currentTime = Date.now();
  if (currentTime - lastMine < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (currentTime - lastMine)) / 60000);
    throw `Kamu harus nunggu ${remainingTime} menit lagi sebelum nambang lagi, Senpai!`;
  }

  const miningSpots = [
    { name: 'Hutan', drops: ['wood', 'string'], chance: 0.9, emoji: '🌲' },
    { name: 'Tambang Batu', drops: ['rock', 'coal'], chance: 0.8, emoji: '⛏️🪨' },
    { name: 'Tambang Besi', drops: ['iron', 'rock'], chance: 0.6, emoji: '⛏️⚙️' },
    { name: 'Tambang Batubara', drops: ['coal', 'rock'], chance: 0.7, emoji: '⛏️🖤' },
    { name: 'Tambang Berlian', drops: ['diamond', 'rock'], chance: 0.3, emoji: '⛏️💎' }
  ];

  const spot = miningSpots.find(s => Math.random() < s.chance) || miningSpots[0];
  
  const drops = {};
  spot.drops.forEach(item => {
    if (item === 'wood') {
      drops[item] = Math.floor(Math.random() * 21) + 5;
    } else if (item === 'diamond') {
      drops[item] = Math.floor(Math.random() * 7) + 1;
    } else {
      drops[item] = Math.floor(Math.random() * 81) + 20;
    }
  });

  const expGained = Math.floor(Math.random() * 151) + 50;
  const cpGained = Math.floor(Math.random() * 401) + 100;

  for (const item in drops) {
    myClan.resources[item] = (myClan.resources[item] || 0) + drops[item];
  }
  myClan.exp = (myClan.exp || 0) + expGained;
  myClan.bank = (myClan.bank || 0) + cpGained;
  
  user.lastMine = currentTime;
  global.db.data.users[sender] = user;

  const expNeeded = myClan.level * 1000;
  if (myClan.exp >= expNeeded) {
    myClan.level += 1;
    myClan.exp -= expNeeded;
    myClan.aegis = Math.min(myClan.aegis + 50, myClan.defenseLevel * 50);
    myClan.basics = Math.min(myClan.basics + 25, myClan.attackLevel * 25);
  }

  const dropLog = Object.entries(drops).map(([item, qty]) => `${item}: ${qty}`).join(', ');
  logActivity(clanId, `${global.db.data.users[sender]?.name || sender} melakukan nambang di ${spot.name}`);
  saveClan({ clans, members });

  const itemEmojis = {
    wood: '🌲',
    iron: '⛏️',
    diamond: '💎',
    rock: '🪨',
    coal: '🖤',
    string: '🧵'
  };

  const dropList = Object.entries(drops)
    .map(([item, qty]) => `${itemEmojis[item]} ${item}: ${qty}`)
    .join('\n');

  const mineDisplay = `
\`M I N I N G   R E S U L T S\`
${spot.emoji} *${spot.name}*

${dropList}

💰 Bank: Cp. ${cpGained}
📈 EXP: ${expGained}
🔥 Clan Level: ${myClan.level} (${myClan.exp}/${myClan.level * 1000})
  `.trim();

  m.reply(mineDisplay);
  break;
}
  
  case 'demote': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan.';
  const clanIdDemote = members[sender];
  const clan = clans[clanIdDemote];

  if (!clan) throw 'Clan tidak ditemukan.';
  if (clan.owner !== sender) throw 'Hanya owner clan yang bisa menurunkan officer menjadi anggota.';

  const targetMemberId = args[1]?.replace('@', '').trim(); // Hapus "@" jika ada
  if (!targetMemberId) throw 'Gunakan: .clan demote @tag atau .clan demote <nomor ID>';

  // Cari target berdasarkan ID atau nomor
  const targetUser = clan.officers.find((m) => m.includes(targetMemberId));
  if (!targetUser) throw 'Pengguna tersebut tidak ditemukan atau bukan seorang officer.';

  // Hapus pengguna dari daftar officer
  clan.officers = clan.officers.filter((id) => id !== targetUser);
  logActivity(clanIdDemote, `${global.db.data.users[sender]?.name || sender} demote @${targetUser.split('@')[0]}`);
  saveClan({ clans, members });

  m.reply(`@${targetUser.split('@')[0]} telah diturunkan jabatannya menjadi anggota biasa di clan *${clan.name}*.`, null, {
    mentions: [targetUser],
  });
  break;
}

case 'rename': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai!';
  const clanIdRename = members[sender];
  const clan = clans[clanIdRename];

  if (clan.owner !== sender) throw 'Cuma owner clan yang bisa ganti nama clan, Senpai!';

  const newName = args.slice(1).join(' ').trim();
  if (!newName) throw 'Masukin nama baru buat clan, Senpai!\nContoh: .clan rename Clan Baru';
  if (newName.length < 3) throw 'Nama clan minimal 3 huruf, Senpai!';
  if (newName.length > 16) throw 'Nama clan maksimal 16 huruf, Senpai!';
  if (!/^[a-zA-Z0-9 ]+$/.test(newName)) throw 'Nama clan cuma boleh pake huruf, angka, sama spasi, Senpai! Gak boleh emoji atau simbol lain!';

  const renameCost = 1000;
  if (clan.bank < renameCost) throw `Uang di bank clan kurang, Senpai! Butuh Cp. ${renameCost}, cuma ada Cp. ${clan.bank}.`;

  clan.bank -= renameCost; // Kurangin uang dari bank clan
  const oldName = clan.name;
  clan.name = newName;
  logActivity(clanIdRename, `${global.db.data.users[sender]?.name || sender} ganti nama clan dari "${oldName}" jadi "${newName}" dengan biaya Cp. ${renameCost}.`);
  saveClan({ clans, members });

  m.reply(`Nama clan berhasil diganti dari "${oldName}" jadi "${newName}" dengan biaya Cp. ${renameCost}, Senpai! Sisa bank: Cp. ${clan.bank}.`);
  break;
}

case 'pending': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai!';
  const clanIdPending = members[sender];
  const clan = clans[clanIdPending];

  // Cek apakah clan ada
  if (!clan) throw 'Clan kamu gak ketemu, Senpai! Mungkin ada masalah sama data clan.';

  const isOwner = clan.owner === sender;
  const isOfficer = (clan.officers || []).includes(sender);
  if (!isOwner && !isOfficer) throw 'Cuma owner atau officer yang bisa lihat daftar pending, Senpai!';

  // Pastiin pendingMembers adalah array
  if (!Array.isArray(clan.pendingMembers)) {
    clan.pendingMembers = []; // Reset jadi array kosong kalo bukan array
    saveClan({ clans, members }); // Simpan perubahan biar konsisten
  }

  if (clan.pendingMembers.length === 0) {
    m.reply(`Gak ada yang nunggu approval di clan "${clan.name}", Senpai!`);
    break;
  }

  const pendingList = clan.pendingMembers
    .map((id, index) => `${index + 1}. @${id.split('@')[0]} - ${global.db.data.users[id]?.name || 'Gak diketahui'}`)
    .join('\n');

  m.reply(`
\`P E N D I N G   M E M B E R S\`

Clan: *${clan.name}*
Total Pending: ${clan.pendingMembers.length}

${pendingList}

Gunakan:
- .clan approve @tag/<ID> buat nerima
- .clan deny @tag/<ID> buat nolak
  `.trim(), null, { mentions: clan.pendingMembers });
  break;
}
case 'approve': {
  if (!members[sender]) throw 'Kamu belum di clan, Senpai!';
  const clanIdApprove = members[sender];
  const clan = clans[clanIdApprove];

  const isOwner = clan.owner === sender;
  const isOfficer = (clan.officers || []).includes(sender);
  if (!isOwner && !isOfficer) throw 'Cuma owner atau officer yang bisa nerima member, Senpai!';

  const targetMemberId = args[1]?.replace('@', '').trim();
  if (!targetMemberId) throw 'Gunakan: .clan approve @tag atau .clan approve <nomor ID>';

  clan.pendingMembers = clan.pendingMembers || [];
  const targetUser = clan.pendingMembers.find(m => m.includes(targetMemberId));
  if (!targetUser) throw 'Orang itu gak ada di daftar pending, Senpai!';

  clan.members.push(targetUser);
  members[targetUser] = clanIdApprove;
  clan.pendingMembers = clan.pendingMembers.filter(m => m !== targetUser);
  logActivity(clanIdApprove, `${global.db.data.users[sender]?.name || sender} nerima ${global.db.data.users[targetUser]?.name || targetUser} ke clan.`);
  saveClan({ clans, members });
  m.reply(`@${targetUser.split('@')[0]} berhasil diterima ke clan "${clan.name}", Senpai!`, null, { mentions: [targetUser] });
  break;
}

case 'deny': {
  if (!members[sender]) throw 'Kamu belum di clan, Senpai!';
  const clanIdDeny = members[sender];
  const clan = clans[clanIdDeny];

  const isOwner = clan.owner === sender;
  const isOfficer = (clan.officers || []).includes(sender);
  if (!isOwner && !isOfficer) throw 'Cuma owner atau officer yang bisa nolak member, Senpai!';

  const targetMemberId = args[1]?.replace('@', '').trim();
  if (!targetMemberId) throw 'Gunakan: .clan deny @tag atau .clan deny <nomor ID>';

  clan.pendingMembers = clan.pendingMembers || [];
  const targetUser = clan.pendingMembers.find(m => m.includes(targetMemberId));
  if (!targetUser) throw 'Orang itu gak ada di daftar pending, Senpai!';

  clan.pendingMembers = clan.pendingMembers.filter(m => m !== targetUser);
  logActivity(clanIdDeny, `${global.db.data.users[sender]?.name || sender} nolak ${global.db.data.users[targetUser]?.name || targetUser} join clan.`);
  saveClan({ clans, members });
  m.reply(`Request join @${targetUser.split('@')[0]} ditolak dari clan "${clan.name}", Senpai!`, null, { mentions: [targetUser] });
  break;
}

  case 'alliance': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai. Gabung dulu yuk!';
  const clanId = members[sender];
  const myClan = clans[clanId];

  // Cek apakah sender adalah owner atau officer
  const isOwner = myClan.owner === sender;
  const isOfficer = (myClan.officers || []).includes(sender);
  if (!isOwner && !isOfficer) throw 'Cuma owner atau officer yang bisa ngatur aliansi, Senpai!';

  const action = args[1]?.toLowerCase();
  if (!action) {
    return m.reply(`
*Aliansi Clan*
- *clan alliance request <id clan>*  
   ╰╼ Ngajak clan lain buat aliansi (Owner only).  
- *clan alliance accept <id clan>*  
   ╰╼ Nerima ajakan aliansi dari clan lain.  
- *clan alliance break <id clan>*  
   ╰╼ Mutusin aliansi sama clan tertentu (Owner only).  
- *clan alliance list*  
   ╰╼ Ngecek daftar aliansi clan kamu (Owner only).
    `.trim());
  }

  // Inisialisasi daftar pending alliances kalau belum ada
  if (!myClan.pendingAlliances) myClan.pendingAlliances = [];

  switch (action) {
    case 'request': {
      // Hanya owner yang boleh request
      if (!isOwner) throw 'Cuma owner yang bisa ngajak aliansi, Senpai!';
      
      const targetClanId = args[2];
      if (!targetClanId) throw 'Masukin ID clan yang mau diajak aliansi, Senpai! Contoh: .clan alliance request abc123';
      const targetClan = clans[targetClanId];
      if (!targetClan) throw 'Clan itu ga ada, Senpai. Cek lagi ID-nya!';
      if (targetClanId === clanId) throw 'Gak bisa aliansi sama diri sendiri, Senpai!';
      if (myClan.alliances.includes(targetClanId)) throw 'Udah aliansi sama clan itu, Senpai!';
      if (myClan.pendingAlliances.includes(targetClanId)) throw 'Udah ngirim request ke clan itu, tunggu diterima ya, Senpai!';
      if (myClan.alliances.length >= 3) throw 'Aliansi clan kamu udah penuh (maksimal 3), Senpai!';

      // Tambahin ke pending alliances clan tujuan
      if (!targetClan.pendingAlliances) targetClan.pendingAlliances = [];
      if (!targetClan.pendingAlliances.includes(clanId)) {
        targetClan.pendingAlliances.push(clanId);
        logActivity(clanId, `${global.db.data.users[sender]?.name || sender} ngirim request aliansi ke clan *${targetClan.name}*.`);
        logActivity(targetClanId, `Clan *${myClan.name}* ngirim request aliansi.`);
        saveClan({ clans, members });
        m.reply(`Request aliansi udah dikirim ke clan *${targetClan.name}*, Senpai! Tunggu mereka nerima ya.`);
      } else {
        throw 'Clan itu udah ngirim request ke kamu, Senpai. Cek pake .clan alliance accept!';
      }
      break;
    }

    case 'accept': {
      // Owner dan officer boleh nerima
      const targetClanId = args[2];
      if (!targetClanId) throw 'Masukin ID clan yang mau diterima aliansinya, Senpai! Contoh: .clan alliance accept abc123';
      const targetClan = clans[targetClanId];
      if (!targetClan) throw 'Clan itu ga ada, Senpai. Cek lagi ID-nya!';
      if (!myClan.pendingAlliances.includes(targetClanId)) throw 'Clan itu ga ngirim request aliansi ke kamu, Senpai!';
      if (myClan.alliances.length >= 3) throw 'Aliansi clan kamu udah penuh (maksimal 3), Senpai!';

      // Tambahin aliansi dua arah
      myClan.alliances.push(targetClanId);
      targetClan.alliances.push(clanId);

      // Hapus dari pending
      myClan.pendingAlliances = myClan.pendingAlliances.filter(id => id !== targetClanId);
      targetClan.pendingAlliances = targetClan.pendingAlliances.filter(id => id !== clanId);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} nerima aliansi dari clan *${targetClan.name}*.`);
      logActivity(targetClanId, `Clan *${myClan.name}* nerima request aliansi.`);
      saveClan({ clans, members });
      m.reply(`Aliansi sama clan *${targetClan.name}* berhasil dibentuk, Senpai! Sekarang kalian sekutu.`);
      break;
    }

    case 'break': {
      // Hanya owner yang boleh break
      if (!isOwner) throw 'Cuma owner yang bisa mutusin aliansi, Senpai!';
      
      const targetClanId = args[2];
      if (!targetClanId) throw 'Masukin ID clan yang mau diputus aliansinya, Senpai! Contoh: .clan alliance break abc123';
      const targetClan = clans[targetClanId];
      if (!targetClan) throw 'Clan itu ga ada, Senpai. Cek lagi ID-nya!';
      if (!myClan.alliances.includes(targetClanId)) throw 'Kamu ga punya aliansi sama clan itu, Senpai!';

      // Hapus aliansi dua arah
      myClan.alliances = myClan.alliances.filter(id => id !== targetClanId);
      targetClan.alliances = targetClan.alliances.filter(id => id !== clanId);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} mutusin aliansi sama clan *${targetClan.name}*.`);
      logActivity(targetClanId, `Clan *${myClan.name}* mutusin aliansi.`);
      saveClan({ clans, members });
      m.reply(`Aliansi sama clan *${targetClan.name}* udah diputus, Senpai! Sekarang kalian bukan sekutu lagi.`);
      break;
    }

    case 'list': {
      // Hanya owner yang boleh lihat list
      if (!isOwner) throw 'Cuma owner yang bisa cek daftar aliansi, Senpai!';
      
      const allianceList = myClan.alliances.length > 0
        ? myClan.alliances.map(id => `- *${clans[id].name}* (ID: ${id})`).join('\n')
        : 'Belum ada aliansi, Senpai!';
      const pendingList = myClan.pendingAlliances.length > 0
        ? myClan.pendingAlliances.map(id => `- *${clans[id].name}* (ID: ${id})`).join('\n')
        : 'Belum ada request masuk, Senpai!';
      m.reply(`
*Aliansi Clan: ${myClan.name}*
- Total Aliansi: ${myClan.alliances.length}/3
- Daftar Sekutu:
${allianceList}

*Pending Requests:*
${pendingList}
      `.trim());
      break;
    }

    default:
      m.reply('Pilih action yang bener ya, Senpai! Ketik .clan alliance buat liat opsi.');
      break;
  }
  break;
}

case 'raid': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai!';
  const clanIdRaid = members[sender];
  const clan = clans[clanIdRaid];

  const isOwner = clan.owner === sender;
  const isOfficer = (clan.officers || []).includes(sender);
  if (!isOwner && !isOfficer) throw 'Cuma owner atau officer yang bisa pake fitur raid, Senpai!';

  const subAction = args[1]?.toLowerCase();

  // Kalo ga ada sub-action, cuma tampilin daftar command
  if (!subAction) {
    m.reply(`
Command Raid, Senpai:
- .clan raid start (Mulai persiapan raid)
- .clan raid alliance <id clan> (Ajak aliansi tertentu)
- .clan raid lanjut (Setuju lanjut atau cek hasil)
- .clan raid mundur (Mundur dari raid)
Catatan: Raid cuma di hari Minggu, semua clan harus setuju buat mulai!
    `.trim());
    break;
  }

  // Cek hari Minggu dan reset status raid kalo hari berubah
  const today = new Date().getDay();
  if (today !== 0 && clan.isRaiding) {
    clan.aegis = Math.floor(clan.aegis * 0.5);
    clan.basics = Math.floor(clan.basics * 0.5);
    for (const allyId of clan.raidAllies || []) {
      const allyClan = clans[allyId];
      allyClan.aegis = Math.floor(allyClan.aegis * 0.5);
      allyClan.basics = Math.floor(allyClan.basics * 0.5);
    }
    const monsterName = clan.raidMonster?.name || 'Unknown';
    clan.isRaiding = false;
    delete clan.raidMonster;
    delete clan.raidStartTime;
    delete clan.raidAllies;
    delete clan.raidApprovals;
    logActivity(clanIdRaid, `Raid melawan ${monsterName} otomatis terhapus karena hari berganti.`);
    saveClan({ clans, members });
    m.reply(`Raid melawan *${monsterName}* otomatis terhapus karena udah bukan hari Minggu, Senpai! Defense dan Attack turun 50%.`);
    break;
  }

  // Cek hari Minggu cuma buat start/alliance
  if (today !== 0 && ['start', 'alliance'].includes(subAction)) {
    throw 'Raid cuma bisa dilakukan di hari Minggu, Senpai!';
  }

  const currentTime = Date.now();
  const lastRaidTime = clan.lastRaid || 0;
  const cooldownTime = 7 * 24 * 60 * 60 * 1000; // 7 hari

  switch (subAction) {
    case 'start': {
      if (clan.isRaiding) throw 'Clan kamu udah mulai raid, Senpai! Tunggu 25 menit atau cek hasil pake .clan raid lanjut.';
      if (currentTime - lastRaidTime < cooldownTime) {
        const remainingDays = Math.ceil((cooldownTime - (currentTime - lastRaidTime)) / (24 * 60 * 60 * 1000));
        throw `Clan kamu harus nunggu ${remainingDays} hari lagi sebelum raid lagi, Senpai!`;
      }
      if (clan.aegis < 100 || clan.basics < 100) throw 'Defense dan Attack clan harus di atas 100 buat raid, Senpai!';
      if (!clan.raidAllies || clan.raidAllies.length === 0) throw 'Kamu harus ajak minimal 1 aliansi dulu pake .clan raid alliance <id clan>, Senpai!';

      const monsters = [
        { name: 'Goblin Warlord', hp: 500, attack: 50, defense: 30, difficulty: 1, cpMin: 10, cpMax: 50, expMin: 10, expMax: 30 },
        { name: 'Orc Berserker', hp: 1200, attack: 80, defense: 50, difficulty: 1, cpMin: 20, cpMax: 70, expMin: 15, expMax: 40 },
        { name: 'Cyclops Brute', hp: 2500, attack: 150, defense: 100, difficulty: 2, cpMin: 30, cpMax: 90, expMin: 20, expMax: 50 },
        { name: 'Dragon Lord', hp: 5000, attack: 300, defense: 200, difficulty: 2, cpMin: 40, cpMax: 110, expMin: 25, expMax: 60 },
        { name: 'Hydra Venom', hp: 10000, attack: 500, defense: 300, difficulty: 3, cpMin: 60, cpMax: 140, expMin: 30, expMax: 70 },
        { name: 'Titan Abyss', hp: 20000, attack: 1000, defense: 600, difficulty: 3, cpMin: 80, cpMax: 170, expMin: 40, expMax: 80 },
        { name: 'Leviathan Depths', hp: 35000, attack: 2000, defense: 1200, difficulty: 4, cpMin: 100, cpMax: 200, expMin: 50, expMax: 90 },
        { name: 'Phoenix Inferno', hp: 50000, attack: 3000, defense: 1800, difficulty: 4, cpMin: 120, cpMax: 220, expMin: 60, expMax: 100 },
        { name: 'Behemoth Rage', hp: 75000, attack: 5000, defense: 3000, difficulty: 5, cpMin: 150, cpMax: 230, expMin: 80, expMax: 110 },
        { name: 'Chaos Overlord', hp: 100000, attack: 8000, defense: 5000, difficulty: 5, cpMin: 200, cpMax: 250, expMin: 100, expMax: 120 }
      ];
      const monster = monsters[Math.floor(Math.random() * monsters.length)];

      clan.isRaiding = true;
      clan.raidMonster = monster;
      clan.raidApprovals = { [clanIdRaid]: true }; // Clan starter otomatis setuju
      clan.lastRaid = currentTime;

      let totalAttack = clan.basics;
      let totalDefense = clan.aegis;
      const participatingClans = [clanIdRaid, ...(clan.raidAllies || [])];
      const clanList = participatingClans.map((id, index) => {
        const c = clans[id];
        return `${index + 1}. ${c.name} (${clan.raidApprovals[id] ? 'Setuju' : 'Belum Setuju'})`;
      }).join('\n');

      for (const allyId of clan.raidAllies) {
        const allyClan = clans[allyId];
        totalAttack += allyClan.basics;
        totalDefense += allyClan.aegis;
      }

      const monsterPower = monster.attack + monster.defense;
      const clanPower = totalAttack + totalDefense;
      const winChance = Math.min(100, Math.max(0, Math.floor((clanPower / (clanPower + monsterPower)) * 100)));

      const raidMessage = `
*[ RAID SEDANG DIPERSIAPKAN ]*

**Clan Ikut Serta:**
${clanList}

**Type Monster:**
- Nama: *${monster.name}*
- Attack: ${monster.attack}
- Defense: ${monster.defense}

**Statistik Seluruh Clan:**
- Attack: ${totalAttack}
- Defense: ${totalDefense}

**Kemungkinan Menang:** ${winChance}%

Owner atau Officer tiap clan ketik:
- .clan raid lanjut (Setuju ikut raid)
- .clan raid mundur (Mundur dari raid)
*Note:* Semua clan harus setuju biar raid mulai (25 menit)!
      `.trim();

      await conn.sendMessage(m.chat, { text: raidMessage }, { quoted: m });

      // Kirim notif ke semua clan yang diajak
      for (const allyId of clan.raidAllies) {
        const allyClan = clans[allyId];
        const tags = [allyClan.owner, ...(allyClan.officers || [])].map(id => `@${id.split('@')[0]}`).join(' ');
        const notifyMessage = {
          text: `Clan *${clan.name}* ngajak kalian raid bareng melawan *${monster.name}*, Senpai! ${tags}\nKetik .clan raid lanjut atau .clan raid mundur!`,
          mentions: [allyClan.owner, ...(allyClan.officers || [])]
        };
        await conn.sendMessage(m.chat, notifyMessage, { quoted: m });
      }

      saveClan({ clans, members });
      break;
    }

    case 'alliance': {
      if (clan.isRaiding) throw 'Clan kamu udah mulai raid, Senpai! Gak bisa ajak aliansi sekarang.';
      if (!clan.alliances || clan.alliances.length === 0) throw 'Clan kamu gak punya aliansi buat diajak raid, Senpai!';
      if (currentTime - lastRaidTime < cooldownTime) {
        const remainingDays = Math.ceil((cooldownTime - (currentTime - lastRaidTime)) / (24 * 60 * 60 * 1000));
        throw `Clan kamu harus nunggu ${remainingDays} hari lagi sebelum raid lagi, Senpai!`;
      }

      const targetClanId = args[2];
      if (!targetClanId) throw 'Masukin ID clan yang mau diajak raid, Senpai! Contoh: .clan raid alliance abc123';

      const targetClan = clans[targetClanId];
      if (!targetClan) throw 'Clan itu ga ada, Senpai. Cek lagi ID-nya!';
      if (!clan.alliances.includes(targetClanId)) throw 'Clan itu bukan sekutu kamu, Senpai! Cuma bisa ajak aliansi yang udah ada.';
      if (targetClan.isRaiding) throw 'Clan itu udah lagi raid, Senpai! Gak bisa diajak sekarang.';
      if (clan.raidAllies && clan.raidAllies.includes(targetClanId)) throw 'Clan itu udah masuk daftar raid bareng kamu, Senpai!';

      clan.raidAllies = clan.raidAllies || [];
      clan.raidAllies.push(targetClanId);

      m.reply(`Clan *${targetClan.name}* (ID: ${targetClanId}) udah ditambah ke daftar raid, Senpai! Ajak clan lain atau mulai pake .clan raid start.`);
      saveClan({ clans, members });
      break;
    }

    case 'lanjut': {
      if (!clan.isRaiding) {
        const inviterClanId = Object.keys(clans).find(id => clans[id].isRaiding && clans[id].raidAllies?.includes(clanIdRaid));
        if (!inviterClanId) throw 'Clan kamu gak diajak raid, Senpai!';
        const inviterClan = clans[inviterClanId];

        inviterClan.raidApprovals[clanIdRaid] = true;
        const allApproved = inviterClan.raidAllies.every(allyId => inviterClan.raidApprovals[allyId]);

        if (allApproved) {
          inviterClan.raidStartTime = currentTime; // Timer 25 menit mulai
          let totalAttack = inviterClan.basics;
          let totalDefense = inviterClan.aegis;
          const participatingClans = [inviterClanId, ...(inviterClan.raidAllies || [])];
          const clanList = participatingClans.map((id, index) => `${index + 1}. ${clans[id].name}`).join('\n');

          for (const allyId of inviterClan.raidAllies) {
            const allyClan = clans[allyId];
            totalAttack += allyClan.basics;
            totalDefense += allyClan.aegis;
          }

          const monster = inviterClan.raidMonster;
          const monsterPower = monster.attack + monster.defense;
          const clanPower = totalAttack + totalDefense;
          const winChance = Math.min(100, Math.max(0, Math.floor((clanPower / (clanPower + monsterPower)) * 100)));

          const startMessage = `
*[ RAID SEDANG BERLANGSUNG ]*

**Clan Ikut Serta:**
${clanList}

**Type Monster:**
- Nama: *${monster.name}*
- Attack: ${monster.attack}
- Defense: ${monster.defense}

**Statistik Seluruh Clan:**
- Attack: ${totalAttack}
- Defense: ${totalDefense}

**Kemungkinan Menang:** ${winChance}%

**Waktu Raid:** 25 Menit (Mulai: ${new Date(currentTime).toLocaleTimeString('id-ID')})
Cek hasil pake .clan raid lanjut setelah waktu habis!
          `.trim();

          await conn.sendMessage(m.chat, { text: startMessage }, { quoted: m });
        } else {
          const pendingClans = inviterClan.raidAllies.filter(allyId => !inviterClan.raidApprovals[allyId]).map(id => clans[id].name).join(', ');
          m.reply(`Clan *${clan.name}* setuju ikut raid bareng *${inviterClan.name}*, Senpai! Tersisa clan yang belum setuju: ${pendingClans}`);
        }
        saveClan({ clans, members });
        break;
      }

      // Cek hasil setelah 25 menit
      if (currentTime - clan.raidStartTime < 25 * 60 * 1000) {
        const remainingMinutes = Math.ceil((25 * 60 * 1000 - (currentTime - clan.raidStartTime)) / (60 * 1000));
        throw `Raid masih berlangsung, Senpai! Tunggu ${remainingMinutes} menit lagi buat liat hasil.`;
      }

      const monster = clan.raidMonster;
      let totalAttack = clan.basics;
      let totalDefense = clan.aegis;
      for (const allyId of clan.raidAllies) {
        const allyClan = clans[allyId];
        totalAttack += allyClan.basics;
        totalDefense += allyClan.aegis;
      }

      const monsterPower = monster.attack + monster.defense;
      const clanPower = totalAttack + totalDefense;
      const winChance = Math.min(100, Math.max(0, Math.floor((clanPower / (clanPower + monsterPower)) * 100)));
      const isWin = Math.random() * 100 < winChance;

      let resultMessage = '';
      if (isWin) {
        const cpGain = Math.floor(Math.random() * (monster.cpMax - monster.cpMin + 1)) + monster.cpMin;
        const expGain = Math.floor(Math.random() * (monster.expMax - monster.expMin + 1)) + monster.expMin;
        const resources = Object.keys(clan.resources).sort(() => 0.5 - Math.random()).slice(0, 5);
        const resourceGains = {};
        resources.forEach(res => resourceGains[res] = Math.floor(Math.random() * 341) + 10);

        const totalClans = 1 + clan.raidAllies.length;
        clan.exp += Math.floor(expGain / totalClans);
        clan.bank += Math.floor(cpGain / totalClans);
        for (const res in resourceGains) {
          clan.resources[res] += Math.floor(resourceGains[res] / totalClans);
        }
        clan.aegis = Math.floor(clan.aegis * 0.8); // Kerusakan 20%
        clan.basics = Math.floor(clan.basics * 0.8);

        resultMessage = `
\`R A I D   W O N\`

Monster *${monster.name}* kalah!
Reward (dibagi ${totalClans} clan):
- EXP: ${Math.floor(expGain / totalClans)}
- CP: ${Math.floor(cpGain / totalClans)}
- Resources: ${Object.entries(resourceGains).map(([res, qty]) => `${res}: ${Math.floor(qty / totalClans)}`).join(', ')}
Kerusakan: Defense & Attack tiap clan -20%
        `.trim();

        for (const allyId of clan.raidAllies) {
          const allyClan = clans[allyId];
          allyClan.exp += Math.floor(expGain / totalClans);
          allyClan.bank += Math.floor(cpGain / totalClans);
          for (const res in resourceGains) {
            allyClan.resources[res] += Math.floor(resourceGains[res] / totalClans);
          }
          allyClan.aegis = Math.floor(allyClan.aegis * 0.8);
          allyClan.basics = Math.floor(allyClan.basics * 0.8);
          allyClan.lastRaid = currentTime;
        }
      } else {
        clan.aegis = Math.floor(clan.aegis * 0.5); // Kerusakan 50%
        clan.basics = Math.floor(clan.basics * 0.5);
        for (const allyId of clan.raidAllies) {
          const allyClan = clans[allyId];
          allyClan.aegis = Math.floor(allyClan.aegis * 0.5);
          allyClan.basics = Math.floor(allyClan.basics * 0.5);
          allyClan.lastRaid = currentTime;
        }
        resultMessage = `
\`R A I D   L O S T\`

Monster *${monster.name}* terlalu kuat!
Kerusakan: Defense & Attack tiap clan -50%
        `.trim();
      }

      clan.isRaiding = false;
      delete clan.raidMonster;
      delete clan.raidStartTime;
      delete clan.raidAllies;
      delete clan.raidApprovals;
      logActivity(clanIdRaid, `Raid melawan ${monster.name} ${isWin ? 'menang' : 'kalah'}.`);
      saveClan({ clans, members });
      m.reply(resultMessage);
      break;
    }

    case 'mundur': {
      const inviterClanId = Object.keys(clans).find(id => clans[id].isRaiding && clans[id].raidAllies?.includes(clanIdRaid));
      if (!clan.isRaiding && !inviterClanId) throw 'Clan kamu gak lagi raid, Senpai!';

      if (clan.isRaiding) {
        // Clan starter yang mundur
        const monsterName = clan.raidMonster?.name || 'Unknown';
        clan.isRaiding = false;
        delete clan.raidMonster;
        delete clan.raidStartTime;
        delete clan.raidAllies;
        delete clan.raidApprovals;
        m.reply(`Clan *${clan.name}* mundur dari raid melawan *${monsterName}*, Senpai! Raid otomatis batal.`);
      } else {
        // Clan yang diajak yang mundur
        const inviterClan = clans[inviterClanId];
        const monsterName = inviterClan.raidMonster?.name || 'Unknown';
        inviterClan.isRaiding = false;
        delete inviterClan.raidMonster;
        delete inviterClan.raidStartTime;
        delete inviterClan.raidAllies;
        delete inviterClan.raidApprovals;
        m.reply(`Clan *${clan.name}* mundur dari raid bareng *${inviterClan.name}*, Senpai! Raid otomatis batal.`);
      }
      saveClan({ clans, members });
      break;
    }

    default:
      m.reply('Pilih aksi raid yang bener, Senpai! Ketik .clan raid buat liat opsi.');
      break;
  }
  break;
}

   case 'pasukan': {
  if (!members[sender]) throw 'Kamu belum bergabung dengan clan, Senpai!';
  const clanId = members[sender];
  const clan = clans[clanId];
  const subAction = args[1]?.toLowerCase();

  // Pulihkan pasukan yang sedang dalam recovery
  recoverTroops(clan, Date.now());

  // Fungsi untuk menghitung total kontribusi aegis dan basics dari semua pasukan
  const calculateTroopContributions = () => {
    let totalAegis = 0;
    let totalBasics = 0;
    for (const type in clan.troops) {
      const troop = clan.troops[type];
      const troopData = troopTypes[type];
      totalAegis += troopData.aegis * troop.level * troop.count;
      totalBasics += troopData.basics * troop.level * troop.count;
    }
    return { totalAegis, totalBasics };
  };

  // Fungsi untuk menghitung limit maksimal aegis dan basics
  const getMaxLimits = () => {
    const { totalAegis, totalBasics } = calculateTroopContributions();
    const baseMaxAegis = clan.defenseLevel * 50;
    const baseMaxBasics = clan.attackLevel * 25;
    return {
      maxAegis: baseMaxAegis + totalAegis,
      maxBasics: baseMaxBasics + totalBasics
    };
  };

  // Fungsi untuk mendapatkan daftar pasukan dengan status syarat
  const getTroopList = () => {
    return Object.entries(troopTypes)
      .map(([type, data]) => {
        const meetsRequirement = clan.level >= data.clanLevel;
        return `${meetsRequirement ? '[✅]' : '[❌]'} ${type} (Clan Level ${data.clanLevel} dibutuhkan)`;
      })
      .join('\n');
  };

  if (!subAction) {
    m.reply(`
Command Pasukan, Senpai:
- .clan pasukan camp (Lihat status camp dan pasukan)
- .clan pasukan list (Lihat daftar semua pasukan)
- .clan pasukan add <type> <jumlah> (Tambah pasukan baru)
- .clan pasukan edit <type> <jumlah> (Edit jumlah pasukan)
- .clan pasukan up <type> (Upgrade level pasukan)
- .clan pasukan hapus <type> (Hapus semua pasukan tertentu)
    `.trim());
    break;
  }

  switch (subAction) {
    case 'camp': {
      const maxTroops = getMaxTroops(clan.campLevel);
      let totalTroops = 0;
      const troopList = clan.troops && Object.keys(clan.troops).length > 0
        ? Object.entries(clan.troops).map(([type, data]) => {
            totalTroops += data.count;
            return `- ${type} (Level ${data.level}): ${data.count} pasukan`;
          }).join('\n')
        : 'Belum ada pasukan, Senpai!';

      const recoveringTroops = clan.troopRecovery && Object.keys(clan.troopRecovery).length > 0
        ? Object.entries(clan.troopRecovery).map(([type, data]) => {
            const remainingTime = Math.ceil((data.count * 60 * 1000 - (Date.now() - data.startTime)) / 1000);
            return `- ${type}: ${data.count} pasukan (Sisa waktu: ${Math.floor(remainingTime / 60)} menit ${remainingTime % 60} detik)`;
          }).join('\n')
        : 'Tidak ada pasukan dalam pemulihan, Senpai!';

      m.reply(`
\`C A M P   S T A T U S\`

🏕️ Camp Level: ${clan.campLevel}
👥 Total Pasukan: ${totalTroops}/${maxTroops}

*Pasukan Aktif:*
${troopList}

*Pasukan dalam Pemulihan:*
${recoveringTroops}
      `.trim());
      break;
    }

    case 'list': {
      m.reply(`
\`D A F T A R   P A S U K A N\`

Daftar semua pasukan yang tersedia:
${getTroopList()}
      `.trim());
      break;
    }

    case 'add': {
      const troopType = args[2]?.toLowerCase().replace(' ', '_');
      const amount = parseInt(args[3]);

      if (!troopType || !amount || amount <= 0) {
        m.reply(`
Gunakan: .clan pasukan add <type> <jumlah>
Contoh: .clan pasukan add barbar 10

*Daftar Pasukan Tersedia:*
${getTroopList()}
        `.trim());
        break;
      }
      if (!troopTypes[troopType]) throw `Tipe pasukan salah, Senpai! Lihat daftar pasukan dengan .clan pasukan list`;

      const troopData = troopTypes[troopType];
      if (clan.level < troopData.clanLevel) throw `Clan kamu harus level ${troopData.clanLevel} untuk menambah ${troopType}, Senpai!`;

      const maxTroops = getMaxTroops(clan.campLevel);
      let totalTroops = 0;
      for (const type in clan.troops) {
        totalTroops += clan.troops[type].count;
      }
      if (totalTroops + amount > maxTroops) throw `Camp penuh, Senpai! Maksimal ${maxTroops} pasukan, sekarang ${totalTroops}.`;

      clan.troops = clan.troops || {};
      clan.troops[troopType] = clan.troops[troopType] || { count: 0, level: 1 };
      const currentLevel = clan.troops[troopType].level;

      // Hitung kontribusi aegis dan basics
      const aegisContribution = troopData.aegis * currentLevel * amount;
      const basicsContribution = troopData.basics * currentLevel * amount;

      // Tambah jumlah pasukan
      clan.troops[troopType].count += amount;

      // Update aegis dan basics
      clan.aegis += aegisContribution;
      clan.basics += basicsContribution;

      // Hitung limit baru
      const { maxAegis, maxBasics } = getMaxLimits();
      clan.aegis = Math.min(clan.aegis, maxAegis);
      clan.basics = Math.min(clan.basics, maxBasics);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} menambah ${amount} ${troopType} ke camp, menambah ${aegisContribution} aegis dan ${basicsContribution} basics.`);
      saveClan({ clans, members });
      m.reply(`Berhasil menambah ${amount} ${troopType} ke camp, Senpai! Total ${troopType}: ${clan.troops[troopType].count}\nKontribusi: +${aegisContribution} Aegis (${clan.aegis}/${maxAegis}), +${basicsContribution} Basics (${clan.basics}/${maxBasics})`);
      break;
    }

    case 'edit': {
      const troopType = args[2]?.toLowerCase().replace(' ', '_');
      const newAmount = parseInt(args[3]);

      if (!troopType || isNaN(newAmount) || newAmount < 1) {
        m.reply(`
Gunakan: .clan pasukan edit <type> <jumlah>
Contoh: .clan pasukan edit barbar 15
Jumlah minimal pasukan harus 1, Senpai!

*Daftar Pasukan Tersedia:*
${getTroopList()}
        `.trim());
        break;
      }
      if (!troopTypes[troopType]) throw `Tipe pasukan salah, Senpai! Lihat daftar pasukan dengan .clan pasukan list`;
      if (!clan.troops || !clan.troops[troopType]) throw `Kamu belum punya ${troopType} di camp, Senpai!`;

      const maxTroops = getMaxTroops(clan.campLevel);
      let totalTroops = 0;
      for (const type in clan.troops) {
        if (type !== troopType) totalTroops += clan.troops[type].count;
      }
      totalTroops += newAmount;
      if (totalTroops > maxTroops) throw `Camp penuh, Senpai! Maksimal ${maxTroops} pasukan, sekarang ${totalTroops - newAmount} + ${newAmount} terlalu banyak.`;

      const currentCount = clan.troops[troopType].count;
      const currentLevel = clan.troops[troopType].level;
      const troopData = troopTypes[troopType];
      const amountChange = newAmount - currentCount;

      // Hitung perubahan aegis dan basics
      const aegisChange = troopData.aegis * currentLevel * amountChange;
      const basicsChange = troopData.basics * currentLevel * amountChange;

      // Update jumlah pasukan
      clan.troops[troopType].count = newAmount;

      // Update aegis dan basics
      clan.aegis = Math.max(0, clan.aegis + aegisChange);
      clan.basics = Math.max(0, clan.basics + basicsChange);

      // Hitung limit baru
      const { maxAegis, maxBasics } = getMaxLimits();
      clan.aegis = Math.min(clan.aegis, maxAegis);
      clan.basics = Math.min(clan.basics, maxBasics);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} mengedit ${troopType} dari ${currentCount} menjadi ${newAmount} pasukan, ${amountChange > 0 ? 'menambah' : 'mengurangi'} ${Math.abs(aegisChange)} aegis dan ${Math.abs(basicsChange)} basics.`);
      saveClan({ clans, members });
      m.reply(`Berhasil mengedit ${troopType} menjadi ${newAmount} pasukan, Senpai! Perubahan: ${amountChange > 0 ? '+' : '-'}${Math.abs(aegisChange)} Aegis (${clan.aegis}/${maxAegis}), ${amountChange > 0 ? '+' : '-'}${Math.abs(basicsChange)} Basics (${clan.basics}/${maxBasics})`);
      break;
    }
    
    case 'hapus': {
      const troopType = args[2]?.toLowerCase().replace(' ', '_');
      if (!troopType) throw 'Gunakan: .clan pasukan hapus <type>\nContoh: .clan pasukan hapus barbar';
      if (!troopTypes[troopType]) throw `Tipe pasukan salah, Senpai! Lihat daftar pasukan dengan .clan pasukan list`;
      if (!clan.troops || !clan.troops[troopType]) throw `Kamu belum punya ${troopType} di camp, Senpai!`;

      const troopData = troopTypes[troopType];
      const currentCount = clan.troops[troopType].count;
      const currentLevel = clan.troops[troopType].level;

      // Hitung pengurangan aegis dan basics
      const aegisReduction = troopData.aegis * currentLevel * currentCount;
      const basicsReduction = troopData.basics * currentLevel * currentCount;

      // Hapus pasukan
      delete clan.troops[troopType];

      // Kurangi aegis dan basics
      clan.aegis = Math.max(0, clan.aegis - aegisReduction);
      clan.basics = Math.max(0, clan.basics - basicsReduction);

      // Hitung limit baru
      const { maxAegis, maxBasics } = getMaxLimits();
      clan.aegis = Math.min(clan.aegis, maxAegis);
      clan.basics = Math.min(clan.basics, maxBasics);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} menghapus ${currentCount} ${troopType}, mengurangi ${aegisReduction} aegis dan ${basicsReduction} basics.`);
      saveClan({ clans, members });
      m.reply(`Berhasil menghapus ${currentCount} ${troopType}, Senpai! Pengurangan: -${aegisReduction} Aegis (${clan.aegis}/${maxAegis}), -${basicsReduction} Basics (${clan.basics}/${maxBasics})`);
      break;
    }

    case 'up': {
      const troopType = args[2]?.toLowerCase().replace(' ', '_');
      if (!troopType) throw 'Gunakan: .clan pasukan up <type>\nContoh: .clan pasukan up barbar';
      if (!troopTypes[troopType]) throw `Tipe pasukan salah, Senpai! Lihat daftar pasukan dengan .clan pasukan list`;
      if (!clan.troops || !clan.troops[troopType]) throw `Kamu belum punya ${troopType} di camp, Senpai!`;

      const troopData = troopTypes[troopType];
      const currentLevel = clan.troops[troopType].level;
      if (currentLevel >= troopData.maxLevel) throw `${troopType} sudah mencapai level maksimal (${troopData.maxLevel}), Senpai!`;

      const upgradeCost = {
        wood: 10 * currentLevel,
        iron: 8 * currentLevel,
        diamond: 5 * currentLevel,
        rock: 15 * currentLevel,
        coal: 10 * currentLevel,
        string: 8 * currentLevel
      };

      let hasEnoughResources = true;
      let missingResources = '';
      for (let resource in upgradeCost) {
        const current = clan.resources[resource] || 0;
        const required = upgradeCost[resource];
        if (current < required) {
          hasEnoughResources = false;
          missingResources += `- ${resource}: ${current}/${required}\n`;
        }
      }

      if (!hasEnoughResources) {
        m.reply(`Resource tidak cukup untuk upgrade ${troopType}, Senpai!\n\nResource yang kurang:\n${missingResources.trim()}`);
        break;
      }

      for (let resource in upgradeCost) {
        clan.resources[resource] -= upgradeCost[resource];
      }

      // Hitung kontribusi tambahan untuk aegis dan basics
      const troopCount = clan.troops[troopType].count;
      const aegisContribution = troopData.aegis * troopCount;
      const basicsContribution = troopData.basics * troopCount;

      // Update level pasukan
      clan.troops[troopType].level += 1;
      const newLevel = clan.troops[troopType].level;

      // Tambah aegis dan basics
      clan.aegis += aegisContribution;
      clan.basics += basicsContribution;

      // Hitung limit baru
      const { maxAegis, maxBasics } = getMaxLimits();
      clan.aegis = Math.min(clan.aegis, maxAegis);
      clan.basics = Math.min(clan.basics, maxBasics);

      logActivity(clanId, `${global.db.data.users[sender]?.name || sender} meng-upgrade ${troopType} ke level ${newLevel}, menambah ${aegisContribution} aegis dan ${basicsContribution} basics.`);
      saveClan({ clans, members });
      m.reply(`Berhasil upgrade ${troopType} ke level ${newLevel}!\nKontribusi: +${aegisContribution} Aegis (${clan.aegis}/${maxAegis}), +${basicsContribution} Basics (${clan.basics}/${maxBasics})`);
      break;
    }

    default:
      m.reply('Pilih aksi pasukan yang bener, Senpai! Ketik .clan pasukan buat liat opsi.');
      break;
  }
  saveClan({ clans, members });
  break;
}

    default:
      m.reply('Perintah Tidak di temukan.\nketik: .clan');
      break;
  }
 
};

handler.help = [
  'clan create', 'clan profile', 'clan jelajah', 'clan up', 'clan war', 
  'clan join', 'clan shop', 'clan repair', 'clan list', 'clan private', 
  'clan out', 'clan kick', 'clan setprofile', 'clan leaderboard', 
  'clan promote', 'clan demote', 'clan member', 'clan owner', 
  'clan delprofile', 'clan transfer', 'clan activity', 'clan dungeon', 
  'clan nebang', 'clan alliance', 'clan hunt', 'clan mining', 
  'clan approve', 'clan deny', 'clan pending', 'clan rename',
  'clan raid', 'clan raid start', 'clan raid alliance', 'clan raid lanjut', 'clan raid mundur', 'clan pasukan', 'clan pasukan camp', 'clan pasukan add', 'clan pasukan edit', 'clan pasukan up', 'clan pasukan hapus'
];
handler.tags = ['clan'];
handler.command = /^clan$/i;
handler.limit = 1;
handler.register = true;
handler.group = true;

export default handler;