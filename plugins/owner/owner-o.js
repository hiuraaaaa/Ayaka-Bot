import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const tempFilePath = path.join(tempDir, 'temp.js');

const handler = async (m, { conn, text, command, usedPrefix }) => {

    if (!text) {
        return m.reply('No input');
    }

    const code = text.trim();

    fs.writeFileSync(tempFilePath, code);

    exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
        if (error) {
            m.reply(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            m.reply(`Stderr: ${stderr}`);
            return;
        }
        m.reply(`Output:\n${stdout}`);
    });
};

handler.help = ['o'];
handler.tags = ['owner'];
handler.command = ['o'];
handler.group = false;
handler.owner = true;

export default handler;