import { useState } from 'react'; // Updated in L3: Added useState for modal state management
import { supabase } from '../supabase'; // Updated in L3: Imported Supabase for async data writing
import Card from './Card';
import AddItemModal from './AddItemModal'; // Updated in L3: Imported new AddItemModal for form handling

function Admin({ openItems, offers }) {
  const [showAddModal, setShowAddModal] = useState(false); // Updated in L3: State to control add item modal visibility

  // Updated in L3: Added async handler for form submission to write new item to Supabase with validation
  const handleAddItem = async (newItem) => {
    try {
      const { error } = await supabase
        .from('items')
        .insert({
          owner_uid: 'test-owner',
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
      alert('Failed to add item. Check console for details.');
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Admin Dashboard – View Offers</h2>
      <p className="text-gray-600 mb-6">Only you can see contact info. Admin Login mode!</p>

      {/* Updated in L3: Added button to trigger add item modal */}
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-6 bg-blue-500 text-white px-6 py-3"
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
          />
        ))}
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSubmit={handleAddItem} />} {/* Updated in L3: Conditional render of new modal */}
    </section>
  );
}

export default Admin;