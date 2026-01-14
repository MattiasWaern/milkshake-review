import './MilkshakeCard.css'

function MilkshakeCard({milkshake}) {
    const stars = Math.round(milkshake.rating);
    const starString = '★'.repeat(stars) + '★'.repeat(10 - stars);


    return (
        <div className="milkshake-card">
            <div className="card-image">
                <img src={milkshake.imageUrl} alt={milkshake.name} loading="lazy"/>
            </div>

            <div className="card-content">
                <h2>{milkshake.name}</h2>
                <div className="place">{milkshake.palce}</div>

                <div className="rating">
                    <span className="score">{milkshake.rating.toFixed(1)}</span>
                    <span className="stars">{starString}</span>
                </div>

                <p className="comment">"{milkshake.comment}"</p>
                <p className="date">"{milkshake.date}"</p>
            </div>
        </div>
    );
}

export default MilkshakeCard