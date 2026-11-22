import Card from './Card';
import { useState } from 'react';
import { supabase } from '../supabase';
import AddItemModal from './AddItemModal';

function Admin({ openItems, offers, user }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddItem = async (newItem) => {
    try {
      const { error } = await supabase
        .from('items')
        .insert({
          owner_uid: 'a7b30ceb-9131-4cad-a1e4-76f085f0eaa2',
          status: 'open',
          title: newItem.title,
          description: newItem.description,
          accepts: newItem.accepts,
          rating: Number(newItem.rating),
          image_url: newItem.image_url,
        });

      if (error) throw error;
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding item:', error.message);
      alert('Failed to add item. Check console for details.'); // NEW: Updated error message
    }
  };


  const handleDecline = async(itemId, offerId) => {
    try {
      const {error} = await supabase.from('offers').update({status:'declined'}).eq('id', offerId)
      if (error) throw error
    }
    catch(error) {
      console.error('Error declining offer: ', error)
      alert('Failed to decline offer')
    }
  }

  const handleAccept = async(itemId, offerId) => {
    try {
      const { data: item, error: itemError } = await supabase.from('items').select('*').eq('id', itemId).single();
      if (itemError || item.status !== 'open') {
        alert('Item already closed or error fetching.');
        return;
      }
      const { error: declineError } = await supabase
        .from('offers')
        .update({ status: 'declined' })
        .eq('item_id', itemId)
        .neq('id', offerId)
        .eq('status', 'pending');
      if (declineError) throw declineError;

      const {data: acceptedOffer, error: acceptError} = await supabase
      .from('offers')
      .update({ status: 'accepted' })
      .eq('id', offerId)
      .select('*')
      .single();
      if(acceptError) throw acceptError

      const summary = `Swapped with ${acceptedOffer.name} for ${acceptedOffer.proposal}`
      const {error: closeError} = await supabase
      .from('items')
      .update({ status: 'closed', closed_at: new Date().toISOString(), summary })
      .eq('id', itemId);

    if (closeError) throw closeError
  }  

  catch(error) {
    console.error('Error accepting offer: ', error)
    alert('Failed to accept offer')
  }   
  }


  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Admin Dashboard – View Offers</h2> {/* NEW: Updated title */}
      <p className="text-gray-600 mb-6">Only you can see contact info. Admin Login mode!</p> {/* NEW: Updated description */}

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-6 bg-blue-500 text-white px-6 py-3" // NEW: Removed 'rounded' class from button
      >
        Add New Item
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openItems.map(item => (
          <Card
            key={item.id}
            type="open"
            {...item}
            isOwner={true} 
            offers={offers[item.id] || []} 
            onDecline={handleDecline}
            onAccept={handleAccept}
            
          />
        ))}
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSubmit={handleAddItem} />}
    </section>
  );
}

export default Admin;