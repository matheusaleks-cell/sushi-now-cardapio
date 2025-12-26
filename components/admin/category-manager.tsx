'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createCategory, updateCategory, deleteCategory, updateCategoryOrder } from '@/app/actions';
import { Category } from '@/lib/db';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

export default function CategoryManager({ categories }: { categories: Category[] }) {
    // Sort local state by order
    const [items, setItems] = useState(categories.sort((a, b) => a.order - b.order));
    const [editing, setEditing] = useState<Category | null>(null);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        setItems(categories.sort((a, b) => a.order - b.order));
    }, [categories]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id && over) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Optimistic UI update, then save to server
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index
                }));

                updateCategoryOrder(updates);

                return newItems;
            });
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-xl font-bold">Categorias</h2>
                    <p className="text-sm text-gray-500">Arraste para reordenar.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                            <Plus size={16} /> Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Nova Categoria</DialogTitle>
                        </DialogHeader>
                        <form action={async (formData) => {
                            await createCategory(formData.get('name') as string);
                        }} className="space-y-4">
                            <Input name="name" placeholder="Nome da Categoria" required />
                            <Button type="submit">Criar</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Nome da Categoria"
                        />
                        <Button onClick={async () => {
                            if (editing && newName) {
                                await updateCategory(editing.id, newName);
                                setEditing(null);
                            }
                        }}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {items.map((cat) => (
                            <SortableItem key={cat.id} id={cat.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm group hover:shadow-md transition-all">
                                <div className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 rounded">
                                    <GripVertical size={20} />
                                </div>

                                <span className="font-semibold flex-1 text-lg">{cat.name}</span>

                                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => {
                                        setEditing(cat);
                                        setNewName(cat.name);
                                    }}>
                                        <Pencil size={18} className="text-gray-600" />
                                    </Button>

                                    <form action={async () => {
                                        if (confirm('Tem certeza? Isso apagará a categoria.')) {
                                            await deleteCategory(cat.id);
                                        }
                                    }}>
                                        <Button size="icon" variant="ghost" className="hover:bg-red-50 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </Button>
                                    </form>
                                </div>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
