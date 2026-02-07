import axios from 'axios';
import https from 'node:https';
import crypto from 'node:crypto';

const BASE = "https://channelmonetizationcheck.net/";
const API = "https://api.channelmonetizationcheck.net/api/";
const REG_EXP = /<script\s?src\=['"](\/_next\/static\/chunks\/\d+-?\w+\.js)['"]\s?defer\=['"]+><\/script>/ig;
const REG_API = /\w+-\w+-\w+-\w+-\w+/i;
const SUM = {
  gaming: [0.25, 4],
  beautyFashion: [0.3, 6],
  technology: [0.5, 8],
  travel: [0.3, 6],
  healthFitness: [0.4, 7],
  finance: [0.5, 9],
  foodCooking: [0.3, 6],
  entertainment: [0.4, 7],
  newsPolitics: [0.2, 4],
  education: [0.5, 8],
  petAnimals: [0.3, 5],
  homeDIY: [0.3, 6],
  music: [0.4, 8]
};
const CATEGORY = [{
  id: "1",
  title: "Film & Animation",
  niche: "entertainment"
}, {
  id: "2",
  title: "Autos & Vehicles",
  niche: "entertainment"
}, {
  id: "10",
  title: "Music",
  niche: "music"
}, {
  id: "15",
  title: "Pets & Animals",
  niche: "petAnimals"
}, {
  id: "17",
  title: "Sports",
  niche: "entertainment"
}, {
  id: "19",
  title: "Travel & Events",
  niche: "travel"
}, {
  id: "20",
  title: "Gaming",
  niche: "gaming"
}, {
  id: "22",
  title: "People & Blogs",
  niche: "entertainment"
}, {
  id: "23",
  title: "Comedy",
  niche: "entertainment"
}, {
  id: "24",
  title: "Entertainment",
  niche: "entertainment"
}, {
  id: "25",
  title: "News & Politics",
  niche: "newsPolitics"
}, {
  id: "26",
  title: "Howto & Style",
  niche: "homeDIY"
}, {
  id: "27",
  title: "Education",
  niche: "education"
}, {
  id: "28",
  title: "Science & Technology",
  niche: "technology"
}, {
  id: "29",
  title: "Nonprofits & Activism",
  niche: "education"
}];

const agent = https.Agent({
  keepAlive: true,
  rejectUnauthorized: false
});

let headersList = {
  "authority": "api.channelmonetizationcheck.net",
  "accept": "*/*",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
  "cache-control": "no-cache",
  "origin": "https://channelmonetizationcheck.net",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "referer": "https://channelmonetizationcheck.net/",
  "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "Content-Type": "application/json",
  "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36"
};

function _delay(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

async function _req({ url, method = "GET", data = null, params = null, head = null, response = "json" }) {
  let headers = {};
  let param;
  let datas;

  if (head && head == "original" || head == "ori") {
    const uri = new URL(url);
    headers = {
      authority: uri.hostname,
      origin: "https://" + uri.hostname,
      'Cache-Control': 'no-cache',
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36"
    }
  } else if (head && typeof head == "object") {
    headers = head;
  }
  if (params && typeof params == "object") {
    param = params;
  } else {
    param = "";
  }
  if (data) {
    datas = data
  } else {
    datas = "";
  }

  const options = {
    url: url,
    method: method,
    headers,
    timeout: 30_000,
    responseType: response,
    httpsAgent: agent,
    validateStatus: (status) => {
      return status <= 500;
    },
    ...(!datas ? {} : { data: datas }),
    ...(!params ? {} : { params: param })
  }
  const res = await axios.request(options);

  return res;
}

async function _initApiKey() {
  let result = null;

  const res = await _req({
    url: BASE,
    method: "GET",
    head: "ori",
    response: "text"
  });
  let reg = [...res.data.matchAll(REG_EXP)];
  if (!reg) {
    console.log("[ ERROR ] Token not found")
  }
  reg = reg.reverse();
  for (let v of reg) {
    const res2 = await _req({
      url: BASE + v[1],
      method: "GET",
      head: "ori",
      response: "text"
    });
    let mat = res2.data.match(REG_API)
    if (mat) {
      result = mat[0];
      break;
    }
  }
  if (result == null) {
    console.log("[ ERROR ] Token not found")
  }

  headersList["x-api-key"] = result;
}

function _parseChannelID(url) {
  const uri = new URL(url.trim());
  if (!uri.host.match(/^(?:www.)?(youtube.com|youtu.be)/)) {
    console.log("[ ERROR ] Invalid Host");
  }
  const path = uri.pathname.split("/").filter(flr => flr);
  if (path[0] === "shorts") {
    return {
      type: "video/shorts",
      data: {
        videoId: path[1]
      }
    };
  } else if (path[0] === "watch") {
    const urlr = uri.searchParams.get("v");
    if (!urlr) {
      console.log("[ ERROR ] Invalid Url");
    }
    return {
      type: "video/normal",
      data: {
        videoId: urlr
      }
    };
  } else if (path[0] === "channel") {
    const chId = path[1];
    if (!chId) {
      console.log("[ ERROR ] Invalid Url");
    }
    return {
      type: "channel",
      data: {
        channelId: chId
      }
    };
  } else if (path[0].startsWith("@")) {
    const hnId = path[0];
    if (!hnId) {
      console.log("[ ERROR ] Invalid Url");
    }
    return {
      type: "channel",
      data: {
        handleId: hnId
      }
    };
  } else if (uri.host === "youtu.be") {
    const vidId = path[0];
    if (!vidId) {
      console.log("[ ERROR ] Invalid Url");
    }
    return {
      type: "video/normal",
      data: {
        videoId: vidId
      }
    };
  } else {
    console.log("[ ERROR ] Invalid Url")
    return null;
  }
}

function _serialize(data) {
  let {
    type
  } = data;
  
  switch (type) {
    case "channel": {
      let {
        info: {
          viewCount: l,
          monetization: r
        }
      } = data;
      const fInt = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });

      const re = Object.values(SUM).reduce((res, curr) => [(res[0] + curr[0]) / 2, (res[1] + curr[1]) / 2]);
      data.info.earning = r ? `${fInt.format(re[0] * (l / 1000))}  - ${fInt.format(re[1] * (l / 1000))}` : `${fInt.format(0)}`;
    } break;

    case "video": {
      let {
        info: {
          videoType: x,
          category: h,
          viewCount: u,
          monetization: r
        }
      } = data;
      const fIntV = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      });
      const cat = CATEGORY.filter(ct => {
        let {
          title: t
        } = ct;
        return t === h;
      });
      let entr = SUM.entertainment;
      if (cat.length > 0) {
        entr = SUM[cat[0].niche];
      }
      if (x === "shorts") {
        const ten = 10;
        entr = entr.map(itm => itm / ten);
      }
      data.info.earning = r ? `${fIntV.format(entr[0] * (u / 1000))}  - ${fIntV.format(entr[1] * (u / 1000))}` : `${fIntV.format(0)}`;
    } break;
  }
}

async function _decrypt(param1, param2) {
  try {
    const uArray = Uint8Array.from(Buffer.from(param1, "base64"));
    const salt = uArray.slice(0, 16);
    const iv = uArray.slice(16, 28);
    const data = uArray.slice(28);
    const derive = await crypto.subtle.importKey("raw", new TextEncoder().encode(param2), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({
      name: "PBKDF2",
      salt: salt,
      iterations: 250,
      hash: "SHA-256"
    }, derive, {
      name: "AES-GCM",
      length: 128
    }, false, ["decrypt"]);
    const dec = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: iv
    }, key, data);
    return new TextDecoder().decode(dec);
  } catch (o) {
    console.log(`Error - ${o}`);
    return "";
  }
}

async function _payload() {
  return _decrypt(["+2QIriCcywqRU/oZTGgr/qjkn2C2B3EAFl0inT8WE7g4p", "+FhKTttYporZbyray0VBuOLtKwBR5MN7O45Xjq4QxZ2YGSno", "+ncTZFWJFs4QsD/XCV9Su6phSTxRx77n78/2EnH5bNyx7LVsc4lm", "+zfBrXlPac="].join(""), "idWBC00p").then(val => _decrypt(val, "I0WB4kvdW"))
}

async function Monetization(link) {
  console.log("[ KEY ] Init...")
  await _initApiKey()
  console.log("[ ID ] Parse...")
  const data = _parseChannelID(link);
  console.log("[ ID ] " + JSON.stringify(data))

  console.log("[ GET ] Request...")
  let res = await _req({
    url: API + data.type,
    params: data.data,
    response: "json",
    method: "GET",
    head: headersList
  })
  res.data.data = await _decrypt(res.data.data, await _payload()).then(JSON.parse);
  _serialize({
    locale: "id_ID",
    ...res.data.data[0]
  });

  return res.data
}

const handler = async (m, { conn }) => {
  const link = m.text.split(' ')[1];
  if (!link) return m.reply('Masukkan link YouTube yang valid.');

  try {
    const monet = await Monetization(link);
    const data = monet.data[0];

    if (data.type === "channel") {
      const info = data.info;

      const message = `
*Channe Namel*: ${info.title}

*Subscriber*: ${info.subscriberCount || 'Tidak Diketahui'}

*Total Views*: ${info.viewCount}

*Monetization*: ${info.monetization ? '✅' : '❌'}

*Rata² Monetization*: ${info.earning}
      `;

      await conn.sendMessage(m.chat, { 
        text: message 
      }, { quoted: m });

    } else if (data.type === "video" || data.type === "video/shorts") {
      const info = data.info;

      const message = `
*°${info.title}*

*Type*: ${data.type}

*Type Video*: ${info.videoType}

*Viewer*: ${info.viewCount}

*Monetization*: ${info.monetization ? '✅' : '❌'}
*Asumsi Monetization*: ${info.monetizationAssume ? '✅' : '❌'}

*Rata² Monetization*: ${info.earning}

*Category*: ${info.category}
      `;

      await conn.sendMessage(m.chat, { 
        image: { url: info.thumbnailUrl },
        caption: message 
      }, { quoted: m });
    } else {
      await m.reply('Tipe data tidak dikenali.');
    }
  } catch (error) {
    console.error(error);
    await m.reply('Terjadi kesalahan saat memproses permintaan.');
  }
};

handler.help = ['monetization <link>'];
handler.tags = ['tools'];
handler.command = ['monetization'];
handler.limit = false;

export default handler;