  export async function getItemValue(item) {
    if(!item?.title) {
      return {low: 0, high: 0 , examples: []}
    }
    const query = item.title.trim()

    try {
      const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=6`);
      if(!res.ok) {
        throw new error ('DummyJSON fetch failed')
      }

      const data = await res.json()
      const products = data.products ||  []

      if (products.length === 0 ) {
        const rating = Number(item.rating || 3 )
        const base = rating*20
        const bonus = Math.min((item.description?.length ) || 0  / 10, 20 )
        return {
          low: Math.round(base - 10),
          high: Math.round(base + bonus + 10),
          examples: ['No examples found - estimated from rating and description']
        }

        
      }
      
      const prices = products
          .map(p => p.price || 0)
          .filter(p => p > 0)
        if (prices.length === 0) {
          return  {low: 10, high: 30, examples : ['No matches found - fallback'] }
        }

        const low = Math.min(...prices)
        const high = Math.max(...prices)
        const examples = products.slice(0, 3).map(p => `${p.title.slice(0,40)}...at $${p.price}`)
        
        return { low: Math.round(low), high: Math.round(high), examples}
    
    }

    catch (err) {
      console.error('DummyJSON error: ' , error)
      return { low: 15, high: 45, examples: ['Using simple stimate due to API issue']}

    }
}

export function ValueHelperDisplay({value}) {
  if(!value) return null

  return (
    
  )
}