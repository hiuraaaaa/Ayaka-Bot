import { fileURLToPath } from 'url';
import path, { join, dirname } from 'path';
import { promises as fsPromises, readFileSync, existsSync } from 'fs';
import moment from 'moment-timezone';
import os from 'os';
import fetch from 'node-fetch';
import baileys from '@adiwajshing/baileys';
import { xpRange } from '../lib/levelling.js';

const { generateWAMessageFromContent, proto } = baileys;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const menuPath = join(__dirname, '../src', 'setmenu.json');

const defaultMenu = {
  before: `
`.trimStart(),
  header: '',
  body: '',
  footer: '',
  after: '',
};

let Lanndev = async (conn, m) => {
  let name = await conn.getName(m.sender);
  let premium = global.db.data.users[m.sender].premiumTime;
  let prems = `${premium > 0 ? 'Premium' : 'Free'}`;
  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  
  // Hitung ping
  let timestamp = performance.now();
  let latensi = performance.now() - timestamp;
  let ping = latensi.toFixed(4);

  return `👋 Halo! Selamat datang di Lumina Md

*INFO BOT*
╭ ⌯ Status: Online
│ ⌯ Bot: ${global.namebot}
│ ⌯ Packname: ${global.packname}
│ ⌯ Ping: ${ping}ms
╰ ⌯ Nomor Bot: ${global.botNumber}

*INFO USER*
╭ ⌯ Nama: ${name}
│ ⌯ Nomor: ${m.sender.split('@')[0]}
╰ ⌯ Status: ${prems}

*INFO OWNER*
╭ ⌯ Owner: ${global.author}
│ ⌯ Contact: ${global.nomorwa}
╰ ⌯ Website: ${global.myweb}`;
};

