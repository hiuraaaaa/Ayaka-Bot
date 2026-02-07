import cron from 'node-cron';

let closeGroupJob, openGroupJob;

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let chat = global.db.data.chats[m.chat];
  let action = (args[0] || '').toLowerCase();

  if (action === 'on') {
    let closeTime = args[1];
    let openTime = args[2];

    if (!closeTime || !/^\d{2}:\d{2}$/.test(closeTime) || !openTime || !/^\d{2}:\d{2}$/.test(openTime)) {
      return conn.reply(m.chat, 'Format waktu salah. Gunakan format HH:MM (misalnya, 20:00 06:00).', m);
    }

    // Parse the times
    let [closeHour, closeMinute] = closeTime.split(':').map(Number);
    let [openHour, openMinute] = openTime.split(':').map(Number);

    // Stop any existing scheduled jobs
    if (closeGroupJob) closeGroupJob.stop();
    if (openGroupJob) openGroupJob.stop();

    // Schedule close job
    closeGroupJob = cron.schedule(`${closeMinute} ${closeHour} * * *`, async () => {
      await conn.groupSettingUpdate(m.chat, 'announcement');
      conn.reply(m.chat, 'Grup ditutup sekarang.', m);
    }, {
      timezone: "Asia/Jakarta"
    });

    // Schedule open job
    openGroupJob = cron.schedule(`${openMinute} ${openHour} * * *`, async () => {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
      conn.reply(m.chat, 'Grup dibuka sekarang.', m);
    }, {
      timezone: "Asia/Jakarta"
    });

    chat.autopilot = {
      enabled: true,
      closeTime,
      openTime
    };

    conn.reply(m.chat, `Autopilot grup diaktifkan: Grup akan ditutup pada pukul ${closeTime} dan dibuka pada pukul ${openTime}.`, m);
  } else if (action === 'off') {
    if (closeGroupJob) closeGroupJob.stop();
    if (openGroupJob) openGroupJob.stop();

    chat.autopilot = {
      enabled: false
    };

    conn.reply(m.chat, 'Autopilot grup dinonaktifkan.', m);
  } else {
    conn.reply(m.chat, 'Perintah tidak valid. Gunakan "on <jam tutup> <jam buka>" atau "off".', m);
  }
};

handler.help = ['autopilotgroup']
handler.tags = ['group']
handler.command = /^autopilotgroup$/i

handler.group = true
handler.admin = true

export default handler;