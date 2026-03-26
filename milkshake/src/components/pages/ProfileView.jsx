import { useEffect, useState } from "react";
import{collection, getDocs} from "firsebase/firestore";
import {db} from "../../firebase";
import {Link} from "react-router-dom";


function getAchivements(reviews){
    return ACHIEVEMENTS .filter((a) => a.check(reviews));
}

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
    const achivements = getAchivements(reviews);

    const renderStars = (rating) => "⭐".repeat(Math.round(rating));

    return (
        <div className="profile-card">

        </div>
    )
}