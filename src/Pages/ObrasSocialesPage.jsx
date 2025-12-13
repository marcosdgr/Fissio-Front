import React from 'react';
import useCustomObrasSocialesPublic from '../Custom/useCustomObrasSocialesPublic';
import '../Css/ObrasSociales/ObrasSocialesPage.css';

const ObrasSocialesPage = () => {
  const { obrasSociales, loading, error } = useCustomObrasSocialesPublic();

  if (loading) {
    return (
      <div className="obras-sociales-page">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando obras sociales...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="obras-sociales-page">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="obras-sociales-page">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Obras Sociales</h1>
          <p className="lead text-muted">
            Conocé las obras sociales con las que trabajamos y sus planes disponibles
          </p>
        </div>

        {obrasSociales.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            No hay obras sociales disponibles en este momento
          </div>
        ) : (
          <div className="row g-4">
            {obrasSociales.map((obra) => (
              <div key={obra.idObraSocial} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm obra-social-card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-hospital me-2"></i>
                      {obra.NombreObraSocial}
                    </h5>
                  </div>
                  
                  <div className="card-body">
                    {/* Información de contacto */}
                    <div className="mb-3">
                      {obra.TelefonoObra && (
                        <p className="mb-2">
                          <i className="fas fa-phone text-primary me-2"></i>
                          <small>{obra.TelefonoObra}</small>
                        </p>
                      )}
                      {obra.EmailObra && (
                        <p className="mb-2">
                          <i className="fas fa-envelope text-primary me-2"></i>
                          <small>{obra.EmailObra}</small>
                        </p>
                      )}
                    </div>

                    {/* Planes */}
                    <div className="planes-section">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-list-ul me-2"></i>
                        Planes Disponibles
                      </h6>
                      
                      {obra.planes && obra.planes.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {obra.planes.map((plan) => (
                            <div key={plan.idPlanObra} className="list-group-item px-0 py-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1 fw-semibold">{plan.NombraPlan}</p>
                                  {plan.DescripcionPlan && (
                                    <small className="text-muted">{plan.DescripcionPlan}</small>
                                  )}
                                </div>
                                {plan.PorcentajeDescuentoPlan && (
                                  <span className="badge bg-success rounded-pill">
                                    {plan.PorcentajeDescuentoPlan}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          No hay planes vigentes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer con link a página web */}
                  {obra.PaginaWebObra && (
                    <div className="card-footer bg-transparent border-top">
                      <a 
                        href={obra.PaginaWebObra.startsWith('http') ? obra.PaginaWebObra : `https://${obra.PaginaWebObra}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObrasSocialesPage;
