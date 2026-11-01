import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import img1 from './assets/img1.png';
import img2 from './assets/img2.png';
import img3 from './assets/img3.png';
import Navbar from './components/Navbar_M57';
import Footer from './components/Footer_M57';
import Home from './components/Home_M57';
import Admin from './components/Admin_M57';
import LoginModal from './components/LoginModal_M57';
import {supabase} from './supabase'

function AppContent() {
  const navigate = useNavigate();

  const [openItems, setOpenItems] = useState([])
  const [closedTrades, setClosedTrades] = useState([])
  const ownerUid = 'test-owner'

 

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
        .on('postgres_changes', {event: '*', schema: 'public', table: 'offers'}, payload =>
        {
          fetchOffers();
        }
        )

        fetchItems();
        fetchOffers();


        return () => {
            supabase.removeChannel(openChannel);
            supabase.removeChannel(closedChannel);
            supabase.removeChannel(offersChannel);
        };
    }, []);

    const fetchItems = async() => {
        try {
            const {data: open, error: errOpen} = await supabase
            .from('items')
            .select('*')
            .eq('owner_uid', ownerUid)
            .eq('status','open')
            .order('created_at', {ascending:false})

            const {data: closed, error: errClosed} = await supabase
            .from('items')
            .select('*')
            .eq('owner_uid', ownerUid)
            .eq('status','closed')
            .order('created_at', {ascending:false})

            if (errOpen) console.erorr('Error fetching open items: '. errOpen)
            if (errClosed) console.erorr('Error fetching closed items: '. errClosed)
            
            setOpenItems(open || [])
            setClosedTrades(closed || [])
        }

        catch (error) {
            console.error('Fetch items failed: ', error)
        }
    }

    const fetchOffers = async() => {
      try {
        const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', {ascending:false})

        if (error) {
          console.error('Error fetching offers: ', error)
          return
        }

        const grouped = {}
        data.forEach(offer => {
          if(!grouped[offer.item_id]) grouped[offer.item_id] = []
          grouped[offer.item_id].push(offer)
        })
        setOffers(grouped)
      }

      catch(error) {
        console.error('Fetch offers failed: ', error)
      }
      
    }
  

  const [offers, setOffers] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
      />

      <main className="flex-grow p-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home openItems={openItems} closedTrades={closedTrades} offers={offers} />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <Admin openItems={openItems} offers={offers} /> : <Navigate to="/" />}
            />
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