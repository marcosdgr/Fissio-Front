import React from 'react'
import StatsCard from './StatsCard'

const FilterCards = ({ counts = { total: 0, act: 0, inac: 0 }, filter, setFilter }) => {
  return (
    <div className="col-12 d-flex gap-3 cards-filtro-wrapper">
      <StatsCard title="Todas" count={counts.total} active={filter === 'Todas'} onClick={() => setFilter('Todas')} />
      <StatsCard title="Activas" count={counts.act} active={filter === 'Activas'} onClick={() => setFilter('Activas')} />
      <StatsCard title="Inactivas" count={counts.inac} active={filter === 'Inactivas'} onClick={() => setFilter('Inactivas')} />
    </div>
  )
}

export default FilterCards
