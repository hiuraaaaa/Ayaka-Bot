const user = 500
const limit = 30
const money = 2500000

let handler = async (m, { conn, isPrems }) => {
    let time = global.db.data.users[m.sender].udahklaim + 600000
  if (new Date - global.db.data.users[m.sender].udahklaim < 600000) throw `Kamu Sudah Bilang Hari Ini\nTunggu Selama ${msToTime(time - new Date())} Lagi`
        global.db.data.users[m.sender].money += money
        global.db.data.users[m.sender].limit += limit
        conn.reply(m.chat, `Karna Kamu Muji \nFaisal Yang Ganteng>//<\nKamu Mendapatkan:\n\n+${limit} Limit\n+${money} Money`, m)
        global.db.data.users[m.sender].udahklaim = new Date * 1
    }
handler.customPrefix =
	/^(faisal ganteng)$/i;
handler.command = new RegExp();

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}