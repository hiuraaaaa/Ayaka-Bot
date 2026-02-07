import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import uploadFile from '../lib/uploadFile.js';

async function hdvid() {
    try {
        const videoPath = './media/video_to_convert.mp4';

        // Baca file video yang akan dikonversi
        const videoBuffer = fs.readFileSync(videoPath);

        let form = new FormData();
        form.append('video-file', new Blob([videoBuffer]), 'video.mp4');

        const response = await fetch('https://hdconvert.com/convert', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw new Error('Failed to access hdconvert.com');
        }

        const html = await response.text();
        const { document } = new JSDOM(html).window;

        const form2 = new FormData();
        const obj = {};
        for (const input of document.querySelectorAll('form input[name]')) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }

        const response2 = await fetch(`https://hdconvert.com/convert/${obj.file}`, {
            method: 'POST',
            body: form2
        });

        if (!response2.ok) {
            throw new Error('Failed to access hdconvert.com');
        }

        // Simpan video yang telah dikonversi kembali
        const convertedVideoBuffer = await response2.buffer();
        fs.writeFileSync(videoPath, convertedVideoBuffer);

        // Unggah video yang telah dikonversi kembali
        const uploadedUrl = await uploadFile(videoPath);

        return uploadedUrl;
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

export { hdvid };