const url = "https://www.ifood.com.br/delivery/cabo-frio-rj/now-sushi--cabo-frio-porto-do-carro/e4f46e56-a0b6-4963-9372-79917e3550f6";

async function run() {
  console.log("Fetching...");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  });
  const html = await res.text();
  console.log("Length:", html.length);

  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (match && match[1]) {
    console.log("Found NEXT_DATA");
    const data = JSON.parse(match[1]);
    const fs = await import('fs');
    fs.writeFileSync('dump.json', JSON.stringify(data, null, 2));
    console.log("Dumped to dump.json");

    // Check for Restaurant details
    const restaurant = data.props?.pageProps?.restaurant || data.props?.pageProps?.initialState?.restaurant;
    if (restaurant) {
      console.log("Restaurant Name:", restaurant.name);
    }

    // Check for Menu
    // Structure changes often. Checking potential deep paths.
    // often under: data.props.pageProps.initialMenu
    // or data.props.pageProps.fallback (React Query hydration states)

    const props = data.props?.pageProps || {};
    console.log("PageProps Keys:", Object.keys(props));

    if (props.dehydratedState) {
      console.log("Found Dehydrated State (React Query)");
      const queries = props.dehydratedState.queries;
      queries.forEach(q => {
        if (q.queryKey.includes('menu')) {
          console.log("Found Menu Query:", q.queryKey);
          const categories = q.state?.data?.associates?.[0]?.catalog?.categories || q.state?.data?.menu;
          if (categories) {
            console.log("Found Categories count:", categories.length);
            if (categories.length > 0) {
              console.log("Sample Cat:", categories[0].name);
              console.log("Sample Product:", categories[0].items?.[0]?.name);
            }
          }
        }
      });
    }


    // Try API Fetch
    const uuid = "e4f46e56-a0b6-4963-9372-79917e3550f6";
    const apiUrl = `https://marketplace.ifood.com.br/v2/merchants/${uuid}/catalog`;
    console.log("Fetching API:", apiUrl);
    try {
      const apiRes = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        const fs = await import('fs');
        fs.writeFileSync('catalog.json', JSON.stringify(apiData, null, 2));
        console.log("Catalog saved to catalog.json. Categories:", apiData.length || apiData.data?.length);
      } else {
        console.log("API Fetch Failed:", apiRes.status);
      }
    } catch (e) {
      console.log("API error:", e);
    }
  }
}

run();
