let confirm = {}

async function handler(m, { conn, args }) {

    if (m.sender in confirm) throw `Kamu sudah melakukan permintaan code event, silahkan kirim code event yang kamu miliki`
    try {
    let user = global.db.data.users[m.sender]
    if (!(m.sender in confirm)) {
      if (user.lastcode > 0) {
            confirm[m.sender] = {
                sender: m.sender,
                timeout: setTimeout(() => (m.reply('Waktu untuk menggunakan code event sudah habis, kamu bisa mengulang kembali'), delete confirm[m.sender]), 60000)
            }
            let txt = `Code Yang anda miliki: *Xrfnuyofcrk*\nSilahkan Replay Pesan ini menggunakan code event yang kamu miliki, jika ingin membatalkan, ketik *Batal / Cancel*`
            
            return conn.reply(m.chat, txt, m)
              } else {
              m.reply(`❗ *Kamu blum memiliki code event*\nKetik: #gcode`)
            }
           }
        } catch (e) {
        console.error(e)
        if (m.sender in confirm) {
            let { timeout } = confirm[m.sender]
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('Taruhan Batal!')
        }
    }
}

handler.before = async m => {
    if (!(m.sender in confirm)) return
    if (m.isBaileys) return
    let { timeout } = confirm[m.sender]
    let user = global.db.data.users[m.sender]
    let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
   
   try {
    if (/^(Xrfnuyofcrk|)?$/i.test(txt)) {
        if (user.lastcode >= 1) {
        let uang = `${Math.floor(Math.random() * 80000000)}`.trim()
        let exp = `${Math.floor(Math.random() * 1000000)}`.trim()
        let cash = 500 * 1
        let usec = user.lastcode * 1
          user.money += uang * 1
          user.exp += exp * 1
          user.cash += cash * 1
          user.lastcode = 0
          user.tomat = 3 * 1
        
        m.reply(`*✅ Cupon Berhasil di gunakan*

Kamu mendapatkan hadiah
*💸 Money:* ${uang.toLocaleString()}
*🧪 Exp:* ${exp.toLocaleString()}
*💰 Cash:* ${cash}

_Jangan Lupa bersyukur dan berterima kasih yaa :)_`)
      
      clearTimeout(timeout)
            delete confirm[m.sender]
            return !0
      } else {
       m.reply(`🚫 *kamu sudah menggunakan code tersebut*`)
       }
            
        } else if (/^(Batal|Cancel)?$/i.test(txt)) {
        clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply(`❌ *Penggunaan code di batalkan!*`)
            return !0
      }
     
     } catch (e) {
        clearTimeout(timeout)
        delete confirm[m.sender]
        if (usec > (user.lastcode * 1)) user.money = usec * 1
        m.reply('Gagal selakukan penggunaan code, mohon ulang kembali')
        return !0
    } finally {
        clearTimeout(timeout)
        delete confirm[m.sender]
        return !0
    }
 }
handler.help = ['ucode']
handler.tags = ['rpg']
handler.command = /^(ucode)$/i

handler.register = true
handler.owner = false
handler.group = true

export default handler