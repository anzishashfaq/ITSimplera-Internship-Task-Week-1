import React from 'react';

const DashboardCard = ({ icon, label, value, accent }) => {
  return (
    <div className="dashboard-card" style={{ '--accent': accent }}>
      <div className="dashboard-card-icon">{icon}</div>
      <div>
        <p className="dashboard-card-value">{value}</p>
        <p className="dashboard-card-label">{label}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
