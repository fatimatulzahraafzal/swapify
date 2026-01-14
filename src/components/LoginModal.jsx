import { useState } from 'react';

function LoginModal({ onClose, onSubmit }) {
  // Added: States for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Update: handleSubmit to pass email/password instead of PIN
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Owner Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Update: Change to email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          {/* Update: Change to password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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