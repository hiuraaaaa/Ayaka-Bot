import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('promtpnya?')

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "key": "TouFyL4VyhWWNhqC3DnF5hAdR2fLXxgGY4Gpe4BqC8YGKE2j4NjuNrJAXetE",
        "prompt": text,
        "negative_prompt": "ugly, deformed, noisy, blurry, distorted, out of focus, bad anatomy, extra limbs, poorly drawn face, poorly drawn hands, missing fingers",
        "width": "720",
        "height": "720",
        "samples": "1",
        "num_inference_steps": "20",
        "seed": null,
        "guidance_scale": 7.5,
        "safety_checker": "yes",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "upscale": "no",
        "embeddings_model": null,
        "webhook": null,
        "track_id": null
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        let response = await fetch("https://stablediffusionapi.com/api/v3/text2img", requestOptions);
        let result = await response.json();
        conn.sendMessage(m.chat, { image: { url: result.output[0] }, caption: result.meta.prompt }, { quoted: m });
    } catch (error) {
        console.log('error', error);
        conn.sendMessage(m.chat, { image: { url: `${error.config.url}` }, caption: text }, { quoted: m });
    }
}

handler.help = ["diffusion"]
handler.tags = ["ai"];
handler.command = ["diff", "diffusion"];
export default handler;