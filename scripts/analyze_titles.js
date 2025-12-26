const fs = require('fs');
const path = require('path');

const MENU_PATH = path.join(__dirname, '../data/menu.json');
const menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'));

// Helper to check title case
function isTitleCase(str) {
    // basic check: first char is uppercase
    return /^[A-Z]/.test(str);
}

const issues = [];

menu.products.forEach(p => {
    const original = p.name;
    let fixed = original;
    const reasons = [];

    // 1. Lowercase start
    if (/^[a-z]/.test(fixed)) {
        fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
        reasons.push("started lowercase");
    }

    // 2. Contains specific bad patterns (like "sushi" lowercase in middle if needed, but risky)
    // Actually, just flagging "sushi" -> "Sushi" might be too aggressive if inside sentence. 
    // Let's focus on proper casing for known proper nouns if we had a list, 
    // but primarily let's look for "promoção" vs "Promoção".

    // 3. Fix "pcs" to "Peças" or "pçs"
    if (/\bpc\b|\bpç\b|\buni\b/i.test(fixed)) {
        fixed = fixed.replace(/\b(\d+)\s*pc\b/gi, '$1 Peças')
            .replace(/\b(\d+)\s*pçs\b/gi, '$1 Peças')
            .replace(/\b(\d+)\s*Pçs\b/g, '$1 Peças');
        reasons.push("abbreviation expansion");
    }

    // 4. Remove trailing punctuation in titles like "."
    if (fixed.endsWith('.')) {
        fixed = fixed.slice(0, -1);
        reasons.push("trailing dot");
    }

    if (original !== fixed && reasons.length > 0) {
        issues.push({ id: p.id, original, fixed, reasons: reasons.join(', ') });
    }
});

console.log(JSON.stringify(issues, null, 2));
