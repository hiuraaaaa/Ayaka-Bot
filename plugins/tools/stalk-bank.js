const bankList = [
  { code: "aceh", name: "Bank Aceh Syariah" },
  { code: "agris", name: "Bank IBK Indonesia" },
  { code: "agroniaga", name: "BRI Agroniaga" },
  { code: "amar", name: "Amar Indonesia" },
  { code: "anglomas", name: "Anglomas International Bank" },
  { code: "antar_daerah", name: "Bank CCB Indonesia" },
  { code: "andara", name: "Bank Andara" },
  { code: "anz", name: "ANZ Indonesia" },
  { code: "artha", name: "Bank Artha Graha Internasional" },
  { code: "artos", name: "Jago/Artos" },
  { code: "bali", name: "BPD Bali" },
  { code: "bangkok", name: "Bangkok Bank" },
  { code: "banten", name: "BPD Banten" },
  { code: "barclays", name: "Bank Barclays Indonesia" },
  { code: "bca", name: "Bank Central Asia" },
  { code: "bjb", name: "BJB" },
  { code: "bni", name: "BNI (Bank Negara Indonesia)" },
  { code: "bnp", name: "Bank BNP Paribas" },
  { code: "bri", name: "Bank Rakyat Indonesia" },
  { code: "bsi", name: "Bank Syariah Indonesia" },
  { code: "bukopin", name: "Wokee/Bukopin" },
  { code: "capital", name: "Bank Capital Indonesia" },
  { code: "centratama", name: "Centratama Nasional Bank" },
  { code: "chinatrust", name: "CTBC (Chinatrust) Indonesia" },
  { code: "cimb", name: "CIMB Niaga & CIMB Niaga Syariah" },
  { code: "citibank", name: "Citibank" },
  { code: "commonwealth", name: "Commonwealth Bank" },
  { code: "dana", name: "Dana" },
  { code: "danamon", name: "Bank Danamon & Danamon Syariah" },
  { code: "dbs", name: "DBS Indonesia" },
  { code: "deutsche", name: "Deutsche Bank" },
  { code: "dki", name: "Bank DKI Jakarta" },
  { code: "fama", name: "Bank Fama International" },
  { code: "ganesha", name: "Bank Ganesha" },
  { code: "gopay", name: "GoPay" },
  { code: "hana", name: "LINE Bank/KEB Hana" },
  { code: "harda", name: "Allo Bank/Bank Harda Internasional" },
  { code: "hsbc", name: "HSBC Indonesia" },
  { code: "ibk", name: "Bank IBK Indonesia" },
  { code: "icbc", name: "ICBC Indonesia" },
  { code: "ina_perdana", name: "Bank Ina Perdana" },
  { code: "index_selindo", name: "Bank Index Selindo" },
  { code: "india", name: "Bank of India Indonesia" },
  { code: "jambi", name: "Bank Jambi" },
  { code: "jasa_jakarta", name: "Bank Jasa Jakarta" },
  { code: "jenius", name: "Jenius" },
  { code: "kalteng", name: "BPD Kalimantan Tengah" },
  { code: "kaltim", name: "Bank Pembangunan Daerah Kaltim" },
  { code: "lampung", name: "Bank Lampung" },
  { code: "linkaja", name: "LinkAja" },
  { code: "mandiri", name: "Bank Mandiri" },
  { code: "mandiri_taspen", name: "Bank Mandiri Taspen" },
  { code: "mantap", name: "BANK MANTAP (Mandiri Taspen)" },
  { code: "maspion", name: "Bank Maspion Indonesia" },
  { code: "mayapada", name: "Bank Mayapada" },
  { code: "maybank", name: "Bank Maybank" },
  { code: "maybank_uus", name: "Maybank UUS" },
  { code: "mayora", name: "Bank Mayora Indonesia" },
  { code: "mega_syar", name: "Bank Mega Syariah" },
  { code: "mizuho", name: "Bank Mizuho Indonesia" },
  { code: "mnc", name: "Bank MNC Internasional" },
  { code: "multiarta", name: "Bank Multi Arta Sentosa" },
  { code: "muamalat", name: "Muamalat" },
  { code: "mutiara", name: "Bank Mutiara" },
  { code: "nobu", name: "Bank National Nobu" },
  { code: "ocbc", name: "OCBC NISP" },
  { code: "ovo", name: "OVO" },
  { code: "panin", name: "Panin Bank" },
  { code: "papua", name: "Bank Papua" },
  { code: "permata", name: "Bank Permata & Permata Syariah" },
  { code: "prima_master", name: "Prima Master Bank" },
  { code: "qnb", name: "Bank QNB Indonesia" },
  { code: "rabobank", name: "Rabobank International Indonesia" },
  { code: "resona", name: "Bank Resona Perdania" },
  { code: "sampoerna", name: "Bank Sahabat Sampoerna" },
  { code: "seabank", name: "SEA BANK" },
  { code: "shinhan", name: "Bank Shinhan Indonesia" },
  { code: "shopeepay", name: "ShopeePay" },
  { code: "sinarmas", name: "Bank Sinarmas" },
  { code: "stanchard", name: "Standard Chartered Bank" },
  { code: "sulselbar", name: "Bank Sulselbar" },
  { code: "sulut", name: "Bank SulutGo" },
  { code: "sumitomo", name: "Bank Sumitomo Mitsui Indonesia" },
  { code: "sumsel_babel", name: "BPD Sumsel dan Babel" },
  { code: "sumut", name: "Bank Sumut" },
  { code: "uob", name: "TMRW/UOB" },
  { code: "victoria", name: "Bank Victoria International" },
  { code: "woori", name: "Bank Woori Saudara" },
  { code: "yudha_bhakti", name: "Bank Yudha Bhakti" }
];

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  const number = text.trim();
  
  if (!number.includes(" ")) {
    let rows = bankList.map(b => ({
      header: b.code,
      title: b.name,
      description: `Pilih ${b.name}`,
      id: `.stalkbutton ${number} ${b.code}`
    }));
    let sections = [{
      title: "Daftar Bank",
      rows: rows
    }];
    let buttonMessage = {
      text: "Nomor rekening sudah diterima.\nSilakan pilih bank yang ingin digunakan:",
      footer: "Daftar Bank",
      buttons: [{
        buttonId: "action",
        buttonText: { displayText: "Pilih Bank" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "Pilih Bank",
            sections: sections
          })
        }
      }],
      headerType: 1,
      viewOnce: true
    };
    return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
  
  return m.reply(`Format perintah salah.\nGunakan:\n.stalkbank <nomor>`);
};

handler.help = ['stalkbank <nomor>'];
handler.tags = ['internet','tools'];
handler.command = ['stalkbank'];
export default handler;;