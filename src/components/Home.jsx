// New file in L1
import Card from './Card';
import { useState } from 'react';
import ProposeSwapModal from  './ProposeSwapModal';

function Home({ openItems, closedTrades, offers, setOffers }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const handlePropose = (itemId, newOffer) => {
    setOffers(prev => ({
      ...prev,
      [itemId]: [...prev[itemId] || [], {id: Date.now(), ...newOffer}]
    }))
    setSelectedItem(null)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Open Items Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 sticky top-16 bg-gray-100 z-10 pb-2">
          Open Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openItems.map(item => (
            <Card
              key={item.id}
              type="open"
              {...item}
              onProposeSwap={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </section>
      {/* Closed Trades Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 sticky top-16 bg-gray-100 z-10 pb-2">
          Closed Trades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closedTrades.map(trade => (
            <Card
              key={trade.id}
              type="closed"
              {... trade}
            />
          ))}
        </div>
      </section>
      {selectedItem && (
        <ProposeSwapModal
        item = {selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmit={handlePropose}                
        />
      )}
    </div>
  );
}
export default Home;