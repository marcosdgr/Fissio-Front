import React from 'react'

const StatsCard = ({ title, count, active, onClick }) => (
  <div className={`stats-card clickable ${active ? 'active' : ''}`} onClick={onClick} role="button">
    <div className="card-body">
      <div className="stats-title">{title}</div>
      <div className="stats-value">{count}</div>
    </div>
  </div>
)

export default StatsCard
