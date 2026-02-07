import Jimp from 'jimp';
import axios from 'axios';

const sessions = {};

class SnakeAndLadderGame {
	constructor(send) {
		this.send = send;
		this.players = [];
		this.positions = {};
		this.turnIndex = 0;
		this.started = false;
		this.snakesAndLadders = [
			{ start: 29, end: 7 }, { start: 24, end: 12 }, { start: 15, end: 37 },
			{ start: 23, end: 41 }, { start: 72, end: 36 }, { start: 49, end: 86 },
			{ start: 90, end: 56 }, { start: 75, end: 64 }, { start: 74, end: 95 },
			{ start: 91, end: 72 }, { start: 97, end: 78 }
		];
		this.bgUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg';
		this.p1Url = 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg';
		this.p2Url = 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg';
	}

	async start(p1, p2, m, session) {
		this.players = [p1, p2];
		this.positions[p1] = 1;
		this.positions[p2] = 1;
		this.started = true;
		this.turnIndex = 0;

		const sentMsg = await this.send(m.chat, {
			text: `Permainan dimulai!\nGiliran pertama: @${p1.split('@')[0]}`,
			mentions: [p1],
			buttons: [
				{ buttonId: '.ulartangga roll', buttonText: { displayText: '🎲 Roll' }, type: 1 }
			]
		}, { quoted: m });

		session.lastMessageKey = sentMsg.key;
	}

	rollDice() {
		return Math.floor(Math.random() * 6) + 1;
	}

	getCurrentPlayer() {
		return this.players[this.turnIndex];
	}

	getNextPlayer() {
		this.turnIndex = 1 - this.turnIndex;
		return this.players[this.turnIndex];
	}

	async move(m, player, session) {
		if (!this.started) return m.reply('Permainan belum dimulai.');
		if (player !== this.getCurrentPlayer()) return m.reply('❗ Bukan giliranmu.');

		if (session.lastMessageKey) {
			try {
				await this.send(m.chat, { delete: session.lastMessageKey });
			} catch (e) {
			}
		}

		const roll = this.rollDice();
		let pos = this.positions[player] + roll;
		let msg = `@${player.split('@')[0]} melempar dadu dan mendapat *${roll}*.\n`;

		const other = this.players.find(p => p !== player);
		if (this.positions[other] === pos) {
			msg += `\nMenimpa @${other.split('@')[0]}! Kembali ke posisi awal.`;
			this.positions[player] = 1;
		} else {
			const slide = this.snakesAndLadders.find(s => s.start === pos);
			if (slide) {
				msg += slide.start > slide.end
					? `\nAduh! Ular menggigit! Turun ke ${slide.end}.`
					: `\nHoki! Naik tangga ke ${slide.end}.`;
				pos = slide.end;
			}
			this.positions[player] = Math.min(pos, 100);
		}

		if (this.positions[player] >= 100) {
			this.started = false;
			msg += `\n\n@${player.split('@')[0]} menang permainan!`;
		} else {
			const next = this.getNextPlayer();
			msg += `\n\nGiliran selanjutnya: @${next.split('@')[0]}`;
		}

		const buffer = await this.drawBoard();

		const sentMsg = await this.send(m.chat, {
			image: buffer,
			caption: msg,
			mentions: this.players,
			buttons: this.started ? [
				{ buttonId: '.ulartangga roll', buttonText: { displayText: '🎲 Roll' }, type: 1 }
			] : []
		}, { quoted: m });
		
		session.lastMessageKey = sentMsg.key;
	}

	async drawBoard() {
		const bg = await this.fetchImage(this.bgUrl);
		const p1 = await this.fetchImage(this.p1Url);
		const p2 = await this.fetchImage(this.p2Url);
		const board = new Jimp(420, 420);
		bg.resize(420, 420);
		board.composite(bg, 0, 0);

		for (let i = 0; i < this.players.length; i++) {
			const pos = this.positions[this.players[i]];
			const x = ((pos - 1) % 10) * 40 + 10;
			const y = (9 - Math.floor((pos - 1) / 10)) * 40 + 10;
			const icon = (i === 0 ? p1 : p2).clone().resize(40, 40);
			board.composite(icon, x, y);
		}

		return board.getBufferAsync(Jimp.MIME_PNG);
	}

	async fetchImage(url) {
		const res = await axios.get(url, { responseType: 'arraybuffer' });
		return await Jimp.read(Buffer.from(res.data));
	}
}

const handler = async (m, { conn, args, command, usedPrefix }) => {
	const sessionId = m.chat;
	if (!sessions[sessionId]) sessions[sessionId] = { game: new SnakeAndLadderGame(conn.sendMessage.bind(conn)), players: [], lastMessageKey: null };

	const session = sessions[sessionId];
	const game = session.game;
	const from = m.sender;

	const subcmd = args[0] ? args[0].toLowerCase() : '';

	switch (subcmd) {
		case '':
			return conn.sendMessage(m.chat, {
				text: `🎲 *Ular Tangga*\n\n${usedPrefix}ulartangga create - Buat room\n${usedPrefix}ulartangga join - Gabung room\n${usedPrefix}ulartangga start - Mulai\n${usedPrefix}ulartangga roll - Lempar dadu\n${usedPrefix}ulartangga reset - Reset`,
				buttons: [
					{ buttonId: '.ulartangga create', buttonText: { displayText: '➕ Create' }, type: 1 },
					{ buttonId: '.ulartangga join', buttonText: { displayText: '✋ Join' }, type: 1 },
					{ buttonId: '.ulartangga start', buttonText: { displayText: '▶️ Start' }, type: 1 },
				]
			}, { quoted: m });

		case 'create':
			if (game.started) return m.reply('Permainan sedang berlangsung.');
			session.players = [from];
			game.started = false;
			session.lastMessageKey = null;
			return m.reply('Room dibuat! Menunggu pemain lain dengan `.ulartangga join`.');

		case 'join':
			if (session.players.includes(from)) return m.reply('Kamu sudah bergabung.');
			if (session.players.length >= 2) return m.reply('Room penuh.');
			session.players.push(from);
			return m.reply(`@${from.split('@')[0]} bergabung!`, null, { mentions: [from] });

		case 'start':
			if (session.players.length !== 2) return m.reply('Butuh 2 pemain untuk mulai.');
			await game.start(session.players[0], session.players[1], m, session);
			break;

		case 'roll':
			if (!game.started) return m.reply('Belum dimulai.');
			if (!session.players.includes(from)) return m.reply('Kamu bukan pemain dalam game ini.');
			await game.move(m, from, session);
			break;

		case 'reset':
			session.players = [];
			session.lastMessageKey = null;
			sessions[sessionId] = { game: new SnakeAndLadderGame(conn.sendMessage.bind(conn)), players: [], lastMessageKey: null };
			return m.reply('Permainan direset.');

		default:
			return;
	}
};

handler.help = ['ulartangga'];
handler.tags = ['game'];
handler.command = /^ulartangga$/i;

export default handler;