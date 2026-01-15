
export async function getItemValue(item) {
  if (!item?.title) {
    return { low: 0, high: 0, examples: [] };
  }

  const query = item.title.trim();

  try {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=6`);
    if (!res.ok) throw new Error('DummyJSON fetch failed');

    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      const rating = Number(item.rating) || 3;
      const base = rating * 20;
      const bonus = Math.min((item.description?.length || 0) / 10, 20);
      return {
        low: Math.round(base - 10),
        high: Math.round(base + bonus + 10),
        examples: ['No exact matches – estimated from rating & description']
      };
    }
    const prices = products
      .map(p => p.price || 0)
      .filter(p => p > 0);

    if (prices.length === 0) {
      return { low: 10, high: 30, examples: ['Matches found but no prices – fallback'] };
    }

    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const examples = products.slice(0, 3).map(p => `${p.title.slice(0, 40)}... at $${p.price}`);

    return { low: Math.round(low), high: Math.round(high), examples };
  } catch (err) {
    console.error('DummyJSON error:', err);
    return { low: 15, high: 45, examples: ['Using simple estimate due to API issue'] };
  }
}

export function ValueHelperDisplay({ value }) {
  if (!value) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
      <p className="font-semibold text-green-800">Estimated Value (from sample marketplace data):</p>
      <p className="text-lg font-bold">${value.low} – ${value.high}</p>
      <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
        {value.examples.map((ex, i) => (
          <li key={i}>{ex}</li>
        ))}
      </ul>
    </div>
  );
}