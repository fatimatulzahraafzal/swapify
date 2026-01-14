function Card({ type, id, image_url, title, rating, description, accepts, closed_at, summary, onProposeSwap, isOwner = false, offers = [], onAccept, onDecline }) {
  const tags = accepts ? accepts.split(' or ').map(tag => tag.trim()) : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition duration-300">
      <img src={image_url || 'https://picsum.photos/300/200'} alt={title} className="w-full h-48 object-cover" />

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

            {!isOwner && (
              <button
                onClick={onProposeSwap}
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition font-medium"
              >
                Propose Swap
              </button>
            )}

            {isOwner && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Offers ({offers.length})</h4>
                {offers.length > 0 ? (
                  offers.map(offer => (
                    <div key={offer.id} className="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded border">
                      <strong>{offer.name}</strong> – {offer.contact} <br />
                      {offer.proposal} <br />
                      {/*  Update: Display offer status with color coding */}
                      <span className={`font-bold ${offer.status === 'accepted' ? 'text-green-500' : offer.status === 'declined' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {offer.status ? offer.status.toUpperCase() : 'PENDING'}
                      </span>
                      {/* Added: Conditional buttons for pending offers */}
                      {offer.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => onAccept(id, offer.id)} className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>
                          <button onClick={() => onDecline(id, offer.id)} className="px-3 py-1 bg-red-500 text-white rounded">Decline</button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No offers yet</p>
                )}
              </div>
            )}
          </>
        )}

        {type === 'closed' && (
          <>
            <p className="text-sm text-gray-500 mb-2">Date: {new Date(closed_at).toLocaleDateString()}</p>
            <p className="text-gray-700">{summary}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Card;