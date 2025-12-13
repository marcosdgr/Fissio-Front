import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomObrasSocialesPublic = () => {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerObrasSocialesConPlanes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener obras sociales activas
      const resObras = await axios.get(`${BASE_URL}api/obras-sociales/v1/`);
      const obras = resObras.data.filter(obra => obra.IsActive && obra.EstadoObra === 'Activa');
      
      // Obtener planes para cada obra social
      const resPlanes = await axios.get(`${BASE_URL}api/plan-obra/v1/`);
      const todosPlanes = resPlanes.data || [];
      
      // Combinar obras con sus planes
      const obrasConPlanes = obras.map(obra => ({
        ...obra,
        planes: todosPlanes.filter(plan => 
          plan.idObraSocial === obra.idObraSocial && 
          plan.IsActive && 
          plan.EstadoPlan === 'Vigente'
        )
      }));
      
      setObrasSociales(obrasConPlanes);
    } catch (err) {
      console.error('Error al cargar obras sociales:', err);
      setError('Error al cargar obras sociales');
      setObrasSociales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerObrasSocialesConPlanes();
  }, []);

  return { 
    obrasSociales, 
    loading, 
    error 
  };
};

export default useCustomObrasSocialesPublic;
