const fs = require('fs');
const path = require('path');

const MENU_PATH = path.join(__dirname, '../data/menu.json');
const UPLOADS_PATH = path.join(__dirname, '../public/uploads');

const menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'));
const images = fs.readdirSync(UPLOADS_PATH);

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

let updatedCount = 0;

menu.products.forEach(product => {
    const normalizedProductName = normalize(product.name);

    // 1. Exact match (ignoring extension and case/special chars)
    let bestMatch = images.find(img => {
        const normalizedImg = normalize(path.parse(img).name);
        return normalizedImg === normalizedProductName;
    });

    // 2. Contains match (Product name contains image name or vice versa)
    if (!bestMatch) {
        bestMatch = images.find(img => {
            const normalizedImg = normalize(path.parse(img).name);
            // Special manual mappings or strong heuristics
            if (normalizedImg === '60rolls' && normalizedProductName.includes('60pecas')) return true;

            return normalizedProductName.includes(normalizedImg) || normalizedImg.includes(normalizedProductName);
        });
    }

    // Specific overrides based on user file names
    if (!bestMatch) {
        if (product.name.includes('72 Croc salmão')) bestMatch = images.find(i => i.includes('72 Croc'));
        if (product.name.includes('Sunomono') && !product.name.includes('kani')) bestMatch = images.find(i => i.includes('Sunomono sem kani'));
        if (product.name === 'Sunomono') bestMatch = images.find(i => i === 'Sunomono.jpg');
    }


    if (bestMatch) {
        console.log(`Matching "${product.name}" -> "${bestMatch}"`);
        product.imageUrl = `/uploads/${bestMatch}`;
        updatedCount++;
    }
});

fs.writeFileSync(MENU_PATH, JSON.stringify(menu, null, 2));
console.log(`Updated ${updatedCount} products.`);
