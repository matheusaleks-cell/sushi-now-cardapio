import { Product } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function ProductCard({ product, categoryName }: { product: Product, categoryName?: string }) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price);

    const isPromo = categoryName?.toLowerCase().includes('promo') ||
        categoryName?.toLowerCase().includes('oferta') ||
        categoryName?.toLowerCase().includes('destaque');

    // Extract "Serve X" info
    let description = product.description || '';
    let servesText = '';
    const serveMatch = description.match(/^(serve\s+.*?)(\.|,|$)/i);

    if (serveMatch) {
        servesText = serveMatch[1];
        description = description.replace(serveMatch[0], '').trim();
        // Clean up leading punctuation if any remains
        if (description.startsWith('.') || description.startsWith(',')) {
            description = description.substring(1).trim();
        }
    }

    return (
        <motion.div whileTap={{ scale: 0.98 }} className="h-full">
            <Card className="flex flex-row overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white rounded-lg min-h-[8rem] h-auto cursor-pointer">
                {/* Content Section (Left) */}
                <CardContent className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 className="font-semibold text-gray-800 leading-tight mb-1 text-[14px] line-clamp-2">
                            {product.name}
                        </h3>

                        {/* Serves Badge */}
                        {servesText && (
                            <div className="flex items-center gap-1 mb-1">
                                <Users className="w-3 h-3 text-gray-400" />
                                <span className="text-[10px] font-medium text-gray-500">{servesText}</span>
                            </div>
                        )}

                        {description && (
                            <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col">
                            {isPromo && (
                                <span className="text-[9px] uppercase font-bold text-red-600 mb-0.5 tracking-wide">
                                    Oferta
                                </span>
                            )}
                            <span className={`font-medium text-sm ${isPromo ? 'text-green-700' : 'text-gray-900'}`}>
                                {formattedPrice}
                            </span>
                        </div>
                    </div>
                </CardContent>

                {/* Image Section (Right) */}
                {product.imageUrl && (
                    <div className="w-32 h-full shrink-0 p-2 pl-0">
                        <div
                            className="w-full h-full bg-cover bg-center rounded-md bg-gray-100"
                            style={{ backgroundImage: `url("${product.imageUrl}")` }}
                        />
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
