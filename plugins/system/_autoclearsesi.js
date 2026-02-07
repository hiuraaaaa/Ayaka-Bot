import { promises as fs } from 'fs';
import path from 'path';

const directoryPath = './sessions';
const pollInterval = 3600000; // Polling interval in milliseconds (1 hour)

// Function to check if the file is a "sampah" file
function isSampahFile(file) {
    return (file.startsWith('pre-key') ||
        file.startsWith('sender-key') ||
        file.startsWith('session-') ||
        file.startsWith('app-state')) &&
        file !== 'creds.json';
}

// Function to clean the sessions folder
async function cleanSessionsFolder() {
    try {
        const files = await fs.readdir(directoryPath);
        const filteredArray = files.filter(isSampahFile);

        console.log(`Found ${filteredArray.length} files to delete.`);
        
        if (filteredArray.length > 0) {
            let teks = '';
            filteredArray.forEach((file, i) => {
                teks += `${i + 1}. ${file}\n`;
            });

            console.log(teks);

            for (const file of filteredArray) {
                const filePath = path.join(directoryPath, file);
                try {
                    await fs.unlink(filePath);
                    console.log(`Deleted file: ${file}`);
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        // File not found, possibly already deleted, handle gracefully
                        console.warn(`File not found (possibly already deleted): ${file}`);
                    } else {
                        // Other errors, rethrow
                        throw err;
                    }
                }
            }
            console.log('All specified files have been deleted.');
        } else {
            console.log('No files to delete.');
        }
    } catch (err) {
        console.error('Error reading the directory:', err);
    }
}

// Function to start polling
function startPolling() {
    setInterval(cleanSessionsFolder, pollInterval);
}

// Start polling
startPolling();
console.log(`Started polling for file changes in ${directoryPath} every ${pollInterval / 1000 / 60} minutes.`);