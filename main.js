import './config.js'

import axios from "axios"
import fetch from "node-fetch"
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber' 
import path, { join, dirname, resolve } from 'path'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /^file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { tmpdir } from 'os'
import readline from 'readline'
import { format } from 'util'
import pino from 'pino'
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC: MCC_BAILEYS
} = await import('@adiwajshing/baileys')

import { Low } from 'lowdb'

import {
    JSONFile
} from "lowdb/node"
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import NodeCache from 'node-cache'

const groupCache = new NodeCache({stdTTL: 30, useClones: false})
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js'

const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || 'cCrR‎xzXZ/!#$V%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^V$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
      (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (db.READ) return new Promise((resolve) => setInterval(async function () {
        if (!db.READ) {
            clearInterval(this)
            resolve(db.data == null ? global.loadDatabase() : db.data)
        }
    }, 1 * 1000))
    if (db.data !== null) return
    db.READ = true
    await db.read().catch(console.error)
    db.READ = null
    db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(db.data || {})
    }
    global.db.chain = chain(db.data)
}
loadDatabase()

const useStore = !process.argv.includes('--use-store')
const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

var question = function(text) {
    return new Promise(function(resolve) {
        rl.question(text, resolve);
    });
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const { version, isLatest} = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')
const connectionOptions = {
    version,
    logger: pino({ level: 'silent' }), 
    printQRInTerminal: !usePairingCode, 
    browser: ["Mac OS", "Safari", "17.0"],
    auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, pino().child({ 
            level: 'silent', 
            stream: 'store' 
        })), 
    },
    getMessage: async key => {
        const messageData = await store.loadMessage(key.remoteJid, key.id);
        return messageData?.message || undefined;
    },
    generateHighQualityLinkPreview: true, 
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
            message.buttonsMessage 
            || message.templateMessage
            || message.listMessage
        );
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    }
};

global.conn = makeWASocket({
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    ...connectionOptions
})

conn.ev.on('connection.update', async ({ connection, receivedPendingNotifications }) => {
    if (connection === 'open') {
        console.log(chalk.greenBright('✅ Bot tersambung, memastikan key enkripsi aktif...'))
        try {
            if (conn?.authState?.creds?.noiseKey) {
                console.log(chalk.blueBright('🔑 Key enkripsi sudah aktif & siap digunakan.'))
            } else {
                console.log(chalk.yellow('⚠️ Tidak ada key aktif, WhatsApp akan mengirim ulang otomatis saat pesan baru diterima.'))
            }
        } catch (err) {
            console.log(chalk.red('⚠️ Gagal memeriksa key enkripsi:'), err.message)
        }
    } else if (connection === 'close') {
        console.log(chalk.red('⏱️ Koneksi terputus, mencoba reconnect...'))
    } else if (receivedPendingNotifications) {
        console.log(chalk.yellow('📩 Menunggu pesan baru dari server...'))
    }
})

conn.isInit = false

if (usePairingCode && !conn.authState.creds.registered) {
  if (useMobile) throw new Error('Cannot use pairing code with mobile API')

  let phoneNumber = ''
  do {
    const answer = await question(chalk.blueBright('Input nomor dengan kode negara (cth: +62xxx atau 628xx):\n'))
    if (!answer) {
      phoneNumber = ''
      continue
    }

    let candidate = answer.trim().replace(/[^\d+]/g, '')
    if (!candidate.startsWith('+')) candidate = `+${candidate}`

    if (/^\+\d{8,15}$/.test(candidate)) {
      const pn = new PhoneNumber(candidate)
      phoneNumber = pn.getNumber('e164')?.replace(/^\+/, '') || candidate.replace(/^\+/, '')
      break
    } else {
      console.log(chalk.yellow('Format nomor salah. Gunakan format internasional, mis. +628xxxx atau 628xxxx.'))
      phoneNumber = ''
    }

  } while (!phoneNumber)

  const customCode = global.pairing

  if (!/^[a-zA-Z0-9]{8}$/.test(customCode)) {
    rl.close()
    throw new Error('Pairing code tidak valid. Harus 8 karakter alfanumerik.')
  }

  console.log(chalk.bgWhite(chalk.blue('⏳ Generating pairing code...')))

  try {
    let code = await conn.requestPairingCode(phoneNumber, customCode)
    code = code?.match(/.{1,4}/g)?.join('-') || code
    console.log(chalk.black(chalk.bgGreen('✅ Pairing Code Kamu:')), chalk.white(code))
  } catch (err) {
    console.error(chalk.red('❌ Gagal generate pairing code:'), err.message)
  } finally {
    rl.close()
  }
}

if (!opts['test']) {
  (await import('./server.js')).default(PORT)
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error)
    if (opts['autocleartmp']) try {
      clearTmp()
    } catch (e) { console.error(e) }
  }, 60 * 1000)
}

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file)
    return false
  })
}

function clearSessions(folder = 'sessions') {
	let filename = []
	readdirSync(folder).forEach(file => filename.push(join(folder, file)))
	return filename.map(file => {
		let stats = statSync(file)
		if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 120)) {
			console.log('Deleted sessions', file)
			return unlinkSync(file)
		}
		return false
	})
}

