import { useState } from 'react';
import { supabase } from '../supabase';
import Card from './Card';
import ProposeSwapModal from './ProposeSwapModal';

function Home({ openItems, closedTrades, offers }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePropose = async (itemId, newOffer) => {
    try {
      const { error } = await supabase
        .from('offers')
        .insert({ item_id: itemId, name: newOffer.name, contact: newOffer.contact, proposal: newOffer.proposal });

      if (error) throw error;
      console.log('Offer submitted successfully to Supabase');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error submitting offer:', error.message);
      alert('Failed to submit offer. Check console for details.');
    }
  };

  return (
    <div className="flex flex-col gap-10">
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

      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 sticky top-16 bg-gray-100 z-10 pb-2">
          Closed Trades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closedTrades.map(trade => (
            <Card key={trade.id} type="closed" {...trade} />
          ))}
        </div>
      </section>

      {selectedItem && (
        <ProposeSwapModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSubmit={handlePropose}
        />
      )}
    </div>
  );
}

export default Home;