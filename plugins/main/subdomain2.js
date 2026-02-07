import axios from "axios"

let handler = async (m, { conn, text }) => {
    let teks = text.split('|')[2]
    text = text.split('|')
    if (!text[0]) return m.reply('Masukan Nama Subdomain')
    if (!text[1]) return m.reply('Masukan IP Address')
    
    let prot = new subdomain({
        zone: 'e4b657c780edc7782f0efedf9ea10e92',
        token: 'Hz4Hd07WL-ZQtF0xx4DjWmNqHZwHXh_Pt9M9W9li',
        domain: teks ? teks : 'fufufafa.fun' /* thanks to domain by verlang */
    })

    try {
        const { name, success } = await prot.create(text[0], text[1])
        if (!success) throw 'Maaf ada kesalahan sistem'
        await m.reply(`*\`Berhasil membuat domain\`*\n\n*Name*: \`${name}\`\n*IP Address*: \`${text[1]}\`\n\n${namebot}`)
    } catch (e) {
        throw e
    }
}

handler.help = handler.command = ["subdomain2"]
handler.tags = ["developer"]
handler.rowner = true

export default handler

const base = "https://api.cloudflare.com"

export class subdomain {
    constructor({ zone, token, domain }) {
        this.zone = zone
        this.token = token
        this.domain = domain
        if (!this.zone) throw new Error("Zone not found")
        if (!this.token) throw new Error("Token not found")
        if (!this.domain) throw new Error("Domain not found")
    }

    async create(host, ip) {
        return new Promise(async (resolve) => {
            axios.post(
                `${base}/client/v4/zones/${this.zone}/dns_records`,
                {
                    type: "A",
                    name: host.replace(/[^a-z0-9.-]/gi, "") + "." + this.domain,
                    content: ip.replace(/[^0-9.]/gi, ""),
                    ttl: 3600,
                    priority: 10,
                    proxied: true
                },
                {
                    headers: {
                        Authorization: "Bearer " + this.token,
                        "Content-Type": "application/json"
                    }
                }
            ).then((e) => {
                let res = e.data
                if (res.success) resolve({
                    success: true,
                    zone: res.result?.zone_name,
                    name: res.result?.name,
                    ip: res.result?.content
                })
            }).catch((e) => {
                let err1 = e.response?.data?.errors?.[0]?.message || e.response?.data?.errors || e.response?.data || e.response || e
                resolve({
                    success: false,
                    error: String(err1)
                })
            })
        })
    }
}