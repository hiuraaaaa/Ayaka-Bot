import fs from 'fs'
let handler = async (m, { conn, args, command }) => {
  let name = conn.getName(m.sender)
let sub = `*Hi ${name} 👋*

▭▬▭( *LIST DOMAIN PRIVATE* )▭▬▭

┏━━━━━━━━━━━━━━━━━━━
┣ .domain1 panellstore.com
┣ .domain2 panellstore.net
┣ .domain3 panellstore.icu
┣ .domain4 panellstore.xyz
┣ .domain5 panellstore.art
┣ .domain6 panellkuu.com
┣ .domain7 jasa-panel.my.id 
┣ .domain8 didinsec.biz.id 
┣ .domain9 putraoffc.cfd 
┣ .domain10 sellerpannel.my.id 
┣ .domain11 pannelku.icu
┣ .domain12 pannelku.cfd
┣ .domain13 putraoffc.site
┣ .domain14 putraoffc.com 
┣ .domain15 kangpannel.xyz 
┣ .domain16 mypannelku.com 
┣ .domain17 pannelmurah.xyz
┣ .domain18 storepannel.xyz
┣ .domain19 tokopannel.xyz
┣ .domain20 mypannel.cfd
┣ .domain21 adminpannel.xyz
┣ .domain22 mypannel.icu
┣ .domain23 tokocpannelmurah.xyz
┣ .domain24 websitepannelmurah.com
┣ .domain25 panellku.my.id
┣ .domain26 panellku.me 
┣ .domain27 panellku.biz.id 
┣ .domain28 panellku.tech 
┣ .domain29 panelkuu.xyz
┣ .domain30 panellku.com
┣ .domain31 biistoreee.tech
┣ .domain32 biistoreee.xyz 
┣ .domain33 rulzxyxd.com 
┣ .domain34 rafatharoffc.dev
┣ .domain35 rafatharoffcial.dev
┣ .domain36 rizalshop.my.id
┣ .domain37 panelku.link
┣ .domain38 sanzyy.xyz
┣ .domain39 home-panel.pw ( prem )
┣ .domain40 aswinxd.me
┣ .domain41 panel-zall.me ( prem )
┣ .domain42 digital-market.me
┣ .domain43 rafatharofficial.my.id
┣ .domain44 tokodigital.software
┣ .domain45 agen-panell.tech ( prem )
┣ .domain46 privateyour.me ( owner )
┣ .domain47 crazyyhosting.xyz
┣ .domain48 servershop.biz.id
┣ .domain49 rumahpanel.xyz ( prem ) 
┣ .domain50 controlpanel.site ( prem )
┣ .domain51 sellerpanel.me ( prem )
┣ .domain52 panelstoree.tech ( prem )
┣ .domain53 toko-pannelmurah.biz.id ( prem )
┣ .domain54 vvip-pannel.online ( prem ) 
┣ .domain55 rafatharoffcial-private.me ( prem )
┣ .domain56 amaliasyva-private.tech ( prem )
┣ .domain57 kangpane.me ( prem )
┣ .domain58 rizalxalfi.com ( prem )
┗━━━━━━━━━━━━━━━━━━━

*NOTE :*

*> JOIN SUBDO? PM Ponta Sensei*
*wa.me/6283857182374*
*> DOMAIN PRIVATE KHUSUS OWNER!*
*> DOMAIN PREM ( ANTI DDOS )*
*> JADI BIASA SUBDO 10K*
*> JADI PREM SUBDO 20K*

*PERINGATAN :*

*> NO PAMER DOMAIN ANTI DDOS! KETAHUAN KICK NO REFF!!!*

 *Powered By* *Ponta Sensei*`
 conn.sendMessage(m.chat, {
text: sub, 
contextInfo: {
externalAdReply: {
title: "BERIKUT ADALAH SUBDOMAIN",
body: 'Request Fitur Hubungin Owner',
thumbnailUrl: 'https://telegra.ph/file/d47c4ec174ef1d2d4b6c5.jpg', 
sourceUrl: "",
mediaType: 1,
renderLargerThumbnail: true
}
},sub: sub},{quoted: m })
}
handler.help = ['subdomain']
handler.tags = ['panel']
handler.command = /^(subdomain)$/i;
export default handler