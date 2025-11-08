import React, { useState, useEffect } from 'react';
import useCustomHorarios from '../../../Custom/useCustomHorarios';
import { toast } from 'sonner';
import "../../../Css/Horarios/FormHorario.css";



const FormHorario = ({ horario, onSuccess }) => {
  const { crearHorario, editarHorario } = useCustomHorarios();

  const [form, setForm] = useState({
    DiaSemana: '',
    HoraEntradaEsperada: '',
    HoraSalidaEsperada: '',
    DescripcionHorario: ''
  });

  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (horario) {
      setForm({
        DiaSemana: horario.DiaSemana || '',
        HoraEntradaEsperada: horario.HoraEntradaEsperada || '',
        HoraSalidaEsperada: horario.HoraSalidaEsperada || '',
        DescripcionHorario: horario.DescripcionHorario || ''
      });
    } else {
      setForm({ DiaSemana: '', HoraEntradaEsperada: '', HoraSalidaEsperada: '', DescripcionHorario: '' });
    }
  }, [horario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);

    try {
      const res = horario
        ? await editarHorario(horario.idHorario, form)
        : await crearHorario(form);

      if (res.success) {
        toast.success(horario ? 'Horario editado' : 'Horario creado');
        onSuccess();
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error('Error inesperado');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-horario">
      <div className="mb-3">
        <label className="form-label">Día de la semana</label>
        <select name="DiaSemana" value={form.DiaSemana} onChange={handleChange} className="form-select" required disabled={procesando}>
          <option value="">Seleccione un día</option>
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
            <option key={dia} value={dia}>{dia}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Hora Entrada Esperada</label>
        <input type="time" name="HoraEntradaEsperada" value={form.HoraEntradaEsperada} onChange={handleChange} className="form-control" required disabled={procesando} />
      </div>

      <div className="mb-3">
        <label className="form-label">Hora Salida Esperada</label>
        <input type="time" name="HoraSalidaEsperada" value={form.HoraSalidaEsperada} onChange={handleChange} className="form-control" required disabled={procesando} />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input type="text" name="DescripcionHorario" value={form.DescripcionHorario} onChange={handleChange} className="form-control" disabled={procesando} />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary btn-submit" disabled={procesando}>
          {procesando ? 'Procesando...' : (horario ? 'Guardar Cambios' : 'Crear Horario')}
        </button>
      </div>
    </form>
  );
};

export default FormHorario;