import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';
import {AuthProvider , useAuth} from './AuthContext'


function AppContent() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [offers, setOffers] = useState({});
  const [showLogin, setShowLogin] = useState(false);

  const {session} = useAuth()
  const user = session?.user ?? null;
  const isLoggedIn = !!session

  const [loading, setLoading] = useState(true)


   
  const ownerUid = 'test-owner';

  // Updated in L4: Added real-time subscription for offers table to complete full data flow
  useEffect(() => {
    const openChannel = supabase.channel('open-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.open` }, payload => {
        fetchItems();
      })
      .subscribe();

    const closedChannel = supabase.channel('closed-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `owner_uid=eq.${ownerUid},status=eq.closed` }, payload => {
        fetchItems();
      })
      .subscribe();

    const offersChannel = supabase.channel('offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, payload => {
        fetchOffers();
      })
      .subscribe();

    fetchItems();
    fetchOffers(); // Updated in L4: Added initial fetch for offers from Supabase

    return () => {
      supabase.removeChannel(openChannel);
      supabase.removeChannel(closedChannel);
      supabase.removeChannel(offersChannel);
    };
  }, []);

  const fetchItems = async () => {
    setLoading(true)
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
    } catch (error) {
      console.error('Fetch items failed:', error);
    }
    finally {
      setLoading(false)
    }
  };

  // Updated in L4: Added async function to fetch and group offers from Supabase for full persistence
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
    } catch (error) {
      console.error('Fetch offers failed:', error);
    }
  };

  const handleLogin = async(email,password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error) {
      alert(error.message)
    }  
    else {
      setShowLogin(false)
      navigate('/admin')
    }
  };

  const handleLogout = async() => {
    await supabase.auth.signOut()
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} />

      <main className="flex-grow p-4 pt-20">
        <div className="max-w-6xl mx-auto">

          {loading ? (
             <div className='text-center'>Loading... </div>
          ) : (           
          <Routes>
            <Route path="/" element={<Home openItems={openItems} closedTrades={closedTrades} offers={offers} />} /> {/* Updated in L4: Removed setOffers prop as offers are now persisted in backend */}
            <Route path="/admin" element={isLoggedIn ? <Admin openItems={openItems} offers={offers} /> : <Navigate to="/" />} />
          </Routes>            
          ) }
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;