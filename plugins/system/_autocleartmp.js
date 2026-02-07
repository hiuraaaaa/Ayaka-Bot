import { exec } from 'child_process';
import cron from 'node-cron';

const clearTmp = async () => {
    try {
        const { stdout, stderr } = await exec('rm -rf tmp/*');
        if (stderr && stderr.length > 0) {
            throw new Error(stderr);
        }
        return true;
    } catch (e) {
        return false;
    }
};

cron.schedule('*/5 * * * *', async () => {
    await clearTmp();
}, { scheduled: true });

await clearTmp();