async function connectionUpdate(update) {
    const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update
  if (isNewLogin) conn.isInit = true
  if (connection == 'connecting') console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'))
  if (connection == 'open') console.log(chalk.green('✅ Tersambung'))
  if (isOnline == true) console.log(chalk.green('Status Aktif'))
  if (isOnline == false) console.log(chalk.red('Status Mati'))
  if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'))
  if (connection == 'close') console.log(chalk.red('⏱️ koneksi terputus & mencoba menyambung ulang...'))
  global.timestamp.connect = new Date
  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
    console.log(global.reloadHandler(true))
  } 
  if (global.db.data == null) await global.loadDatabase()
}

process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
        console.error(e)
    }
    if (restatConn) {
        const oldChats = global.conn.chats
        try { global.conn.ws.close() } catch { }
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
    }    
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = 'Welcome To @subject\n@user'
  conn.bye = 'Selamat Tinggal @user  (　-̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥᷄◞ω◟-̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥᷅ ) '
  conn.spromote = '@user Sekarang jadi admin!'
  conn.sdemote = '@user Sekarang bukan lagi admin!'
  conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
  conn.sSubject = 'Judul grup telah diubah menjadi \n@subject'
  conn.sIcon = 'Icon grup telah diubah!'
  conn.sRevoke = 'Link group telah diubah ke \n@revoke'
  conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
  conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
  conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
  conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

const rootDir = __dirname
const pluginFolder = join(rootDir, "plugins")
global.plugins = {}

