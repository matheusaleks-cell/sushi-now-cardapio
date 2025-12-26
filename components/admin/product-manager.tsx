'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProduct, updateProduct, deleteProduct, toggleProductActive, uploadImage, updateProductOrder } from '@/app/actions';
import { Pencil, Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

export default function ProductManager({ categories, products }: { categories: Category[], products: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Sort products by order
    const [items, setItems] = useState<Product[]>([]);

    const [search, setSearch] = useState('');

    useEffect(() => {
        let filtered = products;

        // Filter by Category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.categoryId === selectedCategory);
        }

        // Filter by Search
        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerSearch) ||
                p.description?.toLowerCase().includes(lowerSearch)
            );
        }

        setItems(filtered.sort((a, b) => a.order - b.order));
    }, [products, selectedCategory, search]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id && over) {
            setItems((currentItems) => {
                const oldIndex = currentItems.findIndex((i) => i.id === active.id);
                const newIndex = currentItems.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(currentItems, oldIndex, newIndex);

                const existingOrders = currentItems.map(i => i.order).sort((a, b) => a - b);

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: existingOrders[index] // Match relative order values
                }));

                updateProductOrder(updates);

                return newItems;
            });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Input
                                placeholder="Buscar produto..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Categorias</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus size={16} className="mr-2" /> Novo Produto
                    </Button>
                </div>
            </div>

            {/* ... Dialogs ... */}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.length === 0 ? (
                            <div className="col-span-full text-center p-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                <div className="mx-auto w-12 h-12 text-gray-300 mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
                                <p>Tente mudar o filtro ou adicione um novo produto.</p>
                            </div>
                        ) : (
                            items.map(prod => (
                                <SortableItem key={prod.id} id={prod.id} className="relative group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                                    {/* Drag Handle - Absolute Top Left */}
                                    <div className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing p-1.5 bg-white/80 backdrop-blur-sm rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical size={16} className="text-gray-500" />
                                    </div>

                                    {/* Image Aspect Ratio */}
                                    <div className="aspect-[4/3] w-full bg-gray-100 relative">
                                        {prod.imageUrl ? (
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url("${prod.imageUrl}")` }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        {!prod.active && (
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md">
                                                Inativo
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <h4 className="font-semibold text-gray-900 line-clamp-1">{prod.name}</h4>
                                        <p className="text-sm text-gray-500 font-medium mt-1">R$ {prod.price.toFixed(2)}</p>

                                        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-2 text-gray-500 hover:text-primary hover:bg-red-50"
                                                onClick={() => setEditingProduct(prod)}
                                            >
                                                <Pencil size={14} className="mr-1.5" /> Editar
                                            </Button>
                                            <div className="w-px h-4 bg-gray-200"></div>
                                            <form action={async () => {
                                                if (confirm('Excluir produto?')) await deleteProduct(prod.id);
                                            }}>
                                                <Button size="sm" variant="ghost" className="h-8 px-2 text-gray-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 size={14} className="mr-1.5" /> Excluir
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </SortableItem>
                            ))
                        )}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

function ProductForm({ categories, product, initialCategory, onClose, mode }: any) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            // Handle Image Upload
            const file = formData.get('image') as File;
            let imageUrl = product?.imageUrl || '';

            if (file && file.size > 0) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                imageUrl = await uploadImage(uploadData);
            }

            const data = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                categoryId: formData.get('categoryId') as string,
                imageUrl,
            };

            if (mode === 'create') {
                await createProduct(data);
            } else {
                await updateProduct(product.id, data);
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium">Imagem</label>
                <Input type="file" name="image" accept="image/*" />
                {product?.imageUrl && (
                    <div className="mt-2 text-xs text-gray-500">Imagem atual existente</div>
                )}
            </div>

            <div>
                <label className="text-sm font-medium">Nome do produto</label>
                <Input name="name" defaultValue={product?.name} required placeholder="Ex: Combo Salmão" />
            </div>

            <div>
                <label className="text-sm font-medium">Preço (R$)</label>
                <Input type="number" step="0.01" name="price" defaultValue={product?.price} required placeholder="0.00" />
            </div>

            <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea name="description" defaultValue={product?.description} placeholder="Ingredientes, tamanho..." />
            </div>

            <div>
                <label className="text-sm font-medium">Categoria</label>
                <Select name="categoryId" defaultValue={product?.categoryId || initialCategory} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? 'Salvando...' : (mode === 'create' ? 'Criar Produto' : 'Salvar Alterações')}
            </Button>
        </form>
    );
}
