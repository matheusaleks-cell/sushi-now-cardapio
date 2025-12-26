const fs = require('fs');
const path = require('path');

const MENU_PATH = path.join(__dirname, '../data/menu.json');
const menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'));

let count = 0;

menu.products.forEach(p => {
    let fixed = p.name;

    // 1. Capitalize first letter
    if (fixed.length > 0) {
        fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
    }

    // 2. Expand abbreviations
    fixed = fixed.replace(/\b(\d+)\s*pc\b/gi, '$1 Peças')
        .replace(/\b(\d+)\s*pçs\b/gi, '$1 Peças')
        .replace(/\b(\d+)\s*Pçs\b/g, '$1 Peças')
        .replace(/\b(\d+)\s*uni\b/gi, '$1 Unidades');

    // 3. Fix Typos
    fixed = fixed.replace(/cream chesse/gi, 'Cream Cheese');
    fixed = fixed.replace(/Joe joe/g, 'Joe Joe');
    fixed = fixed.replace(/Philadelfia/g, 'Philadelphia'); // Standardize

    // 4. Remove trailing dot
    if (fixed.endsWith('.')) {
        fixed = fixed.slice(0, -1);
    }

    // 5. Uppercase "Rolls"
    fixed = fixed.replace(/\brolls\b/g, 'Rolls');


    if (fixed !== p.name) {
        console.log(`Fixed: "${p.name}" -> "${fixed}"`);
        p.name = fixed;
        count++;
    }
});

fs.writeFileSync(MENU_PATH, JSON.stringify(menu, null, 2));
console.log(`Fixed ${count} titles.`);