function colorText(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

// ========================================
// 🔒 IP WHITELIST SYSTEM (VERCEL + SUPABASE)
// ========================================

async function getLocalIp() {
  try {
    const { data } = await axios.get("https://api.ipify.org");
    return data;
  } catch (err) {
    console.error(
      colorText("[ ! ] Gagal mengambil IP publik:", "31"),
      err.message
    );
    return null;
  }
}

async function checkIpWhitelist(ipAddress) {
  try {
    // 🌐 Ganti dengan URL Vercel kamu
    const WHITELIST_SERVER = "https://whitelist-ip.vercel.app";
    
    const response = await fetch(`${WHITELIST_SERVER}/ips/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ipAddress })
    });

    if (!response.ok) return { allowed: false };

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(
      colorText("\n[ ! ] Error checking IP whitelist:", "31"),
      err.message
    );
    console.error(
      colorText("[ ! ] Pastikan server whitelist berjalan: https://whitelist-ip.vercel.app", "31")
    );
    return { allowed: false };
  }
}

// ========================================
// END IP WHITELIST SYSTEM
// ========================================

function ensureRootSymlinks(selectedFolders = ["lib", "src", "json", "tmp", "sessions"]) {

  if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder, { recursive: true })

  console.log(chalk.cyanBright(`\n🔄 Membuat ulang symlink hanya untuk folder: ${selectedFolders.join(", ")}`))

  const oldEntries = fs.readdirSync(pluginFolder)
  for (const entry of oldEntries) {
    const fullPath = join(pluginFolder, entry)
    try {
      const stat = fs.lstatSync(fullPath)
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(fullPath)
        console.log(chalk.yellow(`♻ Menghapus symlink lama: ${entry}`))
      }
    } catch (err) {
      console.error(chalk.red(`Gagal menghapus ${entry}:`), err.message)
    }
  }
    
  for (const name of selectedFolders) {
    const target = join(rootDir, name)
    const linkPath = join(pluginFolder, name)

    if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
      console.warn(chalk.gray(`⚠ Folder '${name}' tidak ditemukan, dilewati.`))
      continue
    }

    try {
      const relTarget = path.relative(dirname(linkPath), target) || target
      fs.symlinkSync(relTarget, linkPath, "junction") 
      console.log(chalk.green(`🔗 Symlink dibuat: ${linkPath} → ${relTarget}`))
    } catch (err) {
      console.error(chalk.red(`❌ Gagal membuat symlink untuk ${name}:`), err)
    }
  }

  console.log(chalk.greenBright("✅ Semua symlink telah diperbarui!\n"))
}

async function resolveImport(specifier, parentUrl) {
  if (!specifier.startsWith("../") && !specifier.startsWith("./")) return null
  const parentPath = fileURLToPath(parentUrl)
  const resolved = resolve(dirname(parentPath), specifier)

  const rootFolders = fs.readdirSync(rootDir).filter(name => {
    const full = join(rootDir, name)
    return fs.statSync(full).isDirectory() && !["node_modules", "plugins", ".git"].includes(name)
  })

  for (const folder of rootFolders) {
    const rootPath = resolve(rootDir, folder)
    if (resolved.startsWith(resolve(pluginFolder, folder))) {
      const redirected = resolved.replace(resolve(pluginFolder, folder), rootPath)
      return pathToFileURL(redirected).href
    }
  }
  return pathToFileURL(resolved).href
}

async function importWithResolver(file) {
  const parentUrl = pathToFileURL(file).href
  return await import(`${parentUrl}?v=${Date.now()}`, {
    async resolve(specifier, context, nextResolve) {
      const redirected = await resolveImport(specifier, context.parentURL)
      return redirected ? nextResolve(redirected, context) : nextResolve(specifier, context)
    }
  })
}

function scanPlugins(dir = pluginFolder) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results.push(...scanPlugins(full))
    else if (entry.name.endsWith(".js")) results.push(full)
  }
  return results
}

function printAllFoldersBox(folders) {
  if (folders.length === 0) return
  const maxLength = Math.max(...folders.map(f => f.length), "Loaded plugin folders".length)
  const width = maxLength + 4
  console.log(chalk.blueBright("┌" + "─".repeat(width) + "┐"))
  console.log(chalk.bgBlue.whiteBright(`│ Loaded plugin folders`.padEnd(width + 1) + "│"))
  console.log(chalk.blueBright("├" + "─".repeat(width) + "┤"))
  folders.forEach(f => console.log(chalk.greenBright(`│ ${f}`.padEnd(width + 1) + "│")))
  console.log(chalk.blueBright("└" + "─".repeat(width) + "┘"))
}

async function loadPlugin(file, showLog = true) {
  const key = file.replace(pluginFolder, "").slice(1)
  const folder = key.split("/")[0]

  delete global.plugins[key]
  for (const url of Object.keys(import.meta?.cache ?? {})) {
    if (url.includes(file)) delete import.meta.cache[url]
  }

  try {
    const module = await importWithResolver(file)
    global.plugins[key] = module.default || module
    if (showLog) console.log(chalk.greenBright(`✅ Loaded plugin: ${path.basename(file)}`))
  } catch (err) {
    console.error(chalk.red(`❌ Failed loading plugin: ${key}`), err)
  }
  return folder
}

async function loadPlugins(showBox = true, showFileLogs = false) {
  const files = scanPlugins()
  const folderSet = new Set()

  for (const file of files) {
    const folder = await loadPlugin(file, showFileLogs)
    folderSet.add(folder)
  }

  if (showBox) printAllFoldersBox([...folderSet])
  await global.reloadHandler?.()
}

fs.watch(pluginFolder, { recursive: true }, async (event, filename) => {
  if (!filename?.endsWith(".js")) return
  const fullPath = join(pluginFolder, filename)
  const key = fullPath.replace(pluginFolder, "").slice(1)

  if (!fs.existsSync(fullPath)) {
    delete global.plugins[key]
    console.log(chalk.red(`🗑 Deleted plugin: ${filename}`))
    return await global.reloadHandler?.(false)
  }

  console.log(chalk.yellowBright(`🔁 Reloading plugin: ${filename}`))
  await loadPlugin(fullPath, true)
  await global.reloadHandler?.(false)
})

// ========================================
// 🚀 MAIN EXECUTION WITH IP WHITELIST CHECK
// ========================================
;(async () => {
  console.log(chalk.cyanBright("🌐 Checking your IP and plugins access..."))
  
  const ip = await getLocalIp()
  if (!ip) {
    console.error(colorText("\n[ ! ] Tidak dapat melanjutkan tanpa IP publik.", "31"))
    process.exit(1)
  }

  console.log(chalk.blueBright(`📍 Your public IP: ${ip}`))

  const result = await checkIpWhitelist(ip)
  
  if (!result.allowed) {
    console.log(colorText(`\n🚫 Akses Plugins ditolak! IP ${ip} tidak terdaftar.`, "31"))
    console.log(colorText(`\n💡 Tambahkan IP kamu di dashboard: https://whitelist-ip.vercel.app`, "33"))
    process.exit(1)
  }

  console.log(chalk.greenBright(`✅ Akses Plugins Disetujui! Welcome Sensei >.<`))
  if (result.reason === 'allow_all_enabled') {
    console.log(chalk.yellow(`⚠️  Mode: Allow All IPs enabled`))
  }

  ensureRootSymlinks()
  await loadPlugins(true, false)
  await global.reloadHandler?.()
})()

// Quick Test
async function _quickTest() {
    let test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version'])
    ].map(p => {
        return Promise.race([
            new Promise(resolve => {
                p.on('close', code => {
                    resolve(code !== 127)
                })
            }),
            new Promise(resolve => {
                p.on('error', _ => resolve(false))
            })
        ])
    }))
    let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
    console.log(test)
    let s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    }
    Object.freeze(global.support)
}

_quickTest()
    .then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json'))
    .catch(console.error)

conn.ev.on('groups.update', async ([event]) => {
    const metadata = await conn.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
})

conn.ev.on('group-participants.update', async (event) => {
    const metadata = await conn.groupMetadata(event.id)
    groupCache.set(event.id, metadata)
})

groupCache.on("del", (key, value) => {
    console.log(`Cache untuk ${key} dihapus.`);
});

groupCache.on("expired", (key, value) => {
    console.log(`Cache untuk ${key} kadaluarsa.`);
});

setInterval(() => {
    console.log("Pengecekan otomatis cache grup:");
    console.log(`Jumlah item dalam cache: ${groupCache.getStats().keys}`);
}, 5 * 60 * 1000);
