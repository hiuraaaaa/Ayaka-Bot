const handler = async (m, { conn }) => {
  conn.customGame = conn.customGame || {};

  if (conn.customGame[m.chat]) return m.reply('Anda sedang bermain game kustom!');
  
  let playerPosition, monsterPosition;
  do {
    playerPosition = Math.floor(Math.random() * 6);
    monsterPosition = Math.floor(Math.random() * 6);
  } while (playerPosition === monsterPosition);

  let gameState = `🎮 Game Kustom 🎯

Posisi Pemain:
${"·".repeat(playerPosition)}👤${"·".repeat(5 - playerPosition)}
Posisi Monster:
${"·".repeat(monsterPosition)}👾${"·".repeat(5 - monsterPosition)}
Ketik *'kanan'* untuk bergerak ke kanan.
Ketik *'kiri'* untuk bergerak ke kiri.`;

  let { key } = await conn.reply(m.chat, gameState, m);

  conn.customGame[m.chat] = {
    playerPosition,
    monsterPosition,
    key,
    oldKey: key,
    moveCount: 0,
    maxMoves: 5,
    roomId: m.chat,
    timeout: setTimeout(() => {
      if (conn.customGame && conn.customGame[m.chat] && conn.customGame[m.chat].roomId === m.chat) {
        conn.sendMessage(m.chat, { delete: key });
        delete conn.customGame[m.chat];
      }
    }, 60000 * 2),
  };
};

handler.before = async (m, { conn }) => {
  conn.customGame = conn.customGame || {};
  if (!conn.customGame[m.chat] || conn.customGame[m.chat].roomId !== m.chat || !['kiri', 'kanan'].includes(m.text.toLowerCase())) return;

  let gameData = conn.customGame[m.chat];
  let { playerPosition, monsterPosition, key, oldKey, moveCount, maxMoves, timeout } = gameData;
  
  if (m.quoted || m.quoted.id == key) {
    if (m.text.toLowerCase() === 'kiri') {
      if (playerPosition > 0) {
        playerPosition--;
        moveCount++;
      } else {
        return m.reply('Anda sudah berada di batas kiri!');
      }
    } else if (m.text.toLowerCase() === 'kanan') {
      if (playerPosition < 5) {
        playerPosition++;
        moveCount++;
      } else {
        return m.reply('Anda sudah berada di batas kanan!');
      }
    }

    if (playerPosition === monsterPosition) {
      conn.sendMessage(m.chat, { delete: oldKey });
      delete conn.customGame[m.chat];
      return conn.reply(m.chat, '🎉 Selamat! Anda berhasil menangkap monster!', m);
    } else if (moveCount === maxMoves) {
      conn.sendMessage(m.chat, { delete: oldKey });
      delete conn.customGame[m.chat];
      return conn.reply(m.chat, '😔 Anda kalah! Anda sudah mencapai batas maksimum gerakan.', m);
    }

    let gameState = `🎮 Game Kustom 🎯

Posisi Pemain:
${"·".repeat(playerPosition)}👤${"·".repeat(5 - playerPosition)}
Posisi Monster:
${"·".repeat(monsterPosition)}👾${"·".repeat(5 - monsterPosition)}
Ketik *'kanan'* untuk bergerak ke kanan.
Ketik *'kiri'* untuk bergerak ke kiri.`;

    let msg = await conn.relayMessage(m.chat, {
      protocolMessage: {
        key: key,
        type: 14,
        editedMessage: {
          conversation: gameState
        }
      }
    }, {});

    let additionalData = {
      ...gameData,
      playerPosition,
      moveCount,
      key: { id: msg }
    };

    conn.customGame[m.chat] = Object.assign({}, conn.customGame[m.chat], additionalData);
  }
};

handler.help = ['customgame'];
handler.tags = ['game'];
handler.command = /^(customgame)$/i;

export default handler;