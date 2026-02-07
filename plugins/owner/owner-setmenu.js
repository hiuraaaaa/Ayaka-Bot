import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuPath = path.join(__dirname, "../src", "setmenu.json");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let args = text.trim().split(" ");
  if (args.length < 2) {
    return conn.reply(m.chat, `Contoh:\n${usedPrefix + command} button <on|off>`, m);
  }

  let type = args[0].toLowerCase();
  let setting = args[1].toLowerCase();

  if (type !== "button") {
    return conn.reply(m.chat, `Salah Sensei! Use \"button\". Contoh: ${usedPrefix + command} button <on|off>`, m);
  }

  let buttonState;
  if (setting === "on") {
    buttonState = true;
  } else if (setting === "off") {
    buttonState = false;
  } else {
    return conn.reply(m.chat, `Salah! dasar sensei bodoh! Use \"on\" or \"off\". Usage: ${usedPrefix + command} button <on|off>`, m);
  }

  try {
    const srcDir = path.dirname(menuPath);

    if (typeof srcDir !== 'string') {
        console.error("error kak: srcDir is not a string! Value:", srcDir);
        return conn.reply(m.chat, "error kak: Could not determine source directory path.", m);
    }

    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    fs.writeFileSync(menuPath, JSON.stringify({ button: buttonState }, null, 2));

    conn.reply(m.chat, `Menu buttons sudah di atur ke ${setting.toUpperCase()}, Sensei!`, m);

  } catch (e) {
    console.error(`Error in ${command}:`, e);
    conn.reply(m.chat, `Failed to set menu buttons to ${setting.toUpperCase()}. Error: ${e.message}`, m);
  }
};

handler.help = ["setmenu button <on|off>"];
handler.tags = ["owner"];
handler.command = /^(setmenu)$/i;
handler.owner = true;

export default handler;