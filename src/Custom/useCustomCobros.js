import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Api/api.js';

const useCustomCobros = () => {
  const [cobros, setCobros] = useState({ cobros: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerCobros = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 CARGANDO COBROS DESDE:", `${BASE_URL}api/cobros/v1`);
      const res = await axios.get(`${BASE_URL}api/cobros/v1`);
      console.log("✅ RESPUESTA BACKEND:", res.data);
      console.log("📊 Tipo de respuesta:", typeof res.data);
      console.log("📋 Estructura de datos:", Object.keys(res.data));
      
      // Manejar diferentes estructuras de respuesta
      let cobrosData = [];
      if (Array.isArray(res.data)) {
        // Si res.data es directamente un array
        cobrosData = res.data;
        console.log("🔹 Respuesta es array directo con", cobrosData.length, "elementos");
      } else if (res.data.cobros && Array.isArray(res.data.cobros)) {
        // Si res.data.cobros es el array
        cobrosData = res.data.cobros;
        console.log("🔹 Respuesta tiene propiedad 'cobros' con", cobrosData.length, "elementos");
      } else if (res.data.data && Array.isArray(res.data.data)) {
        // Si res.data.data es el array
        cobrosData = res.data.data;
        console.log("🔹 Respuesta tiene propiedad 'data' con", cobrosData.length, "elementos");
      }
      
      console.log("✨ Cobros finales:", cobrosData);
      setCobros({ cobros: cobrosData });
    } catch (err) {
      console.error("❌ ERROR EN useCustomCobros:", err);
      console.error("❌ Respuesta del error:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      setError("Error al cargar cobros: " + (err.response?.data?.message || err.message));
      setCobros({ cobros: [] });
    } finally {
      setLoading(false);
    }
  };

  const agregarCobro = async (datos) => {
    try {
      const res = await axios.post(`${BASE_URL}api/cobros/v1`, datos);
      await obtenerCobros();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("ERROR AL AGREGAR:", err.response?.data);
      return { success: false, error: err.response?.data?.message || "Error al registrar" };
    }
  };

  const editarCobro = async (idCobro, datosActualizados) => {
    try {
      console.log("✏️ EDITANDO cobro con ID:", idCobro);
      console.log("🔗 URL:", `${BASE_URL}api/cobros/v1/${idCobro}`);
      console.log("📦 DATOS ENVIADOS:", datosActualizados);
      console.log("📋 CAMPOS:", Object.keys(datosActualizados));
      const res = await axios.put(`${BASE_URL}api/cobros/v1/${idCobro}`, datosActualizados);
      console.log("✅ RESPUESTA EDITAR:", res.data);
      await obtenerCobros();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ ERROR AL EDITAR:", err);
      console.error("❌ Respuesta completa:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      console.error("❌ Mensaje de error:", err.response?.data?.message || err.response?.data?.error);
      return { success: false, error: err.response?.data?.message || err.response?.data?.error || err.message || "Error al actualizar" };
    }
  };

  const eliminarCobro = async (idCobro) => {
    try {
      console.log("🗑️ ELIMINANDO cobro con ID:", idCobro);
      console.log("🔗 URL:", `${BASE_URL}api/cobros/v1/${idCobro}`);
      const res = await axios.delete(`${BASE_URL}api/cobros/v1/${idCobro}`);
      console.log("✅ RESPUESTA ELIMINAR:", res.data);
      await obtenerCobros();
      return { success: true };
    } catch (err) {
      console.error("❌ ERROR AL ELIMINAR:", err);
      console.error("❌ Respuesta:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      console.error("❌ URL que falló:", err.config?.url);
      return { success: false, error: err.response?.data?.message || err.message || "Error al eliminar" };
    }
  };

  useEffect(() => {
    obtenerCobros();
  }, []);

  return { 
    cobros, 
    loading, 
    error, 
    obtenerCobros,
    agregarCobro,
    editarCobro,
    eliminarCobro 
  };
};

export default useCustomCobros;