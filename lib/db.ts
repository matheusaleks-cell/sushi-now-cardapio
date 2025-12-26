
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'menu.json');

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    active: boolean;
    order: number;
    categoryId: string;
};

export type Category = {
    id: string;
    name: string;
    order: number;
    active: boolean;
};

export type StoreConfig = {
    name: string;
    phone: string;
    whatsapp: string;
};

export type Database = {
    categories: Category[];
    products: Product[];
    storeConfig: StoreConfig;
};

export function getDb(): Database {
    if (!fs.existsSync(DB_PATH)) {
        return { categories: [], products: [], storeConfig: { name: "Sushi Now", phone: "", whatsapp: "" } };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export function saveDb(db: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
