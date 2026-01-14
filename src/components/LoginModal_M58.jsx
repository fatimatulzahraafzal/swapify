// New file in L2
function LoginModal({ onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e.target.pin.value);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter PIN</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="pin"
            placeholder="PIN"
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginModal;