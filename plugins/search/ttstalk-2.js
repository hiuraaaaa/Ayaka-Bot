import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan username TikTok yang ingin Anda stalk.\n*Contoh:*\n > .ttstalk username');

    try {
        const result = await tiktokStalk(text);
        const { userInfo } = result;

        let message = `\`[ User Metadata ]\`\n\n`;
        message += Object.entries(userInfo)
            .map(([key, value]) => `> *- ${key.charAt(0).toUpperCase() + key.slice(1)}:* ${value}`)
            .join("\n");

        await m.reply(message);
    } catch (error) {
        await conn.sendMessage(`Gagal mengambil data: ${error.message}`);
    }
};

handler.command = /^(ttstalk2|tts2)$/i;
handler.help = ["ttstalk [username]"];
handler.tags = ["search"];

export default handler;;

//fungsi ini!!!! 
async function tiktokStalk(username) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        const parsedData = JSON.parse(scriptData);

        const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        if (!userDetail) {
            throw new Error('User tidak ditemukan');
        }

        const userInfo = userDetail.userInfo?.user;
        const stats = userDetail.userInfo?.stats;

        const metadata = {
            userInfo: {
                id: userInfo?.id || null,
                username: userInfo?.uniqueId || null,
                nama: userInfo?.nickname || null,
                avatar: userInfo?.avatarLarger || null,
                bio: userInfo?.signature || null,
                verifikasi: userInfo?.verified || false,
                totalfollowers: stats?.followerCount || 0,
                totalmengikuti: stats?.followingCount || 0,
                totaldisukai: stats?.heart || 0,
                totalvideo: stats?.videoCount || 0,
                totalteman: stats?.friendCount || 0,
            }
        };

        return metadata;
    } catch (error) {
        throw new Error(error.message);
    }
}