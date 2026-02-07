import axios from 'axios'
import * as cheerio from 'cheerio'

async function jadwalSholat(id) {
try {
     let ipah = await axios('https://jadwal-sholat.tirto.id/kota-tangerang', {
        method: 'GET',
        headers: {
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
           'Accept-Encoding': 'gzip, deflate, br',
           'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
           'Cookie': 'XSRF-TOKEN=eyJpdiI6Ijh6aVJxRjhocnVDMVFvNVBlclF6eHc9PSIsInZhbHVlIjoiK2xpXC84T2lGWGl3amFcL05adzRSVXlkU1ZPcUdwNjZ4Q3JcLzdmRDNncUIzVGhOeXI4NWtOaFwvMmdsSmNJaFE4SkF1eEdcL3ZWRWgzNG5EdmxvbDFcL2pBOXc9PSIsIm1hYyI6ImUzNjdjYjZlNzNiOGFiZjlhNWY1MDAxY2JjOGIyYTg5MWY5MDMwNDljZGIzMWQ0NTFhNGMyNTgzYjM1MjcxYjAifQ%3D%3D; laravel_session=eyJpdiI6InM5SDljZ3FBamdubUFQYyszd0ZMRkE9PSIsInZhbHVlIjoiNlljXC9UMGQ1XC9oWXgybjRHUFVIbmV2ZnZOSDNFMXE3RWU3Y0M1TVY4OHh0a2duU1dTcTNuY0JCdFBHOTRvZUE5SlkyRlU2MWlYend6aUQycjlHTWdhQT09IiwibWFjIjoiYWViYmRkODliZDMzYTNkY2YyYzUwMjBhYTQ5ODJmM2RlMzQ2ZTBiZjcwNjU2ZTA0YWZlYjRhOGM0NzZjMGEyYyJ9',
           'Referer': 'https://jadwal-sholat.tirto.id/',
           'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
           }
        })
     let html = ipah.data
     let $ = await cheerio.load(html)
     let div = $('div')
     let b = div.find('b[class]')
     let waktu = [];
     b.slice(6).each((i, e) => {
       if (i < 6) {
        let time = $(e).text()
        waktu.push({ time })
         }
     })
      let result = {
           status: true,
           creator: 'Lann4you',
           data: {
             subuh: waktu[0].time,
             dhuha: waktu[1].time,
             dzuhur: waktu[2].time,
             ashar: waktu[3].time,
             maghrib: waktu[4].time,
             isya: waktu[5].time
           }
      }
     console.log(result)
      return result
     } catch(error) {
       console.log(error)
       return error
     }
}

let handler = async(m, { conn, text, command }) => {
    let res = await jadwalSholat('Lann4you')
    let { subuh, dhuha, dzuhur, ashar, maghrib, isya } = res.data
    if (subuh) {
    let waktu = global.waktuSholat
    waktu.subuh = subuh
    waktu.dhuha = dhuha
    waktu.dzuhur = dzuhur
    waktu.ashar = ashar
    waktu.maghrib = maghrib
    waktu.isya = isya
    m.reply(`\`Sukses Menjadwalkan Waktu Sholat\``)
     }
}

handler.tags = ['owner']
handler.help = ['setsholat']
handler.command = /^(setsholat)$/i
handler.owner = true

export default handler