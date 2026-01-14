import { useState } from 'react';
import { supabase } from '../supabase';
import Card from './Card';
import ProposeSwapModal from './ProposeSwapModal';

// Update: Add setMessage prop for notifications
function Home({ openItems, closedTrades, offers, setMessage }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // Update: Add status 'pending' to offer insert and setMessage on success
  const handlePropose = async (itemId, newOffer) => {
    try {
      const { error } = await supabase
        .from('offers')
        .insert({ item_id: itemId, name: newOffer.name, contact: newOffer.contact, proposal: newOffer.proposal, status: 'pending' });

      if (error) throw error;
      setSelectedItem(null);
      setMessage('Offer submitted successfully!');
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
            <Card key={trade.id} type="closed" {...trade} closed_at={trade.closed_at} summary={trade.summary} />
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