import { useState } from 'react';
import MilkshakeCard from './components/MilkshakeCard';
import AddMilkshakeForm from './components/AddMilkshakeForm';
import './App.css'

function App() {
const [milkshakes, setMilkshakes] = useState([
    {
      id: 1,
      name: "Triple Chokladbomb",
      place: "Loffes Burger",
      rating: 8.7,
      comment: "SÅ jävla chokladig att man blir lite rädd efter halva",
      imageUrl: "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?w=800",
      date: "2025-12-12"
    },
    {
      id: 2,
      name: "Oreo Monster",
      place: "Vårda & Co",
      rating: 9.1,
      comment: "Bästa oreo-milken hittills! Lite för mycket glass kanske?",
      imageUrl: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800",
      date: "2025-11-28"
    }
  ]);

  const addMilkshake = (newMilkshake) => {
    setMilkshakes(prev => [
      {...newMilkshake, id: Date.now() },
      ...prev
    ]);
  };

  return (
    <div className="app">
      <header>
        <h1>Milkshake Reviewers</h1>
        <p>Vi dricker, Vi bedömer!!, VI SMAKAR!!</p>
      </header>

      <main>
        <AddMilkshakeForm onAdd={addMilkshake}/>

        <div className="milkshake-grid">
          {milkshakes.map(milkshake => (
           <MilkshakeCard key={milkshake.id} milkshake={milkshake} /> 
          ))}
        </div>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} — Annika & Mattias • Milkshake Experter</p>
      </footer>
    </div>
  )
}

export default App
