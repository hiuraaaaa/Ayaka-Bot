import axios from 'axios'

import FormData from 'form-data'

export default async function uploadImage(buffer) {

  try {

    const { data: html } = await axios.get("https://freeimage.host/");

    const token = html.match(/PF.obj.config.auth_token = "(.+?)";/)[1];

    const form = new FormData();

    form.append("source", buffer, 'file.jpg');

    form.append("type", "file");

    form.append("action", "upload");

    form.append("timestamp", Math.floor(Date.now() / 1000));

    form.append("auth_token", token);

    form.append("nsfw", "0");

    const { data } = await axios.post("https://freeimage.host/json", form, {

      headers: { "Content-Type": "multipart/form-data", ...form.getHeaders() },

    });

    if (data && data.image && data.image.url) {

      return data.image.url;

    } else {

      throw new Error("Upload gagal, URL tidak diterima.");

    }

  } catch (err) {

    throw new Error(`Upload gagal: ${err.message}`);

  }

}