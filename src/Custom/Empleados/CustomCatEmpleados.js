import axios from 'axios'
import { BASE_URL } from '../../Api/api'
import { useEffect, useState } from 'react'

const useCustomCatEmpleados = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //obtener las categorias
  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}api/empleados/v1/categorias/`
      );
      setCategorias(response.data || []);
    } catch (err) {
      setError(err);
      console.error("error al obtener las categorías de empleados", err);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  // crear categoria de empleados
const crearCategoria = async (nuevaCategoria) => {
    try {
      setLoading(true);
      // mapear los campos a los que espera la tabla: NombreCat, DescripcionCat
      const payload = {
        NombreCat: nuevaCategoria.NombreCategoria ?? nuevaCategoria.NombreCat ?? nuevaCategoria.nombre,
        DescripcionCat: nuevaCategoria.DescripcionCategoria ?? nuevaCategoria.DescripcionCat ?? nuevaCategoria.descripcion
      }
      const response = await axios.post(`${BASE_URL}api/empleados/v1/categorias/crearCat`, payload);
      setCategorias((prevCategorias) => [...prevCategorias, response.data]);
    } catch (err) {
      setError(err);
      console.error("error al crear la categoría de empleados", err);
    } finally {
      setLoading(false);
    }
  };

  //editar datos de la categoria de empleados
const editarCategoria = async (idCategoria, datosActualizados) => {
    try {
      setLoading(true);
      // mapear campos a los esperados por la API / tabla
      const payload = {
        NombreCat: datosActualizados.NombreCategoria ?? datosActualizados.NombreCat ?? datosActualizados.nombre,
        DescripcionCat: datosActualizados.DescripcionCategoria ?? datosActualizados.DescripcionCat ?? datosActualizados.descripcion
      }
      const response = await axios.put(`${BASE_URL}api/empleados/v1/categorias/actualizarCat/${idCategoria}/`, payload);
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          // normalizar id: puede venir como idCatEmpleado o id
          (categoria.idCatEmpleado ?? categoria.id) === idCategoria ? response.data : categoria
        )
      );
    } catch (err) {
      setError(err);
      console.error("error al editar la categoría de empleados", err);
    } finally {
      setLoading(false);
    }
  };

  //borrado lógico de la categoría de empleados
const cambiarEstadoCategoria = async (idCategoria, nuevoEstado) => {
    try {
      setLoading(true);
      // la tabla usa IsActive para marcar activo/inactivo
      await axios.put(`${BASE_URL}api/empleados/v1/categorias/cambiaractcat/${idCategoria}/`, { IsActive: nuevoEstado });
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          (categoria.idCatEmpleado ?? categoria.id) === idCategoria ? { ...categoria, IsActive: nuevoEstado } : categoria
        )
      );
    } catch (err) {
      setError(err);
      console.error("error al cambiar el estado de la categoría de empleados", err);
    } finally {
      setLoading(false);
    }
  };
  // Cargar las categorías al montar el hook
  useEffect(() => {
    obtenerCategorias();
  }, []);

  // API pública del hook
  return {
    categorias,
    loading,
    error,
    obtenerCategorias,
    crearCategoria,
    editarCategoria,
    cambiarEstadoCategoria
  };
};

export default useCustomCatEmpleados;
