import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export const StarDisplay = ({ rating }) => {
    const score = rating || 0; 

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= score) {
            stars.push(<FaStar key={i} color="#ffc107" />);
        } else if (i === Math.ceil(score) && !Number.isInteger(score)) {
            stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
        } else {
            stars.push(<FaRegStar key={i} color="#ffc107" />);
        }
    }

    return (
        <div className="d-flex align-items-center">
            <div className="me-2">{stars}</div>
            <span className="fw-bold">{score.toFixed(1)}</span>
        </div>
    );
};
