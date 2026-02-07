import fs from 'fs/promises'
import path from 'path'

let handler = async (m, { conn, isROwner, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });
  if (!isROwner) return

  if (!text) throw `📦 *Masukkan nama plugin!*\n\nContoh:\n.gp2 ai-toreall`

  async function findPluginFile(dir, pluginName) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = await findPluginFile(fullPath, pluginName);
        if (found) return found;
      } else if (entry.isFile() && entry.name === `${pluginName}.js`) {
        return fullPath;
      }
    }
    return null;
  }

  const baseDir = path.join(process.cwd(), 'plugins');
  const filePath = await findPluginFile(baseDir, text);

  if (!filePath) {
  
    const allPlugins = (await fs.readdir(baseDir, { recursive: true }))
      .filter(f => f.endsWith('.js'))
      .map(f => f.replace(/^plugins[\\/]/, '').replace(/\.js$/, ''));

    return m.reply(`❌ *Plugin tidak ditemukan!*\n\n🧩 Daftar plugin yang tersedia:\n${allPlugins.map(v => '• ' + v).join('\n')}`);
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const relativePath = filePath.replace(process.cwd() + '/', '');

    await conn.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'application/javascript',
      fileName: path.basename(filePath)
    });

    await conn.sendMessage(m.chat, {
      text: `✅ *Ditemukan di:* \`${relativePath}\``,
      quoted: m
    });

  } catch (e) {
    m.reply(`❌ Gagal membaca file:\n${e.message}`);
  } finally {
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  }
};

handler.help = ['gp2 <nama plugin>'];
handler.tags = ['owner'];
handler.command = /^(gp2)$/i;
handler.rowner = true;

export default handler;