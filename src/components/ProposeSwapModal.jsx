import { useState, useEffect } from 'react';
import { ValueHelperDisplay, getItemValue } from './ValueHelper';

function ProposeSwapModal({ item, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [proposal, setProposal] = useState('');
  const [value, setValue] = useState(null);
  const [loadingValue, setLoadingValue] = useState(true);

  useEffect(() => {
    const fetchValue = async () => {
      setLoadingValue(true);
      const val = await getItemValue(item);
      setValue(val);
      setLoadingValue(false);
    };
    fetchValue();
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(item.id, { name, contact, proposal });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Propose Swap for {item.title}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Contact (e.g., email)"
            value={contact}
            onChange={e => setContact(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Your Proposal"
            value={proposal}
            onChange={e => setProposal(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          
          {loadingValue ? (
            <p className="text-gray-500 text-center">Fetching similar item prices...</p>
          ) : (
            <ValueHelperDisplay value={value} />
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProposeSwapModal;