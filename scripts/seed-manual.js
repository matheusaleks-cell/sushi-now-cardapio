const fs = require('fs');
const path = require('path');

const rawData = `
Destaques
72 Croc salmão
Serve 4 pessoas
R$ 77,99
72 Croc salmão
Fechado
Palito salmão hot + teriaki
Salmão hot no palito +1 molho teriaki
R$ 22,90
Palito salmão hot + teriaki
Fechado
Palito hot croc + teriaki
Hot crocante no palito + 1 molho teriaki
R$ 19,90
Palito hot croc + teriaki
Fechado
60 rolls
Escolha 5 porções (com 12 unidades cada) 15 opções diferentes de rolls, você escolhe, algumas porções tem acréscimo.
Serve 4 pessoas
R$ 77,00
60 rolls
Fechado
Entradinhas
Sunomono
Cortes bem fininhos de pepino, Kani, gergelim e molho especial.
R$ 11,00
Sunomono
Sunomono sem kani
Cortes bem fininhos de Pepino, Gergelim e Molho especial.
R$ 7,00
Sunomono sem kani
Paga na entrega ganhe teriaki grátis
12 Hots crocantes
Arroz, salmão, cream cheese e nori(alga) frito e empanado na farinha panko.
Serve 1 pessoa
R$ 22,00
12 Hots crocantes
Top 10
12 Hots crocantes
Arroz, salmão, cream cheese e nori(alga) frito e empanado na farinha panko.
Serve 1 pessoa
R$ 22,00
12 Hots crocantes
24 Philadelphia .
24 rolls de salmão com cream chesse, alga e arroz.
Serve 2 pessoas
R$ 39,00
24 Philadelphia .
48 Hotcroc skin salmão.
Hot Philadelphia de pele(Skin) de salmão frita
Serve 3 pessoas
R$ 54,99
48 Hotcroc skin salmão.
6 peças Philadelphia e 6 peças hot rolls Crocante
Serve 1 pessoa
R$ 22,00
6 peças Philadelphia e 6 peças hot rolls Crocante
Ofertas de Abril
72 Croc salmão
Serve 4 pessoas
R$ 77,99
72 Croc salmão
Promoção 18 Hot Croc.
18 hot Philadelphia crocante.
R$ 28,00
Promoção 18 Hot Croc.
Super Combo 72 rolls
24 Hot Croc Salmão 24 Hot Atum 24 Hot Skin
Serve 4 pessoas
R$ 70,00
Super Combo  72 rolls
Pirulito de salmão
4 unidades. Salmão, cream cheese, cebolinha, gergelim.
Serve 1 pessoa
R$ 17,00
Pirulito de salmão
Tudo por 4,99
1 Temaki Philadelphia Skin
Serve 1 pessoa
R$ 19,00
1 Temaki Philadelphia Skin
Tudo por 9,99
12 Uramaki salmão hot
Serve 1 pessoa
R$ 23,00
12 Uramaki salmão hot
Promoção de Rolls
36 rolls
Escolha 3 porções (com 12 unidades cada) 15 opções diferentes de rolls, você escolhe, algumas porções tem acréscimo.
R$ 45,99
36 rolls
48 rolls
Escolha 4 porções (com 12 unidades cada) 15 opções diferentes de rolls, você escolhe, algumas porções tem acréscimo.
Serve 3 pessoas
R$ 56,99
48 rolls
60 Hotcroc Philadelphia Salmão
60 peças de hot Philadelphia crocante
Serve 3 pessoas
R$ 69,99
60 Hotcroc Philadelphia Salmão
60 rolls
Escolha 5 porções (com 12 unidades cada) 15 opções diferentes de rolls, você escolhe, algumas porções tem acréscimo.
Serve 4 pessoas
R$ 77,00
60 rolls
72 rolls
Escolha 6 porções (com 12 unidades cada) 15 opções diferentes de rolls, você escolhe, algumas porções tem acréscimo.
Serve 4 pessoas
R$ 85,00
72 rolls
O que pedir???
Tanto faz
12 Hot Philadelphia - 12 Philadelphia - 12 Uramaki
Serve 1 pessoa
R$ 45,90
Tanto faz
Não sei!
4 sushi skin - 12 skin roll - 12 hot Philadelphia
Serve 1 pessoa
R$ 45,90
Não sei!
Botes Now
Bote Now 1 (36 peças)
12 peças de hotcroc skin + 12 kani maki + 05 sushis de kani + 07 sushis de salmão ** todos os pedidos serão enviados no barquinho promocional enquanto durarem os estoques.
Serve 2 pessoas
R$ 100,00
Bote Now 1 (36 peças)
Combo para familia - Dia das mães ifood
Bote Now Dia das mães
16 sashimis de salmão + 12 hot crocante + 06 philadelfia roll + 06 skin roll + 05 joe joe ** Todos os pedidos serão enviados no barquinho promocional enquanto durarem os estoques.
Serve 3 pessoas
R$ 135,00
Bote Now Dia das mães
Combos Now!
Combo 3
24 Hot Philadelphia - 24 Philadelphia - 10 sashimis salmão
Serve 2 pessoas
R$ 115,99
Combo 3
Combo 4
24 Hot Philadelphia - 24 Philadelphia - salmão - 4 sushi salmão - 4 sushi skin.
Serve 3 pessoas
R$ 129,99
Combo 4
Palito Now - Japa no palito
Palito hot croc + teriaki
Hot crocante no palito + 1 molho teriaki
R$ 19,90
Palito hot croc + teriaki
Palito salmão hot + teriaki
Salmão hot no palito +1 molho teriaki
R$ 22,90
Palito salmão hot + teriaki
Rolls
6 Pçs Uramaki Philadelfia Salmão
6pçs. Salmão, cream cheese, alga, arroz e gergelim por fora.
R$ 10,90
6 Pçs Uramaki Philadelfia Salmão
6 Pçs de Hot Philadelphia crocante
06 pçs. Salmão, cream cheese, arroz, alga, empanado na massa e na crocante.
R$ 12,50
6 Pçs de Hot Philadelphia crocante
6 pçs Philadélphia
6pçs. Salmão, crean cheese, arroz e alga.
R$ 11,99
6 pçs Philadélphia
6 pçs Skin roll
6pçs. Pele de salmão grelhada, alga, envolto por arroz e gergelim por fora.
R$ 9,50
6 pçs Skin roll
Hot Philadelphia Crocante Salmão
12 pçs. Salmão, cream cheese, arroz, alga, empanado na massa e na crocante.
R$ 22,00
Hot Philadelphia Crocante Salmão
Hot skin
6pçs. Pele de de salmão grelhadas, crean cheese, arroz, alga, empanado e frito.
R$ 10,50
Hot skin
Kani Roll
6pçs. Carne de siri(kani), arroz e alga.
R$ 9,00
Kani Roll
Salmão maki
6pçs. Salmão, arroz e alga.
R$ 11,00
Salmão maki
Now Premium Rolls
Salmão hot (sem arroz)
12 Peças do Hot Filadélfia sem arroz, uma delícia, muito Salmão e Cream cheese!
R$ 35,99
Salmão hot (sem arroz)
Uramaki salmão Now
Uramaki envolto em uma lâmina de salmão com cream cheese e geleia de pimenta.
Serve 1 pessoa
R$ 29,00
Uramaki salmão Now
Uramaki salmão hot
Serve 1 pessoa
R$ 25,00
Uramaki salmão hot
Joe joe
Joe joe tradicional ( recheado com cream cheese )
A partir de R$ 30,90
Joe joe tradicional ( recheado com cream cheese )
Sushi
Porção - sushi de salmão
Porção com 04 unidades
R$ 14,00
Porção - sushi de salmão
Porção - sushi skin
Porção com 04 unidades
R$ 10,00
Porção - sushi skin
Molhos e adicionais
Wasabi
R$ 0,20
Wasabi
Gengibre
R$ 0,20
Gengibre
Cream cheese adicional
40 ml
R$ 3,00
Cream cheese adicional
`;

