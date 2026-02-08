const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const gamesPath = path.join(__dirname, '../all_games_export.json');
const localesPath = path.join(__dirname, '../public/locales');

// Helper to generate keys (Must match GameCard.jsx)
const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

const langMap = {
    'en': 'en',
    'zh': 'zh-CN',
    'vi': 'vi',
    'th': 'th',
    'id': 'id',
    'ar': 'ar',
    'ja': 'ja',
    'ko': 'ko',
    'fil': 'tl',
    'ms': 'ms'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('Loading games...');
    const games = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

    const uniqueGames = new Map(); // key -> English Name
    const uniqueProviders = new Map(); // key -> English Title

    games.forEach(game => {
        if (game.name) {
            const key = toCamelCase(game.name);
            uniqueGames.set(key, game.name);
        }
        if (game.provider_title) {
            const key = toCamelCase(game.provider_title);
            uniqueProviders.set(key, game.provider_title);
        }
    });

    console.log(`Found ${uniqueGames.size} unique games and ${uniqueProviders.size} unique providers.`);

    const languages = fs.readdirSync(localesPath).filter(f => fs.statSync(path.join(localesPath, f)).isDirectory());

    for (const lang of languages) {
        if (!langMap[lang]) {
            console.warn(`Skipping unknown language folder: ${lang}`);
            continue;
        }

        console.log(`Processing ${lang}...`);
        const filePath = path.join(localesPath, lang, 'translation.json');
        let translations = {};
        if (fs.existsSync(filePath)) {
            translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Ensure sections exist
        if (!translations.providers) translations.providers = {};
        // Games are at root in some files, but better to organize? 
        // GameCard checks root for games. 
        // Let's stick to root for games as per current pattern in GameCard.jsx: 
        // const key = type === 'provider' ? `providers.${camelKey}` : camelKey;
        
        let changed = false;

        // Process Providers
        for (const [key, name] of uniqueProviders) {
            if (!translations.providers[key]) {
                if (lang === 'en') {
                    translations.providers[key] = name;
                    changed = true;
                } else {
                    try {
                        const res = await translate(name, { to: langMap[lang] });
                        translations.providers[key] = res.text;
                        console.log(`[${lang}] Translated provider: ${name} -> ${res.text}`);
                        changed = true;
                        await delay(100); // Rate limit
                    } catch (e) {
                        console.error(`[${lang}] Error translating provider ${name}:`, e.message);
                        translations.providers[key] = name; // Fallback
                        changed = true;
                    }
                }
            }
        }

        // Process Games
        // To save time, we only translate if missing.
        let gameCount = 0;
        const gameKeys = Array.from(uniqueGames.keys());
        
        // Batch process games to avoid memory issues, but sequential to avoid rate limit
        for (const key of gameKeys) {
            const name = uniqueGames.get(key);
            if (!translations[key]) {
                if (lang === 'en') {
                    translations[key] = name;
                    changed = true;
                } else {
                    try {
                        // Use English name as fallback immediately if translation fails
                        const res = await translate(name, { to: langMap[lang] });
                        translations[key] = res.text;
                        // console.log(`[${lang}] Translated game: ${name} -> ${res.text}`);
                        process.stdout.write('.');
                        changed = true;
                        gameCount++;
                        await delay(200); // 200ms delay between games to be safe
                    } catch (e) {
                        // console.error(`[${lang}] Error translating game ${name}:`, e.message);
                        translations[key] = name; // Fallback
                        changed = true;
                    }
                }
            }
        }
        if (gameCount > 0) console.log(`\n[${lang}] Translated ${gameCount} new games.`);

        if (changed) {
            fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
            console.log(`Saved ${lang}/translation.json`);
        } else {
            console.log(`No changes for ${lang}`);
        }
    }
}

main().catch(console.error);
