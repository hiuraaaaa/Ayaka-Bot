//Nuyy Ofc
import fs from 'fs';
import axios from 'axios';

let handler = async(m, { conn, text }) => {
  
     let data = fs.readFileSync('./lib/couple.js');
     let  jsonData = JSON.parse(data);
     let randIndex = Math.floor(Math.random() * jsonData.length);
     let json = jsonData[randIndex];
     let laki = await ipahBuffer(json.cowo);
     await conn.sendMessage(m.chat, { image: laki, caption: '*: Lanang*', quoted: m })
     let cewe = await ipahBuffer(json.cewe);
     conn.sendMessage(m.chat, { image: cewe, caption: '*: Wedon*', quoted: m })
}
handler.tags = ['internet']
handler.help = ['ppcp','ppcouple']
handler.command = /^(ppcp|ppcouple)/i
handler.limit = true
handler.register = true

export default handler

const ipahBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
                    'User-Agent': 'GoogleBot',
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}