const uuid = () => Math.random().toString(36).substring(2, 15);

async function main() {
    console.log('Seeding JSON...');

    const knownCategories = [
        "Destaques", "Entradinhas", "Paga na entrega ganhe teriaki grátis", "Top 10",
        "Ofertas de Abril", "Super Combo 72 rolls", "Tudo por 4,99", "Tudo por 9,99", "Promoção de Rolls",
        "O que pedir???", "Botes Now", "Combo para familia - Dia das mães ifood", "Combos Now!",
        "Palito Now - Japa no palito", "Rolls", "Now Premium Rolls", "Joe joe", "Sushi", "Molhos e adicionais"
    ];

    const lines = rawData.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const db = {
        categories: [],
        products: [],
        storeConfig: {
            name: "Sushi Now",
            phone: "5522997760263",
            whatsapp: "5522997760263"
        }
    };

    let currentCategoryId = null;
    let catOrder = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Is it a category?
        if (knownCategories.includes(line)) {
            console.log(`Creating Category: ${line}`);
            currentCategoryId = uuid();
            db.categories.push({
                id: currentCategoryId,
                name: line,
                order: catOrder++,
                active: true
            });
            continue;
        }

        if (!currentCategoryId) continue;

        if (line.startsWith('R$') || line.startsWith('A partir de R$')) {
            let priceStr = line.replace('A partir de R$', '').replace('R$', '').trim().split('R$')[0];
            priceStr = priceStr.replace(',', '.');
            const price = parseFloat(priceStr);

            let name = lines[i - 1];
            let desc = "";

            if (i >= 2 && !lines[i - 2].startsWith('R$') && !knownCategories.includes(lines[i - 2])) {
                if (lines[i - 1].length > 30 || lines[i - 1].includes('Serve') || lines[i - 1].includes('unidades') || lines[i - 1].includes('arroz')) {
                    name = lines[i - 2];
                    desc = lines[i - 1];
                }
            }

            if (name && !name.startsWith('R$')) {
                if (name === "Fechado") continue;

                console.log(`  -> Product: ${name} | ${price}`);
                db.products.push({
                    id: uuid(),
                    name: name,
                    description: desc,
                    price: price,
                    categoryId: currentCategoryId,
                    imageUrl: "",
                    active: true,
                    order: db.products.length
                });
            }
        }
    }

    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    fs.writeFileSync(path.join(dataDir, 'menu.json'), JSON.stringify(db, null, 2));
    console.log("Written to data/menu.json");
}

main();
