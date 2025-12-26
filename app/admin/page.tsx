
import { getDb } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { importMenuFromText, updateStoreConfig } from '@/app/actions';
import CategoryManager from '@/components/admin/category-manager';
import ProductManager from '@/components/admin/product-manager';
import Link from 'next/link';

export default function AdminPage() {
    const db = getDb();

    // De-serialize for client components
    const categories = JSON.parse(JSON.stringify(db.categories));
    const products = JSON.parse(JSON.stringify(db.products));
    const config = JSON.parse(JSON.stringify(db.storeConfig));

    async function handleImport(formData: FormData) {
        'use server';
        const text = formData.get('text') as string;
        await importMenuFromText(text);
    }

    return (
        <div className="min-h-screen bg-muted/40 pb-32">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            MS
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Painel do Parceiro</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                            <Link href="/" target="_blank">Ver Loja Online</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <span className="text-xl">📦</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Produtos Totais</p>
                                <h3 className="text-2xl font-bold">{products.length}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <span className="text-xl">🏷️</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Categorias Ativas</p>
                                <h3 className="text-2xl font-bold">{categories.filter((c: any) => c.active).length}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                <span className="text-xl">🔧</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Configuração</p>
                                <h3 className="text-lg font-bold truncate max-w-[150px]">{config.name}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="products" className="w-full">
                    <TabsList className="bg-white p-1 border rounded-lg mb-6 w-full md:w-auto grid grid-cols-4 md:flex md:space-x-2 h-auto">
                        <TabsTrigger
                            value="products"
                            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 px-6 py-2"
                        >
                            Produtos
                        </TabsTrigger>
                        <TabsTrigger
                            value="categories"
                            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 px-6 py-2"
                        >
                            Categorias
                        </TabsTrigger>
                        <TabsTrigger
                            value="config"
                            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 px-6 py-2"
                        >
                            Loja
                        </TabsTrigger>
                        <TabsTrigger
                            value="import"
                            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 px-6 py-2"
                        >
                            Importar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="space-y-4">
                        <ProductManager categories={categories} products={products} />
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-4">
                        <CategoryManager categories={categories} />
                    </TabsContent>

                    <TabsContent value="import">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="col-span-full md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Importar do iFood (Texto)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Copie o texto do cardápio (nome, descrição e preço) e cole abaixo.
                                        O sistema tentará identificar automaticamente os produtos.
                                    </p>
                                    <form action={handleImport} className="space-y-4">
                                        <Textarea
                                            name="text"
                                            placeholder="Ex: Combo Salmão - 20 peças - R$ 50,00..."
                                            className="min-h-[300px] font-mono text-sm bg-white"
                                        />
                                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Processar Importação</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="config">
                        <div className="max-w-2xl">
                            <Card>
                                <CardHeader><CardTitle>Dados da Loja</CardTitle></CardHeader>
                                <CardContent>
                                    <form action={updateStoreConfig} className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="col-span-2">
                                                <label className="text-sm font-medium mb-1.5 block">Nome da Loja</label>
                                                <Input name="name" defaultValue={config.name} className="bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Telefone</label>
                                                <Input name="phone" defaultValue={config.phone} className="bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">WhatsApp</label>
                                                <Input name="whatsapp" defaultValue={config.whatsapp} className="bg-white" />
                                            </div>
                                        </div>
                                        <Button type="submit" className="bg-primary hover:bg-primary/90 w-full md:w-auto">Salvar Alterações</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