let handler = async (m, { conn }) => {
  
  let menuSettings = existsSync(menuPath)
    ? JSON.parse(readFileSync(menuPath))
    : { button: true };

  let tags = {
    'ayakamenu': {},
  };

  try {
    // DEFAULT MENU
    let dash = global.dashmenu;
    let m1 = global.dmenut;
    let m2 = global.dmenub;
    let m3 = global.dmenuf;
    let m4 = global.dmenub2;
    // COMMAND MENU
    let cc = global.cmenut;
    let c1 = global.cmenuh;
    let c2 = global.cmenub;
    let c3 = global.cmenuf;
    let c4 = global.cmenua;
    // LOGO L P
    let lprem = global.lopr;
    let llim = global.lolm;
    let tag = `@${m.sender.split('@')[0]}`;

    //-----------TIME---------
    let ucpn = `${ucapan()}`;
    let d = new Date(new Date() + 3600000);
    let locale = 'id';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    let _uptime = process.uptime() * 1000;
    let _muptime;
    
    if (process.send) {
      process.send('uptime');
      _muptime = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    let _mpt;
    if (process.send) {
      process.send('uptime');
      _mpt = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    let mpt = clockString(_mpt);
    let usrs = global.db.data.users[m.sender];

    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss');
    let wibh = moment.tz('Asia/Jakarta').format('HH');
    let wibm = moment.tz('Asia/Jakarta').format('mm');
    let wibs = moment.tz('Asia/Jakarta').format('ss');
    let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss');
    let wita = moment.tz('Asia/Makassar').format('HH:mm:ss');
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`;

    let mode = global.opts['self'] ? 'Private' : 'Publik';

    let _package = {};
    try {
        const packageJsonPath = join(__dirname, '../package.json'); 
        const packageJsonContent = await fsPromises.readFile(packageJsonPath, 'utf-8');
        _package = JSON.parse(packageJsonContent);
    } catch (e) {
        console.error("Failed to read or parse package.json:", e);
        _package = { name: 'unknown', description: 'unknown', version: 'unknown', homepage: '' }; 
    }

    let { age, exp, limit, level, role, registered, eris } = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let name = await conn.getName(m.sender);
    let premium = global.db.data.users[m.sender].premiumTime;
    let prems = `${premium > 0 ? 'Premium' : 'Free'}`;
    let platform = os.platform();

    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      };
    });

    let groups = {};
    for (let tag in tags) {
      groups[tag] = [];
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin);
    }

    conn.menu = conn.menu ? conn.menu : {};
    let before = conn.menu.before || defaultMenu.before;
    let header = conn.menu.header || defaultMenu.header;
    let body = conn.menu.body || defaultMenu.body;
    let footer = conn.menu.footer || defaultMenu.footer;
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split('@')[0]}`) + defaultMenu.after;

    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim();
            }).join('\n');
          }),
          footer,
        ].join('\n');
      }),
      after,
    ].join('\n');

    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : '';

    const more = String.fromCharCode(8206);
    const readMore = more.repeat(4001);

    let replace = {
      '%': '%',
      p: uptime,
      muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? (_package.homepage.url || _package.homepage) : '[unknown github url]',
      tag,
      dash,
      m1,
      m2,
      m3,
      m4,
      cc,
      c1,
      c2,
      c3,
      c4,
      lprem,
      llim,
      ucpn,
      platform,
      wib,
      mode,
      _p: global._p,
      eris,
      age,
      name,
      prems,
      level,
      limit,
      weton,
      week,
      date,
      dateIslamic,
      time,
      totalreg,
      rtotalreg,
      role,
      readmore: readMore,
    };

    const uniqueReplace = {};
    Object.keys(replace).forEach(key => {
        if (uniqueReplace[key] === undefined) {
            uniqueReplace[key] = replace[key];
        }
    });

    text = text.replace(new RegExp(`%(${Object.keys(uniqueReplace).sort((a, b) => b.length - a.length).join('|')})`, 'g'), (_, keyName) => '' + uniqueReplace[keyName]);

    let fkon = {
      key: {
        fromMe: false,
        participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}),
      },
      message: {
        contactMessage: {
          displayName: `${name}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
      },
    };

    // Generate menu text
    let menuText = await Lanndev(conn, m);

    if (menuSettings.button) {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: global.thumbmenu },
          caption: menuText,
          footer: `© ${global.namebot || 'Bot'} || ${global.author || 'Author'}`,
          buttons: [
            {
              buttonId: '.owner',
              buttonText: { displayText: '☎ Owner' },
              type: 1,
            },
            {
              buttonId: '.sc',
              buttonText: { displayText: '🔖 Buy Script' },
              type: 1,
            },
            {
              buttonId: 'action',
              buttonText: { displayText: 'CLICK' },
              type: 4,
              nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                  title: 'Menu 📊',
                  sections: [
                    {
                      title: 'Lumina Md✨',
                      highlight_label: 'Populer',
                      rows: [
                        { header: '📜 Menu All', title: 'All Menu', description: 'Menampilkan Semua Menu', id: '.allmenu' },
                        { header: '📂 Menu List', title: 'List Menu', description: 'Menampilkan Menu Simpel', id: '.listmenu' },
                        { header: '🤖 Menu AI', title: 'Ai Menu', description: 'Menampilkan Menu AI', id: '.menuai' },
                        { header: '🌸 Menu Anime', title: 'Anime Menu', description: 'Menampilkan Menu Anime', id: '.menuanime' },
                        { header: '🎵 Menu Audio', title: 'Audio Menu', description: 'Menampilkan Menu Audio', id: '.menuaudio' },
                        { header: '📖 Menu Ceramah', title: 'Ceramah Menu', description: 'Menampilkan Menu Ceramah', id: '.menuceramah' },
                        { header: '🎬 Menu Asupan', title: 'Asupan Menu', description: 'Menampilkan Menu Asupan', id: '.menuasupan' },
                        { header: '⬇️ Menu Download', title: 'Download Menu', description: 'Menampilkan Menu Download', id: '.menudownloader' },
                        { header: '😂 Menu Fun', title: 'Fun Menu', description: 'Menampilkan Menu Fun', id: '.menufun' },
                        { header: '🎮 Menu Game', title: 'Game Menu', description: 'Menampilkan Menu Game', id: '.menugame' },
                        { header: '👥 Menu Group', title: 'Group Menu', description: 'Menampilkan Menu Group', id: '.menugc' },
                        { header: 'ℹ️ Menu Info', title: 'Info Menu', description: 'Menampilkan Menu Info', id: '.menuinfo' },
                        { header: '🌐 Menu Internet', title: 'Internet Menu', description: 'Menampilkan Menu Internet', id: '.menuinternet' },
                        { header: '🏠 Menu Main', title: 'Main Menu', description: 'Menampilkan Menu Main', id: '.menumain' },
                        { header: '🎨 Menu Maker', title: 'Maker Menu', description: 'Menampilkan Menu Maker', id: '.menumaker' },
                        { header: '🥳 Menu HaveFun', title: 'HaveFun Menu', description: 'Menampilkan Menu HaveFun', id: '.menuhavefun' },
                        { header: '👑 Menu Owner', title: 'Owner Menu', description: 'Menampilkan Menu Owner', id: '.menuowner' },
                        { header: '💎 Menu Premium', title: 'Premium Menu', description: 'Menampilkan Menu Premium', id: '.menupremium' },
                        { header: '🔍 Menu Search', title: 'Search Menu', description: 'Menampilkan Menu Search', id: '.menusearch' },
                        { header: '⚔️ Menu RPG', title: 'RPG Menu', description: 'Menampilkan Menu RPG', id: '.menurpg' },
                        { header: '🎭 Menu Sticker', title: 'Sticker Menu', description: 'Menampilkan Menu Sticker', id: '.menustiker' },
                        { header: '🛠️ Menu Tools', title: 'Tools Menu', description: 'Menampilkan Menu Tools', id: '.menutools' },
                        { header: '📊 Menu Panel', title: 'Panel Menu', description: 'Menampilkan Menu Panel', id: '.menupanel' },
                        { header: '💬 Menu Quotes', title: 'Quotes Menu', description: 'Menampilkan Menu Quotes', id: '.menuquotes' },
                      ],
                    },
                  ],
                }),
              },
            },
          ],
          headerType: 1,
          viewOnce: true,
        }, { quoted: flok });
        
  await conn.sendMessage(m.chat, {
  audio: { url: 'https://c.termai.cc/a39/0dp.opus' },
  mimetype: 'audio/mpeg',
  ptt: true
}, { quoted: flok })

      } catch (e) {
        conn.reply(m.chat, 'Maaf, menu sedang error', m);
        throw e;
      }
    } else {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: global.thumbmenu },
          caption: menuText,
        }, { quoted: flok });
        
  await conn.sendMessage(m.chat, {
  audio: { url: 'https://c.termai.cc/a39/0dp.opus' },
  mimetype: 'audio/mpeg',
  ptt: true
}, { quoted: flok })

      } catch (e) {
        conn.reply(m.chat, 'Maaf, menu sedang error', m);
        throw e;
      }
    }
  } catch (e) {
    console.error("Error processing menu:", e);
    conn.reply(m.chat, 'Maaf, terjadi kesalahan.', m);
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|\?)$/i;
handler.register = true;
handler.exp = 3;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('');
}

function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10;
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12;
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30;
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [ye, ' *Years 🗓️*\n', mo, ' *Month 🌙*\n', d, ' *Days ☀️*\n', h, ' *Hours 🕐*\n', m, ' *Minute ⏰*\n', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('');
}

function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH');
  let res = "Kok Belum Tidur Kak? 🥱";
  if (time >= 4) {
    res = "Pagi Kak 🌄";
  }
  if (time >= 10) {
    res = "Siang Kak ☀️";
  }
  if (time >= 15) {
    res = "Sore Kak 🌇";
  }
  if (time >= 18) {
    res = "Malam Kak 🌙";
  }
  return res;
}

export default handler;
