import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

// Fungsi untuk membaca konfigurasi
export function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf8');
            return JSON.parse(data);
        } else {
            // Konfigurasi default jika file tidak ada
            const defaultConfig = {
                "seminggu": {
                    "nominal": 5000,
                    "bonus_limit": 1000,
                    "bonus_hari": 3,
                    "bonus_money": 10000000000
                },
                "bulanin": {
                    "nominal": 12000,
                    "bonus_limit": 5000,
                    "bonus_hari": 10
                },
                "tigabulan": {
                    "nominal": 23000,
                    "bonus_limit": 10000,
                    "bonus_hari": 15
                },
                "lapanbulan": {
                    "nominal": 50000,
                    "bonus_limit": 25000,
                    "bonus_hari": 30
                },
                "tahunin": {
                    "nominal": 90000,
                    "bonus_limit": 50000,
                    "bonus_hari": 45
                },
                "permanent": {
                    "nominal": 300000,
                    "bonus_limit": 100000,
                    "bonus_money": 10000000000
                }
            };
            saveConfig(defaultConfig);
            return defaultConfig;
        }
    } catch (error) {
        console.error('Error loading config:', error);
        return null;
    }
}

// Fungsi untuk menyimpan konfigurasi
export function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config:', error);
        return false;
    }
}

// Fungsi untuk mengupdate konfigurasi paket tertentu
export function updatePackageConfig(packageName, newConfig) {
    const config = loadConfig();
    if (config && config[packageName]) {
        config[packageName] = { ...config[packageName], ...newConfig };
        return saveConfig(config);
    }
    return false;
}

// Fungsi untuk mendapatkan konfigurasi paket tertentu
export function getPackageConfig(packageName) {
    const config = loadConfig();
    return config ? config[packageName] : null;
}

// Fungsi untuk menambah paket baru
export function addPackage(packageName, packageConfig) {
    const config = loadConfig();
    if (config) {
        config[packageName] = packageConfig;
        return saveConfig(config);
    }
    return false;
}

// Fungsi untuk menghapus paket
export function removePackage(packageName) {
    const config = loadConfig();
    if (config && config[packageName]) {
        delete config[packageName];
        return saveConfig(config);
    }
    return false;
}