import Card from './Card';

function Admin({ openItems, offers }) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Admin Dashboard - View Offers</h2>
      <p className="text-gray-600 mb-6">Only you can see contact info. Admin Login mode!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openItems.map(item => (
          <Card
            key={item.id}
            type="open"
            {...item}
            isOwner ={true}
            offers = {offers[item.id] || []}
          />
        ))}
      </div>
    </section>
  );
}
export default Admin;