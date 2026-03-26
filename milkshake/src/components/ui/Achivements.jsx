export const ACHIEVEMENTS = [
    {
        id: "first_review",
        label: "Första slurpen",
        icon: "🥛",
        check: (reviews) => reviews.length >= 1,
    }
]

function getAchivements(reviews){
    return ACHIEVEMENTS .filter((a) => a.check(reviews));
}

export default function Achivements({reviews}) {
    const unlocked = getAchivements(reviews);
    const locked = ACHIEVEMENTS.filter((a) => !unlocked.includes(a))

    return(
        <div className="profile-achievements">
            
        </div>
    )
}