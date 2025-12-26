
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/store';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { StoreConfig } from '@/lib/db';
import { Textarea } from '@/components/ui/textarea'; // Assuming simple textarea or Input

export default function CartSheet({ isOpen, onClose, storeConfig }: { isOpen: boolean; onClose: () => void; storeConfig: StoreConfig }) {
    const { items, updateQuantity, removeItem, updateObservation, total, clearCart } = useCart();

    const cartTotal = total();

    const handleCheckout = () => {
        if (items.length === 0) return;

        let message = `*${storeConfig.name}*\n_Novo Pedido pelo Site_\n\n`;

        items.forEach(item => {
            message += `*${item.quantity}x ${item.name}*\n`;
            if (item.observation) message += `_Obs: ${item.observation}_\n`;
            message += `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}\n\n`;
        });

        message += `\n*TOTAL: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}*`;

        const encoded = encodeURIComponent(message);
        const link = `https://wa.me/${storeConfig.whatsapp}?text=${encoded}`;

        // Clear cart or keep it? Usually keep until confirmed, but for simple app maybe clear.
        // Let's keep it to avoid data loss if user comes back.
        window.open(link, '_blank');
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-center text-lg">Seu Carrinho</SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 space-y-2">
                            <ShoppingBagIcon className="w-12 h-12 opacity-20" />
                            <p>Seu carrinho está vazio.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col bg-gray-50 p-3 rounded-lg animate-in slide-in-from-bottom-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-sm w-3/4">{item.name}</span>
                                        <span className="font-bold text-sm">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center space-x-3 bg-white border rounded-lg p-1 shadow-sm">
                                            <button
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                                                onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeItem(item.id)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                            <button
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 ml-4">
                                            <Input
                                                placeholder="Alguma observação?"
                                                className="h-8 text-xs bg-transparent border-b border-0 rounded-none focus-visible:ring-0 px-0"
                                                value={item.observation || ''}
                                                onChange={(e) => updateObservation(item.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50 pb-8">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-500">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                        </span>
                    </div>

                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold shadow-green-200 shadow-lg"
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                    >
                        Finalizar Pedido no WhatsApp
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
