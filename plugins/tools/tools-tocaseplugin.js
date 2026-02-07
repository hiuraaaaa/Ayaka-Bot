import axios from 'axios';

let handler = async (m, {text})=>{
	const PROGE = `SAYA INGIN ANDA MENGKONVERSI CASE INI KE PLUGIN!!\nSETIAP CASE ADALAH 1 PLUGIN\n\nCONTOH ubah PLUGIN\n\`\`\`javascript\n\nconst handler = async (m, { conn, text, command /*selain m import dari sini, conn bisa saja memiliki nama lain seperti sock atau nama khusus*/ }) => {\n    try {\n        m.reply('Tes berhasil');\n        conn.sendMessage(m.chat, {});\n        conn.sendFile();\n        conn.relayMessage();\n        conn.query(); //atau apa saja conn atau sock memiliki banyak fungsi khusus begitu juga m\n    } catch (error) {\n        console.error('Plugin error:', error);\n        m.reply(\`❌ *ERROR:* \${error.message}\`);\n    }\n};\n\nhandler.command = /^(vaxiona?)$/i; //ubah case ke dalam command regex\nhandler.premium = true; //jika butuh premium\nhandler.limit = true; //jika butuh limit\nhandler.owner = true; //jika hanya owner yang bisa\nhandler.tags = [\"command\"] //seluruh command Yang ada dalam case juga karena case bisa memiliki banyak kondisi dalam 1 fungsi\n\nexport default handler;\n\`\`\`\n\njawab dalam format javascript saja dan tidak perlu kasih penjelasan cukup kode dengan format\n\`\`\`javascript\n\`\`\`\nJIKA ADA BANYAK CASE MAKA\n\`\`\`javascript\n\`\`\`\n\`\`\`javascript\n\`\`\`\n...\n\nBERIKUT CODE CASENYA:\n`;;
	const { data: potongan } = await axios.get('https://api.siputzx.my.id/api/ai/gpt3?prompt=kamu adalah chatgpt&content='+PROGE+text);
	const plugine = potongan.data.split('```javascript');
	for(let pluge of plugine){
		await m.reply(pluge.replace(/```[\s\n]*$/, ""));
	}
}

handler.command = /^((case)?(to|2)plugin)$/i

export default handler;;