
import { getDb } from '@/lib/db';
import MenuClient from '@/components/menu-client';

export const metadata = {
  title: 'Sushi Now - Cardápio Digital',
  description: 'Faça seu pedido online no Sushi Now!',
};

export default function Home() {
  const db = getDb();

  // Serialize data to avoid Next.js warnings about classes/functions
  const categories = JSON.parse(JSON.stringify(db.categories));
  const products = JSON.parse(JSON.stringify(db.products));
  const config = JSON.parse(JSON.stringify(db.storeConfig));

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <MenuClient
        initialCategories={categories}
        initialProducts={products}
        storeConfig={config}
      />
    </main>
  );
}
