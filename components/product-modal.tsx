'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/store';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

type Props = {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ProductModal({ product, isOpen, onClose }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [observation, setObservation] = useState('');
    const addItem = useCart(s => s.addItem);

    if (!product) return null;

    const handleAddToCart = () => {
        addItem(product, quantity, observation);
        setQuantity(1);
        setObservation('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0 border-none">

                {/* Cover Image */}
                <div className="relative h-56 w-full bg-gray-100">
                    {product.imageUrl ? (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 font-medium">Sem imagem</span>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white rounded-full p-2 hover:bg-black/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <DialogTitle className="text-2xl font-bold mb-2">{product.name}</DialogTitle>
                        <div className="text-green-600 font-bold text-xl">
                            R$ {product.price.toFixed(2)}
                        </div>
                        {product.description && (
                            <p className="text-gray-500 mt-3 leading-relaxed text-sm">
                                {product.description}
                            </p>
                        )}
                    </div>

                    {/* Observation */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Alguma observação?</label>
                        <Input
                            placeholder="Ex: Sem cebola, capricha no molho..."
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            className="bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Footer Action */}
                    <div className="flex gap-4 pt-2">
                        <div className="flex items-center border rounded-lg p-1 px-2 space-x-3 bg-white shadow-sm">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-red-600">
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-red-600">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <Button
                            className="flex-1 h-12 text-base font-semibold bg-red-600 hover:bg-red-700 shadow-md shadow-red-100"
                            onClick={handleAddToCart}
                        >
                            <span className="mr-2">Adicionar</span>
                            <span>R$ {(product.price * quantity).toFixed(2)}</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
