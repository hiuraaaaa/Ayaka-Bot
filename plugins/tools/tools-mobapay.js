import axios from 'axios';

async function mobapay(uid, zone) {
    try {
        const { data } = await axios.get('https://api.mobapay.com/api/app_shop', {
            headers: { 'content-type': 'application/json' },
            params: {
                app_id: 100000,
                game_user_key: uid,
                game_server_key: zone,
                country: 'ID',
                language: 'en',
                shop_id: 1001
            }
        });

        const first_recharge = data.data.shop_info.good_list
            .filter(item => item.label?.caption === '首充商品角标')
            .map(item => ({
                title: item.title,
                available: !item.goods_limit?.reached_limit
            }));

        const first_recharge2 = data.data.shop_info.shelf_location?.[0]?.goods
            ?.filter(item => item.label?.caption === '首充商品角标')
            ?.map(item => ({
                title: item.title,
                available: !item.goods_limit?.reached_limit
            })) || [];

        return {
            username: data.data.user_info.user_name,
            uid,
            zone,
            first_recharge: [...first_recharge, ...first_recharge2]
        };
    } catch (err) {
        throw new Error('❌ Gagal mengambil data. Pastikan UID dan ZONE benar.');
    }
}

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply('Contoh: *.mobapay 1422073161|15910*');

    const [uid, zone] = args.join(' ').split('|');
    if (!uid || !zone) return m.reply('Format salah. Contoh: *.mobapay 1422073161|15910*');

    try {
        const res = await mobapay(uid.trim(), zone.trim());
        const available = res.first_recharge.filter(x => x.available);

        if (available.length === 0) {
            return m.reply(`🔍 *Info MobaPay MLBB*
👤 Username: ${res.username}
🆔 UID: ${res.uid}
🌐 Zone: ${res.zone}

❌ Semua bonus *first top-up* sudah diambil.
`);
        }

        const list = available
            .map(x => `- ${x.title} 💎`)
            .join('\n');

        m.reply(`🔍 *Info MobaPay MLBB*
👤 Username: ${res.username}
🆔 UID: ${res.uid}
🌐 Zone: ${res.zone}

✅ Paket *first top-up* yang masih tersedia:
${list}

💡 *Saran:* Lakukan top-up sekarang untuk mendapatkan double diamond dari paket di atas!
`);
    } catch (e) {
        m.reply(e.message);
    }
};

handler.command = ['mobapay'];
handler.tags = ['tools'];
handler.help = ['mobapay <uid>|<zone>'];

export default handler;