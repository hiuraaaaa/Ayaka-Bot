import fetch from 'node-fetch'

let handler = async (m, { text, conn, command }) => {
  if (!text) throw `Example: .hydro Hello`

  let res = await fetch('https://Lann4youoffc.biz.id/api/ai/hydromind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model: '@groq/qwen-2.5-32b',
      responses: 1
    }),
  })

  if (!res.ok) throw 'API Error!'

  let json = await res.json()
  let result = json.result || json.data || 'Tidak ada respon!'

  await m.reply(result)
}

handler.help = ['hydro <text>']
handler.tags = ['ai']
handler.command = ['hydro', 'hydromind']

export default handler