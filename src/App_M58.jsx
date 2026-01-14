import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';

function AppContent() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [offers, setOffers] = useState({}); // { itemId: [offers] }
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const ownerUid = 'test-owner'; // Hardcoded until M59

  // Real-time subscriptions (like Firebase onSnapshot)
  useEffect(() => {
    // Fetch open items with owner filter
    const openChannel = supabase.channel('open-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.open` }, payload => {
        fetchItems();
      })
      .subscribe();

    // Fetch closed items with owner filter
    const closedChannel = supabase.channel('closed-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.closed` }, payload => {
        fetchItems();
      })
      .subscribe();

    // Fetch offers (any change = refetch all; no direct owner filter, but small data)
    const offersChannel = supabase.channel('offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, payload => {
        fetchOffers();
      })
      .subscribe();

    // Initial fetch
    fetchItems();
    fetchOffers();

    return () => {
      supabase.removeChannel(openChannel);
      supabase.removeChannel(closedChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data: open, error: errOpen } = await supabase
        .from('items')
        .select('*')
        .eq('owner_uid', ownerUid)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data: closed, error: errClosed } = await supabase
        .from('items')
        .select('*')
        .eq('owner_uid', ownerUid)
        .eq('status', 'closed')
        .order('created_at', { ascending: false });

      if (errOpen) console.error('Error fetching open items:', errOpen);
      if (errClosed) console.error('Error fetching closed items:', errClosed);

      setOpenItems(open || []);
      setClosedTrades(closed || []);
      console.log('Fetched items:', { open: open?.length || 0, closed: closed?.length || 0 });
    } catch (error) {
      console.error('Fetch items failed:', error);
    }
    console.log('Fetched items details:', { open: openItems, closed: openItems?.map(i => i.title) || [], closed: closedTrades?.map(c => c.title) || [] });
  };

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        return;
      }

      const grouped = {};
      data.forEach(offer => {
        if (!grouped[offer.item_id]) grouped[offer.item_id] = [];
        grouped[offer.item_id].push(offer);
      });
      setOffers(grouped);
      console.log('Fetched offers:', Object.keys(grouped).length);
    } catch (error) {
      console.error('Fetch offers failed:', error);
    }
  };

  const handleLogin = (pin) => {
    if (pin === '1234') {
      setIsLoggedIn(true);
      setShowLogin(false);
      navigate('/admin');
    } else {
      alert('Wrong PIN!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} />

      <main className="flex-grow p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home openItems={openItems} closedTrades={closedTrades} offers={offers} />} />
            <Route path="/admin" element={isLoggedIn ? <Admin openItems={openItems} offers={offers} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </main>

      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSubmit={handleLogin} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;