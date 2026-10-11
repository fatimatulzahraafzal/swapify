import { BrowserRouter  as Router , Routes, Route , useNavigate, Navigate} from 'react-router-dom'
import { useState } from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from './components/Card';
import img1 from './assets/img1.png'
import img2 from './assets/img2.png'
import img3 from './assets/img3.png'
import img4 from './assets/img4.png'
import img5 from './assets/img5.png'
import Admin from './components/admin';
import Home from './components/Home'
import LoginModal from './components/LoginModal';

function AppContent(){
    const navigate = useNavigate();
    const [isLoggedIn ,setIsLoggedIn] = useState(false)
    const [showLogin ,setShowLogin] = useState(false)
    const [offers, setOffers] = useState({})


    const handleLogin = (pin) =>{
        if (pin = '1234'){
            setIsLoggedIn(true)
            setShowLogin(false)
            navigate('/admin')
        } else {
            alert('Wrong Pin')
        }

    }

    const handleLogout = () => {
        navigate('/')
        setIsLoggedIn(false)
    }

    const openItems = [{
        id: 1,
        image: img1,
        title: 'old car',
        rating: 3,
        description:' old, rundown, still working engine.',
        accepts: 'Cash, scooter, items of simular value'
    },
    {
        id: 2,
        image: img2,
        title: 'Comic Collection',
        rating: 4,
        description:' Near mint condition, minor pressings on the corners.',
        accepts: 'Other books, best if comics'
    },
    {
        id: 3,
        image: img3,
        title: 'PSA 10 1st Edition Base Set Charizard',
        rating: 5,
        description:'Perfect corners, no damage on cassing.',
        accepts: 'Cash only'
    },
    ]

    const closedTrades = [
        {
            id: 4,
            image: img4,
            title: 'Limited Posters',
            rating: 2,
            description:'Old and bit worn down.',
            date:'2026-1-06',
            summary:'Traded for old comics from Michael'
        },
        {
            id: 5,
            image: img5,
            title: 'Cool Shades',
            rating: 4,
            description:'Though second handed basically brand new.',
            date:'2026-3-29',
            summary:'Traded for makeup from Lincy '
        }
]
 
    return(
        <div className="mid-h-screen bg-950-100 flex flex-col">
            <Navbar 
            className="fixed top-0 left-0 right-0 z-50"
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLoginClick={() => setShowLogin(true)}
            />
            
            
            <main className="flex-grow p-4 pt-20">
                <div className='max-w-6x1 mx-auto'>
                    <Routes>
                        <Route path ="/" element = { <Home openItems={openItems} closedTrades={closedTrades} offers = {offers} setOffers = {setOffers} /> } />
                        <Route  path = "/admin" 
                            element = {isLoggedIn ? 
                            <Admin openItems={openItems} 
                            offers = {offers}
                            />: 
                            <Navigate to="/"/> } />
                    </Routes>
                </div>                
            </main>
            <Footer/>
        </div>
    )
}

function App(){
    return(
        <Router>
            <AppContent/>
        </Router>
    )
}

export default App