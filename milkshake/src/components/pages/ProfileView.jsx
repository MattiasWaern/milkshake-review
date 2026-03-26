import { useEffect, useState } from "react";
import{collection, getDocs} from "firsebase/firestore";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import Achivements from "../ui/Achivements";




function getStats(reviews){
    if (reviews.length === 0) return {avg: 0, best: null, count: 0};
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const best = reviews.reduce((a, b) => (a.rating >= b.rating ? a: b));
    return {avg: avg.toFixed(1), best, count: reviews.length};
}

function groupByUser(reviews){
    return reviews.reduce((acc, review) => {
        const name = review.reviewer || review.user ||review.name || "Okänd";
        if(!acc[name]) acc[name] = [];
        acc[name].push(review);
        return acc;
    }, {});
}

//ProfilKort

function ProfileCard({name, reviews}) {
    const stats = getStats(review);
    const Achivements = getAchivements(reviews);

    const renderStars = (rating) => "⭐".repeat(Math.round(rating));

    return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="profile-name">{name}</h2>
          <p className="profile-subtitle">{stats.count} recensioner</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="profile-stats">
        <div className="stat-box">
          <span className="stat-value">{stats.avg}</span>
          <span className="stat-label">Snittbetyg</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{stats.count}</span>
          <span className="stat-label">Recensioner</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">
            {new Set(reviews.map((r) => r.place)).size}
          </span>
          <span className="stat-label">Unika ställen</span>
        </div>
      </div>

      {/* Favoritshake */}
        <div className="profile-favorite">
            <span className="favorite-label">🏅 Bästa shake</span>
            <Link to={`/review/${stats.best.id}`} className="favorite-link">
            {stats.best.name} - {stats.best.place}{""}
            {renderStars(stats.best.rating)}
            </Link>
        </div>
    </div>
    );
}

export default function ProfilesView(){
    const [grouped, setGrouped] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews () {
            const snapshot = await getDocs(collection(db, "reviews"));
            const reviews = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGrouped(groupByUser(reviews));
            setLoading(false);
        }
        fetchReviews();
    }, []);

    if (loading) return <p className="loading">Laddar profiler... 🥤</p>
}