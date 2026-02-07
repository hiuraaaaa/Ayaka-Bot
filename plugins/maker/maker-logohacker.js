/*
wa.me/6289687537657
github: https://github.com/Phmiuuu
Instagram: https://instagram.com/basrenggood
ini wm gw cok jan di hapus
*/

import fetch from "node-fetch";

let handler = async (m, {
    conn,
    args, 
    usedPrefix, 
    command
}) => {
    let response = args.join('').split('|');
    if (!args[0]) throw `Masukkan Text\nContoh : ${usedPrefix + command} Bang ${global.author}`;
    m.reply(global.wait);
    var tio = `${global.APIs.lolhuman}/api/ephoto1/anonymhacker?apikey=${global.lolhuman}&text=${response[0]}`;
    conn.sendFile(m.chat, tio, 'loliiiii.jpg', null, m, false);
};

handler.command = handler.help = ['hacker2'];
handler.tags = ['maker'];

export default handler;