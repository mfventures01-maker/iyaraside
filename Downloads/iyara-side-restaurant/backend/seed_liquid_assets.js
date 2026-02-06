
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The "Liquid Assets" - Extremely high value items
const LIQUID_ASSETS = [
    {
        type: "liquid_asset",
        name: "Macallan Lalique 72 Year Old",
        vintage: "1946",
        details: {
            serving_temp: "18.5c",
            glassware: "lalique_crystal_decanter",
            provenance: "The Genesis Decanter"
        },
        price_ngn: 85000000, // 85 Million Naira
        price_usd: 85000,
        scarcity: "global_rarity"
    },
    {
        type: "liquid_asset",
        name: "Louis XIII Rare Cask 42.6",
        vintage: "N/A",
        details: {
            serving_temp: "ambient",
            glassware: "baccarat_black_crystal",
            provenance: "Tierçon Cask"
        },
        price_ngn: 45000000,
        price_usd: 45000,
        scarcity: "ultra_rare"
    },
    {
        type: "liquid_asset",
        name: "Dom Pérignon Rose Gold Mathusalem",
        vintage: "1996",
        details: {
            serving_temp: "8c",
            glassware: "white_glove_service",
            provenance: "Epernay Vaults"
        },
        price_ngn: 35000000,
        price_usd: 35000,
        scarcity: "limited_edition"
    },
    {
        type: "liquid_asset",
        name: "Iyara Heritage Palm Wine",
        vintage: "7-Day Ferment",
        details: {
            serving_temp: "chilled_calabash",
            glassware: "ceremonial_calabash_gold_rim",
            provenance: "Ancestral Grove"
        },
        price_ngn: 500000,
        price_usd: 500,
        scarcity: "daily_allocation"
    }
];

// In a real app, this would push to Supabase. 
// Here, we generate a JSON file for the frontend to import as a "secret menu".

const outputPath = path.join(__dirname, '..', 'context', 'liquid_assets.json');

console.log('🏺 Seeding Liquid Assets to local vault...');
fs.writeFileSync(outputPath, JSON.stringify(LIQUID_ASSETS, null, 2));
console.log(`✅ Liquid Assets secured at ${outputPath}`);
console.log(`📊 Total Valuation: ₦${LIQUID_ASSETS.reduce((acc, item) => acc + item.price_ngn, 0).toLocaleString()}`);
