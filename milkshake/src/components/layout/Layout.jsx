import React from "react"
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

export default function Layout({children, showForm, setShowForm, isHomePage}){
    return(
        <div className="main-layout">
            <header className="header">
                <div className="header-content">
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        <div className="header-titles">
                            <h1>Milkshake</h1>
                            <h1>Reviews</h1>
                        </div>
                    </Link>

                    {isHomePage && (
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? <X/> : <Plus/>} {showForm ? 'Stäng' : 'Ny recension'}
                        </button>
                    )}
                </div>
            </header>

            {children}
        </div>
    );
}