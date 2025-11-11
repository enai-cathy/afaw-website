import React from 'react';  

const Stat = ({ icon, number, text }) => {
  return (
    <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
      {/* added stat-card css styling */}
      <div className="stat-card text-center p-4 h-100 d-flex flex-column justify-content-center">
        <div className="mb-3">
          <i className={`${icon} fa-2x `}></i>
        </div>
        <h2 className="number mb-1">{number}</h2>
        <p className="text flex-grow-1">{text}</p>
      </div>
    </div>
  );
};

export default Stat;
