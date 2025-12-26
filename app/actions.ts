'use server';

import { getDb, saveDb, Product, Category } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const uuid = () => Math.random().toString(36).substring(2, 15);

export async function toggleProductActive(productId: string) {
    const db = getDb();
    db.products = db.products.map(p => p.id === productId ? { ...p, active: !p.active } : p);
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function importMenuFromText(text: string) {
    const db = getDb();

    // Use same logic as seed script
    const knownCategories = [
        "Destaques", "Entradinhas", "Top 10", "Ofertas", "Combos", "Bebidas", "Sobremesas", "Temakis", "Sashimi", "Sushi", "Rolls", "Hots", "Pratos Quentes"
    ];
    // Add dynamic categories from text if they look like headers (short, no numbers)

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentCategoryId = null; // Default to first existing or create new
    let catOrder = db.categories.length;

    // Create a "Imported" category if none matches?
    // Strategy: Try to detect categories, otherwise put in "Geral"

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Simple heuristic for category: 
        // 1. In known list OR
        // 2. Short (< 30 chars), No Numbers, Ends with nothing special or just looks like a title
        // 3. User can manually organize later.

        // Check if it matches an existing category name
        const existingCat = db.categories.find(c => c.name.toLowerCase() === line.toLowerCase());
        if (existingCat) {
            currentCategoryId = existingCat.id;
            continue;
        }

        // Check if it LOOKS like a category provided by user history
        if (knownCategories.includes(line) || (line.length < 40 && !line.includes('R$') && !line.includes('e') && !line.match(/\d/))) {
            // Create new category
            const newCat = {
                id: uuid(),
                name: line,
                order: catOrder++,
                active: true
            };
            db.categories.push(newCat);
            currentCategoryId = newCat.id;
            continue;
        }

        if (!currentCategoryId) {
            // Create default category
            const defCat = { id: uuid(), name: "Geral", order: 0, active: true };
            db.categories.push(defCat);
            currentCategoryId = defCat.id;
        }

        // Product Parse
        if (line.startsWith('R$') || line.startsWith('A partir de R$')) {
            let priceStr = line.replace('A partir de R$', '').replace('R$', '').trim().split('R$')[0];
            priceStr = priceStr.replace(',', '.');
            const price = parseFloat(priceStr);

            if (isNaN(price)) continue;

            let name = lines[i - 1];
            let desc = "";

            // Try to find name/desc
            if (i >= 2 && !lines[i - 2].startsWith('R$')) {
                // Heuristic: If i-1 is long, it's desc, i-2 is name
                if (lines[i - 1].length > 30 || lines[i - 1].includes('Serve') || lines[i - 1].includes('unidades')) {
                    name = lines[i - 2];
                    desc = lines[i - 1];
                }
            }

            if (name && !name.startsWith('R$')) {
                if (name === "Fechado") continue;

                // Check duplicate
                const exists = db.products.some(p => p.name === name && p.categoryId === currentCategoryId);
                if (!exists) {
                    db.products.push({
                        id: uuid(),
                        name: name,
                        description: desc,
                        price: price,
                        categoryId: currentCategoryId!,
                        imageUrl: "",
                        active: true,
                        order: db.products.length
                    });
                }
            }
        }
    }

    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
}

export async function updateStoreConfig(formData: FormData) {
    const db = getDb();
    db.storeConfig.name = formData.get('name') as string;
    db.storeConfig.phone = formData.get('phone') as string;
    db.storeConfig.whatsapp = formData.get('whatsapp') as string;
    saveDb(db);
    revalidatePath('/');
}

// --- 2.0 CRUD Actions ---

// Image Upload
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file uploaded');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueName = `${Date.now()}-${cleanName}`;
    const path = join(process.cwd(), 'public/uploads', uniqueName);

    await writeFile(path, buffer);
    return `/uploads/${uniqueName}`;
}

// Category Management
export async function createCategory(name: string) {
    const db = getDb();
    db.categories.push({
        id: uuid(),
        name,
        order: db.categories.length,
        active: true
    });
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateCategory(id: string, name: string) {
    const db = getDb();
    db.categories = db.categories.map(c => c.id === id ? { ...c, name } : c);
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteCategory(id: string) {
    const db = getDb();
    db.categories = db.categories.filter(c => c.id !== id);
    // Optional: Delete products or move them? For now, let's keep them but they won't show if cat is gone.
    // Better: Move them to "Uncategorized" or just leave them database-wise but hidden.
    // Let's filter products too to be clean.
    db.products = db.products.filter(p => p.categoryId !== id);
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function reorderCategory(id: string, direction: 'up' | 'down') {
    const db = getDb();
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= db.categories.length) return;

    // Swap orders
    const tempOrder = db.categories[index].order;
    db.categories[index].order = db.categories[swapIndex].order;
    db.categories[swapIndex].order = tempOrder;

    // Swap positions in array (though order prop matters more usually, let's keep array sorted by order ideally or just swap)
    [db.categories[index], db.categories[swapIndex]] = [db.categories[swapIndex], db.categories[index]];

    // Normalize orders just in case
    db.categories.forEach((c, i) => c.order = i);

    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateCategoryOrder(items: { id: string; order: number }[]) {
    const db = getDb();
    items.forEach(item => {
        const cat = db.categories.find(c => c.id === item.id);
        if (cat) cat.order = item.order;
    });
    // Optional: Sort explicitly in DB for cleanliness?
    db.categories.sort((a, b) => a.order - b.order);

    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateProductOrder(items: { id: string; order: number }[]) {
    const db = getDb();
    items.forEach(item => {
        const prod = db.products.find(p => p.id === item.id);
        if (prod) prod.order = item.order;
    });
    // Can't easily sort whole array as it's mixed categories, but that's fine.
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

// Product Management
export async function createProduct(data: { name: string, description: string, price: number, categoryId: string, imageUrl: string }) {
    const db = getDb();
    db.products.push({
        id: uuid(),
        ...data,
        active: true,
        order: db.products.filter(p => p.categoryId === data.categoryId).length
    });
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateProduct(id: string, data: { name: string, description: string, price: number, categoryId: string, imageUrl: string }) {
    const db = getDb();
    db.products = db.products.map(p => p.id === id ? { ...p, ...data } : p);
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteProduct(id: string) {
    const db = getDb();
    db.products = db.products.filter(p => p.id !== id);
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/admin');
}

