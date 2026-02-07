import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { lookup } from 'mime-types'
import { URL_REGEX } from '@adiwajshing/baileys'
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

    text = text.endsWith('SMH') ? text.replace('SMH', '') : text.trim()
    if (!text) throw 'Eh Senpai, kasih query dong, aku bingung mau cari apa!'

    let jumlahFoto = args && !isNaN(args[0]) ? parseInt(args[0]) : 1
    if (jumlahFoto > 5) throw 'Waduh Senpai, kebanyakan! Maksimum 5 foto aja ya.'

    const forbiddenKeywords = ['porn', 'xxx', 'adult', 'nsfw', 'sex', '18+', 'hentai', 'nude', 'erotic', 'sexy', 'hot', 'naked', 'bikini', 'lingerie', 'gay', 'lesbian', 'fuck', 'shit', 'damn', 'ass', 'boob', 'tits', 'dick', 'pussy', 'cum', 'sperm', 'horny', 'lust', 'strip', 'tease', 'seduce', 'fetish', 'kinky', 'bdsm', 'incest', 'taboo', 'bokep', 'ngentod', 'ngentot', 'kontol', 'memek', 'penis', 'vagina', 'payudara', 'ngocok', 'colmek', 'jembut', 'pepek', 'puki', 'tokoh', 'sepong', 'blowjob', 'jilmek', 'jilat', 'ewe', 'ngewe', 'entot', 'entod', 'sodok', 'coli', 'janda', 'bispak', 'bisyar', 'ml', 'ngentub', 'bugil', 'telanjang', 'bokep']
    if (forbiddenKeywords.some(keyword => text.toLowerCase().includes(keyword))) throw 'Yah Sensei, kata kuncinya ga boleh gitu, aku kan AI sopan!'

    for (let i = 0; i < jumlahFoto; i++) {
        try {
            let res = await pinterest(text)
            if (!res || res.length === 0) throw `Query "${text}" ga ketemu, coba yang lain ya Sensei!`
            
            let randomPin = res[Math.floor(Math.random() * res.length)]
            let mime = await lookup(randomPin.image)
            let link = await shortUrl(randomPin.image)

            if (!mime.startsWith('image/')) throw 'Hasilnya bukan gambar nih, skip dulu ya Sensei!'

            text.match(URL_REGEX) ?
                await conn.sendMessage(m.chat, { [mime.split('/')[0]]: { url: randomPin.image }, caption: `Dari: ${text.capitalize()}\nServer: Utama\nLink: ${link}` }, { quoted: m }) :
                await conn.sendFile(m.chat, randomPin.image, `${text}-${i}.jpeg`, `Dari: ${text.capitalize()}\nServer: Utama\nLink: ${link}`, m, false)

            conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (pinterestError) {
            try {
                await conn.reply(m.chat, `Server utama bermasalah nih, aku coba server cadangan ya Senpai!`, m)
                conn.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } })

                const imageUrl = await googleImageSearch(text)
                const mime = await lookup(imageUrl)
                const link = await shortUrl(imageUrl)

                if (!mime.startsWith('image/')) throw 'Lagi-lagi bukan gambar, sabar ya Sensei!'

                await conn.sendFile(m.chat, imageUrl, `${text}-${i}.jpeg`, `Dari: ${text.capitalize()}\nServer: Cadangan\nLink: ${link}`, m, false)

                conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

            } catch (googleError) {
                await conn.reply(m.chat, `Waduh Senpai, gambarnya ga ketemu di kedua server!`, m)
                conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
}

handler.help = ['pinterest <jumlah foto> <pencarian>']
handler.tags = ['downloader', 'internet']
handler.command = /^pin(terest)?$/i
handler.limit = 2
handler.register = true

export default handler

async function getCookies() {
    try {
        const response = await axios.get('https://www.pinterest.com/csrf_error/')
        const setCookieHeaders = response.headers['set-cookie']
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.map(cookieString => {
                const cookieParts = cookieString.split(';')
                const cookieKeyValue = cookieParts[0].trim()
                return cookieKeyValue
            })
            return cookies.join('; ')
        } else {
            console.warn('No set-cookie headers found in the response.')
            return null
        }
    } catch (error) {
        console.error('Error fetching cookies:', error)
        return null
    }
}

async function pinterest(query) {
    try {
        const cookies = await getCookies()
        if (!cookies) throw 'Gagal ambil cookies, server utama bermasalah nih Sensei!'

        const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/'
        const forbiddenKeywords = ['porn', 'xxx', 'adult', 'nsfw', 'sex', '18+', 'hentai', 'nude', 'erotic', 'sexy', 'hot', 'naked', 'bikini', 'lingerie', 'gay', 'lesbian', 'fuck', 'shit', 'damn', 'ass', 'boob', 'tits', 'dick', 'pussy', 'cum', 'sperm', 'horny', 'lust', 'strip', 'tease', 'seduce', 'fetish', 'kinky', 'bdsm', 'incest', 'taboo', 'bokep', 'ngentod', 'ngentot', 'kontol', 'memek', 'penis', 'vagina', 'payudara', 'ngocok', 'colmek', 'jembut', 'pepek', 'puki', 'tokoh', 'sepong', 'blowjob', 'jilmek', 'jilat', 'ewe', 'ngewe', 'entot', 'entod', 'sodok', 'coli', 'janda', 'bispak', 'bisyar', 'ml', 'ngentub', 'bugil', 'telanjang']

        const params = {
            source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
            data: JSON.stringify({
                "options": {
                    "isPrefetch": false,
                    "query": query,
                    "scope": "pins",
                    "no_fetch_context_on_resource": false
                },
                "context": {}
            }),
            _: Date.now()
        }

        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookies,
            'dnt': '1',
            'referer': 'https://www.pinterest.com/',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/[username]/[slug].js',
            'x-pinterest-source-url': '/hargr003/cat-pictures/',
            'x-requested-with': 'XMLHttpRequest'
        }

        const { data } = await axios.get(url, {
            headers: headers,
            params: params
        })

        const container = []
        const results = data.resource_response.data.results.filter((v) => v.images?.orig)
        results.forEach((result) => {
            const captionLower = result.grid_title.toLowerCase()
            if (!forbiddenKeywords.some(keyword => captionLower.includes(keyword))) {
                container.push({
                    upload_by: result.pinner.username,
                    fullname: result.pinner.full_name,
                    followers: result.pinner.follower_count,
                    caption: result.grid_title,
                    image: result.images.orig.url,
                    source: "https://id.pinterest.com/pin/" + result.id,
                })
            }
        })

        if (container.length === 0) throw `Gambarnya ga aman atau ga ketemu nih, aku skip ya Senpai!`
        return container
    } catch (error) {
        throw error
    }
}

async function googleImageSearch(query) {
    const apiKey = global.GoogleApi
    const cx = global.GoogleCx

    if (!apiKey || !cx) throw 'API Key atau CX-nya ga ada, hubungi admin ya Senpai!'

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}&searchType=image&num=1&safe=active`
    const response = await axios.get(url)
    const items = response.data.items

    if (!items || items.length === 0) throw 'Gambar ga ketemu di Google, maaf ya Sensei!'
    return items[0].link
}

async function shortUrl(url) {
    try {
        return await (await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)).text()
    } catch (e) {
        return url
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}