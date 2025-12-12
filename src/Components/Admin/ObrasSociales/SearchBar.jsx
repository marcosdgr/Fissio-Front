const SearchBar = ({ query, setQuery, filter, setFilter }) => (
  <div className="servicios-filters mb-3">
    <div className="row align-items-center">
      <div className="col-md-8">
        <div className="input-group">
          <input className="form-control" placeholder="Buscar por nombre, teléfono o email" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="col-md-4 d-flex justify-content-end">
        <select className="form-select w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="Todas">🔍 Todas</option>
          <option value="Activas">✅ Activas</option>
          <option value="Inactivas">❌ Inactivas</option>
        </select>
      </div>
    </div>
  </div>
)

export default SearchBar
