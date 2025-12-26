'use client';

import { useState, useMemo } from 'react';
import { Category, Product, StoreConfig } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/product-card';
import CartSheet from '@/components/cart-sheet';
import ProductModal from '@/components/product-modal'; // New Import
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    initialCategories: Category[];
    initialProducts: Product[];
    storeConfig: StoreConfig;
};

export default function MenuClient({ initialCategories, initialProducts, storeConfig }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>(initialCategories[0]?.id || '');
    const [search, setSearch] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Selected Product for Modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const cartTotal = useCart(s => s.total());
    const cartItemsCount = useCart(s => s.items.length);

    const filteredProducts = useMemo(() => {
        let prods = initialProducts.filter(p => p.active);

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            prods = prods.filter(p => p.name.toLowerCase().includes(lowerSearch));
        }

        return prods;
    }, [initialProducts, search]);

    const displayedCategories = useMemo(() => {
        if (search.trim()) {
            return initialCategories.filter(c =>
                filteredProducts.some(p => p.categoryId === c.id)
            );
        }
        return initialCategories.sort((a, b) => a.order - b.order).filter(c => c.active);
    }, [initialCategories, filteredProducts, search]);

    const scrollToCategory = (catId: string) => {
        setActiveCategory(catId);
        const el = document.getElementById(`cat-${catId}`);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 180; // Adjusted offset
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl">
            {/* Header */}
            <div className="bg-background pb-2 shadow-sm sticky top-0 z-40">
                <header className="p-4 bg-primary text-primary-foreground rounded-b-3xl mb-2 shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{storeConfig.name}</h1>
                            <p className="text-xs opacity-90 mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 block animate-pulse" /> Aberto agora
                            </p>
                            {storeConfig.phone && <p className="text-xs mt-1 opacity-80">{storeConfig.phone}</p>}
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl">🍣</span>
                        </div>
                    </div>
                </header>

                <div className="px-4 -mt-6">
                    <div className="relative shadow-md rounded-xl bg-card overflow-hidden group focus-within:ring-2 ring-primary/30 transition-all">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="O que você procura hoje?"
                            className="pl-10 h-11 border-none bg-card font-medium placeholder:font-normal"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Nav - Better sticky */}
                <div className="mt-4 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-30">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex w-max space-x-2 p-2 px-4">
                            {displayedCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => scrollToCategory(cat.id)}
                                    className={`
                        px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        ${activeCategory === cat.id
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }
                    `}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                </div>
            </div>

            {/* Menu List */}
            <div className="p-4 pb-32 space-y-8 bg-gray-50 min-h-[60vh]">
                {displayedCategories.map((cat) => {
                    const catProducts = filteredProducts.filter(p => p.categoryId === cat.id).sort((a, b) => a.order - b.order);
                    if (catProducts.length === 0) return null;

                    return (
                        <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                {cat.name}
                                <div className="h-0.5 flex-1 bg-gray-200 rounded-full ml-2" />
                            </h2>
                            <div className="grid gap-4">
                                {catProducts.map(product => (
                                    <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                                        <ProductCard product={product} categoryName={cat.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 opacity-20" />
                        <p>Poxa, não encontramos nada com esse nome.</p>
                    </div>
                )}
            </div>

            {/* Bottom Cart Bar */}
            <AnimatePresence>
                {cartItemsCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none flex justify-center pb-8"
                    >
                        <div className="max-w-md w-full pointer-events-auto">
                            <Button
                                className="w-full bg-black text-white shadow-2xl h-16 flex justify-between items-center px-6 rounded-2xl border-t border-gray-800"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <ShoppingBag className="h-6 w-6 text-primary" />
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-black">
                                            {cartItemsCount}
                                        </span>
                                    </div>
                                    <span className="font-medium text-gray-300">Ver sacola</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm font-normal">Total</span>
                                    <span className="font-bold text-xl text-white">
                                        R$ {cartTotal.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartSheet
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeConfig={storeConfig}
            />

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
