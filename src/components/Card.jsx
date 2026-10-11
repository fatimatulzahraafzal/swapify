// Updated in L2: Added props onProposeSwap, isOwner, offers; in open type, wrapped button in !isOwner conditional (for role-based toggle)
function Card({ type, image, title, rating, description, accepts, date, summary, onProposeSwap, isOwner = false, offers = [] }) { // New in L2: Added props for form integration and toggle
  const tags = accepts ? accepts.split(' or ').map(tag => tag.trim()) : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Condition:</span>
          <span className="text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (i < rating ? '★' : '☆'))}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        {type === 'open' && (
          <>
            <div className="mb-5">
              <span className="text-sm text-gray-500 block mb-2">Swap for:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {!isOwner && ( // New in L2: Conditional for visitor propose button
              <button
                onClick={onProposeSwap} // New in L2: Added onClick for form trigger
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition font-medium"
              >
                Propose Swap
              </button>
            )}

            {isOwner && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Offers: </h4>
                { offers.length > 0 ? (
                  offers.map(offer => (
                    <div key={offer.id} className="text-sm text-gray-700 mb-1">
                      {offer.name} - {offer.contact} - {offer.proposal}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No offers yet</p>
                )              
              }                
              </div>
            )}


          </>
        )}
        {type === 'closed' && (
          <>
            <p className="text-sm text-gray-500 mb-2">Date: {date}</p>
            <p className="text-gray-700">{summary}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Card;