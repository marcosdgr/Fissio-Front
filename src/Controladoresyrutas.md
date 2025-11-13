controladores
import e from "express";
import db from "../../Config/db.js";
import bcrypt from "bcryptjs"; 

export const traerPacientes = (req, res) => {
  const traerPacientesQuery = `
    SELECT p.idPaciente, p.DNI, p.NombrePaciente, p.ApellidoPaciente, p.FechaNacPaciente,
           p.TelefonoPaciente, p.DireccionPaciente, p.Sexo, p.idLocalidad, p.IsActive,
           l.NombreLocalidad, 
           u.idUsuario, u.MailUsuario
    FROM pacientes p
    INNER JOIN localidades l ON p.idLocalidad = l.idLocalidad
    LEFT JOIN usuarios u ON p.idUsuario = u.idUsuario
  `;
  db.query(traerPacientesQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    // Agregar información adicional para cada paciente
    const pacientesConInfo = results.map(paciente => ({
      ...paciente,
      PasswordTemporal: true // Por seguridad, no devolvemos la contraseña real
    }));
    return res.status(200).json(pacientesConInfo);
  });
};
export const actualizarPaciente = (req, res) => {
  try {
    const { idPaciente } = req.params;
    const {
      NombrePaciente,
      ApellidoPaciente,
      DNI,
      FechaNacPaciente,
      TelefonoPaciente,
      DireccionPaciente,
      Sexo,
      idLocalidad,
    } = req.body;

    if (!NombrePaciente || !ApellidoPaciente || !DNI || !FechaNacPaciente ||
        !TelefonoPaciente || !DireccionPaciente || !Sexo || !idLocalidad) {
      return res.status(400).json({ message: "Faltan datos obligatorios del paciente" });
    }

    let sexoNormalizado = Sexo;
    if (Sexo === 'M' || Sexo === 'Masculino') {
        sexoNormalizado = 'Masculino';
    } else if (Sexo === 'F' || Sexo === 'Femenino') {
        sexoNormalizado = 'Femenino';
    } else if (Sexo === 'O' || Sexo === 'Otro') {
        sexoNormalizado = 'Otro';
    } else {
        return res.status(400).json({ 
            message: "Valor de Sexo inválido. Debe ser 'Masculino', 'Femenino' o 'Otro'" 
        });
    }

    const verificarDNIQuery = "SELECT idPaciente FROM pacientes WHERE DNI = ? AND idPaciente != ?";
    db.query(verificarDNIQuery, [DNI, idPaciente], (error, pacienteExistente) => {
      if (error) {
        return res.status(500).json({ message: 'Error al verificar DNI' });
      }

      if (pacienteExistente.length > 0) {
        return res.status(400).json({ message: "El DNI ya está registrado por otro paciente" });
      }

      const actualizarPacienteQuery = `
        UPDATE pacientes 
        SET NombrePaciente = ?, ApellidoPaciente = ?, DNI = ?, FechaNacPaciente = ?, 
            TelefonoPaciente = ?, DireccionPaciente = ?, Sexo = ?, idLocalidad = ? 
        WHERE idPaciente = ?
      `;

      db.query(
        actualizarPacienteQuery,
        [
          NombrePaciente,
          ApellidoPaciente,
          DNI,
          FechaNacPaciente,
          TelefonoPaciente,
          DireccionPaciente,
          sexoNormalizado,
          idLocalidad,
          idPaciente,
        ],
        (error, results) => {
          if (error) {
            return res.status(500).json({ message: "Error al actualizar paciente" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
          }

          res.status(200).json({ message: "Paciente actualizado exitosamente" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};
export const cambiarEstadoPaciente = (req, res) => {
  try {
    const { idPaciente } = req.params;
    const { IsActive } = req.body;

    if (IsActive !== 0 && IsActive !== 1) {
      return res.status(400).json({
        message: "IsActive debe ser 0 (inactivo) o 1 (activo)",
      });
    }

    const verificarEstadoQuery = `
      SELECT IsActive 
      FROM pacientes 
      WHERE idPaciente = ?
    `;

    db.query(verificarEstadoQuery, [idPaciente], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error al verificar estado del paciente" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }

      const estadoActual = results[0].IsActive;

      if (estadoActual === IsActive) {
        const estadoTexto = IsActive === 1 ? "activo" : "inactivo";
        return res.status(400).json({
          message: `El paciente ya se encuentra ${estadoTexto}`,
        });
      }

      const cambiarEstadoQuery = `
        UPDATE pacientes 
        SET IsActive = ?
        WHERE idPaciente = ?
      `;

      db.query(
        cambiarEstadoQuery,
        [IsActive, idPaciente],
        (error, updateResults) => {
          if (error) {
            return res.status(500).json({ message: "Error al cambiar estado del paciente" });
          }

          const mensaje =
            IsActive === 1
              ? "Paciente activado exitosamente"
              : "Paciente desactivado exitosamente";
          res.status(200).json({ message: mensaje });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};
export const crearPaciente = (req, res) => {
    try {
        const {
            DNI, NombrePaciente, ApellidoPaciente, FechaNacPaciente,
            TelefonoPaciente, DireccionPaciente, Sexo, idLocalidad,
            MailUsuario, PasswordUsuario
        } = req.body;

        if (!DNI || !NombrePaciente || !ApellidoPaciente || !FechaNacPaciente ||
            !TelefonoPaciente || !DireccionPaciente || !Sexo || !idLocalidad) {
            return res.status(400).json({ message: "Faltan datos obligatorios del paciente" });
        }

        let sexoNormalizado = Sexo;
        if (Sexo === 'M' || Sexo === 'Masculino') {
            sexoNormalizado = 'Masculino';
        } else if (Sexo === 'F' || Sexo === 'Femenino') {
            sexoNormalizado = 'Femenino';
        } else if (Sexo === 'O' || Sexo === 'Otro') {
            sexoNormalizado = 'Otro';
        } else {
            return res.status(400).json({ 
                message: "Valor de Sexo inválido. Debe ser 'Masculino', 'Femenino' o 'Otro'" 
            });
        }

        let emailFinal = MailUsuario;
        if (!emailFinal || emailFinal.trim() === "") {
            emailFinal = `${DNI}@sinmail.local`;
        }

        const passwordFinal = PasswordUsuario && PasswordUsuario.trim() !== "" 
            ? PasswordUsuario 
            : "1234";

        const verificarEmailQuery = "SELECT idUsuario FROM usuarios WHERE MailUsuario = ?";
        
        db.query(verificarEmailQuery, [emailFinal], (error, usuarioExistente) => {
            if (error) {
                return res.status(500).json({ message: 'Error al verificar email' });
            }

            if (usuarioExistente.length > 0) {
                return res.status(400).json({ message: "El email ya está registrado" });
            }

            const verificarDNIQuery = "SELECT idPaciente FROM pacientes WHERE DNI = ?";
            
            db.query(verificarDNIQuery, [DNI], async (error, pacienteExistente) => {
                if (error) {
                    return res.status(500).json({ message: 'Error al verificar DNI' });
                }

                if (pacienteExistente.length > 0) {
                    return res.status(400).json({ message: "El DNI ya está registrado" });
                }

                try {
                    const hashedPassword = await bcrypt.hash(passwordFinal, 10);
                    const idRolPaciente = 3; 
                    const crearUsuarioQuery = `
                        INSERT INTO usuarios (MailUsuario, PasswordUsuario, idRol) 
                        VALUES (?, ?, ?)
                    `;
                    
                    db.query(crearUsuarioQuery, [emailFinal, hashedPassword, idRolPaciente], (error, resultUsuario) => {
                        if (error) {
                            return res.status(500).json({ message: 'Error al crear usuario' });
                        }

                        const idUsuarioNuevo = resultUsuario.insertId;

                        const crearPacienteQuery = `
                            INSERT INTO pacientes 
                            (DNI, NombrePaciente, ApellidoPaciente, FechaNacPaciente, 
                             TelefonoPaciente, DireccionPaciente, Sexo, idLocalidad, idUsuario)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

                        const paramsPaciente = [
                            DNI, NombrePaciente, ApellidoPaciente, FechaNacPaciente,
                            TelefonoPaciente, DireccionPaciente, sexoNormalizado, idLocalidad, idUsuarioNuevo
                        ];

                        db.query(crearPacienteQuery, paramsPaciente, (error, resultPaciente) => {
                            if (error) {
                                db.query("DELETE FROM usuarios WHERE idUsuario = ?", [idUsuarioNuevo], () => {});
                                return res.status(500).json({ message: 'Error al crear paciente' });
                            }

                            res.status(201).json({
                                message: "Paciente creado correctamente",
                                idPaciente: resultPaciente.insertId,
                                usuario: {
                                    idUsuario: idUsuarioNuevo,
                                    MailUsuario: emailFinal,
                                    PasswordTemporal: passwordFinal === "1234"
                                }
                            });
                        });
                    });
                } catch (hashError) {
                    res.status(500).json({ message: 'Error al procesar contraseña' });
                }
            });
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};
export const traerLocalidades = (req, res) => {
  const query = "SELECT idLocalidad, NombreLocalidad FROM localidades WHERE IsActive = 1";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    return res.status(200).json(results);
  });
};
 // traer paciente por id
export const obtenerPacientePorId = (req, res) => {
   try {
    const { idPaciente } = req.params;
    const obtenerPacientePorId = "SELECT p.DNI, p.NombrePaciente, p.ApellidoPaciente, p.FechaNacPaciente, p.TelefonoPaciente, p.DireccionPaciente, p.Sexo, p.idLocalidad, p.IsActive, l.NombreLocalidad, u.idUsuario, u.MailUsuario FROM pacientes p INNER JOIN localidades l ON p.idLocalidad = l.idLocalidad LEFT JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE p.idPaciente = ?";
    db.query(obtenerPacientePorId, [idPaciente], (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error en el servidor" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
//Obtener turnos de paciente por id de paciente
export const obtenerTurnosPorIdPaciente = (req, res) => {
  try {
    const { idPaciente } = req.params;
    if (!idPaciente) {
      return res.status(400).json({ message: "Falta idPaciente" });
    }
    const obtenerTurnosPaciente = "SELECT t.idTurno, t.FechaSolicitudTurno, t.HorarioRequeridoTurno, t.EstadoTurno, tr.NombreTratamiento, CONCAT (e.NombreEmpleado, ' ', e.ApellidoEmpleado) AS NombreEmpleado FROM turnos t JOIN tratamientos tr ON t.idTratamiento = tr.idTratamiento LEFT JOIN empleados e ON t.idEmpleado = e.idEmpleado WHERE t.idPaciente = ?";
    db.query(obtenerTurnosPaciente, [idPaciente], (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error en el servidor" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
//obtener detalles del turno de un paciente (estado , fecha requerida, hora requerida)
export const obtenerDetallesTurno = (req, res) => {
 try {
  const {idPaciente} = req.params;
  if (!idPaciente) {
    return res.status(400).json({ message: "Falta idPaciente" });
  }
  const obtenerDetallesTurnoQuery = "SELECT t.idTurno, t.EstadoTurno, t.FechaRequeridaTurno, t.HorarioRequeridoTurno FROM turnos t WHERE t.idPaciente = ?";
  db.query(obtenerDetallesTurnoQuery, [idPaciente], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
} catch (error) {
  res.status(500).json({ message: "Error en el servidor" });
}
};
//obtener el mail de un paciente por idPaciente
export const obtenerMailPacientePorId = (req, res) => {
  try {
    const { idPaciente } = req.params;
    const obtenerMailQuery = "SELECT u.MailUsuario FROM pacientes p JOIN usuarios u ON p.idUsuario = u.idUsuario WHERE p.idPaciente = ?";
    db.query(obtenerMailQuery, [idPaciente], (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error en el servidor" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
//funcion para el paciente cancele alguno de sus turnos 
export const cancelarTurnoPaciente = (req, res) => {
  try {
    const { idPaciente, idTurno } = req.params;

    if (!idPaciente || !idTurno) {
      return res.status(400).json({ message: "ID del paciente y del turno son requeridos" });
    }

    // Verificar que el turno existe, pertenece al paciente y no esté ya finalizado o cancelado
    const verificarTurnoQuery = `
      SELECT EstadoTurno, idPaciente
      FROM turnos 
      WHERE idTurno = ?
    `;

    db.query(verificarTurnoQuery, [idTurno], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error en el servidor" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }

      const turno = results[0];

      // Verificar que el turno pertenece al paciente
      if (turno.idPaciente !== parseInt(idPaciente)) {
        return res.status(403).json({ message: "Este turno no pertenece al paciente" });
      }

      const estadoActual = turno.EstadoTurno;

      // Verificar que el turno no esté finalizado o cancelado
      if (estadoActual === "Finalizado" || estadoActual === "Cancelado") {
        return res.status(400).json({
          message: `No se puede cancelar un turno que ya está ${estadoActual}`
        });
      }

      // Actualizar el estado del turno a 'Cancelado'
      const cancelarTurnoQuery = `
        UPDATE turnos 
        SET EstadoTurno = 'Cancelado' 
        WHERE idTurno = ? AND idPaciente = ?
      `;

      db.query(cancelarTurnoQuery, [idTurno, idPaciente], (err, updateResults) => {
        if (err) {
          return res.status(500).json({ message: "Error al cancelar turno" });
        }

        if (updateResults.affectedRows === 0) {
          return res.status(404).json({ message: "No se pudo cancelar el turno" });
        }

        res.status(200).json({
          message: "Turno cancelado exitosamente",
          idTurno: idTurno,
          estadoAnterior: estadoActual,
          estadoActual: "Cancelado"
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
rutas
import { Router } from "express";

// importaciones de controllers
import {
  actualizarPaciente,
  cambiarEstadoPaciente,
  crearPaciente,
  traerPacientes,
  traerLocalidades,
  obtenerPacientePorId,
  obtenerTurnosPorIdPaciente,
  obtenerDetallesTurno,
  obtenerMailPacientePorId,
  cancelarTurnoPaciente
} from "../../Controllers/Pacientes/pacientes.controller.js";

const router = Router();

// Rutas específicas primero (antes de los parámetros dinámicos)
router.get("/", traerPacientes);
router.get("/localidades", traerLocalidades);

// Rutas con parámetros dinámicos
router.get("/:idPaciente/turnos/detalles", obtenerDetallesTurno);
router.get("/:idPaciente/mail", obtenerMailPacientePorId);
router.get("/:idPaciente/turnos", obtenerTurnosPorIdPaciente);
router.get("/:idPaciente", obtenerPacientePorId);

// ruta POST para crear nuevo paciente
router.post("/", crearPaciente);

// ruta PUT para actualizar datos del paciente
router.put("/actualizar/:idPaciente", actualizarPaciente);
router.put("/estado/:idPaciente", cambiarEstadoPaciente);
router.put("/:idPaciente/turnos/:idTurno/cancelar", cancelarTurnoPaciente);

export default router;
index
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


// importo ruta de pago 
import pagosRoutes from "./Routes/Pagos/pagos.routes.js";

// Importo rutas de categorias de medio de pago
import catMedioPagoRoutes from "./Routes/Pagos/catMedioPago.routes.js";

// Importo rutas de categorias de tipos de pago
import catTipoPagoRoutes from "./Routes/Pagos/catTipoPago.routes.js"

// importo ruta de horarios de trabajo
import horariosTrabajoRoutes from "./Routes/HorarioTrabajo/horariosTrabajo.routes.js";

//importo ruta de empleados horarios
import empleadosHorariosRoutes from "./Routes/EmpleadosHorarios/empleadoshorarios.routes.js"

// Importo rutas de asistencias
import asistenciasRoutes from "./Routes/Asistencias/asistencias.routes.js"

// Importo rutas de cobros
import cobrosRoutes from "./Routes/Cobros/cobros.routes.js"
import db from "./Config/db.js";

// importo las rutas principales
import usuariosRoutes from "./Routes/Usuarios/usuarios.routes.js";
import localidadesRoutes from "./Routes/Usuarios/localidades.routes.js";
import usuariosRoutesNew from "./Routes/usuarios.routes.js";
import loginRoutes from "./Routes/Login/login.routes.js";
import pacientesRoutes from "./Routes/Pacientes/pacientes.routes.js";
import turnosRoutes from "./Routes/Turnos/turnos.routes.js";

// importo rutas de servicios
import serviciosRoutes from "./Routes/Servicios/servicios.routes.js";
import turnosServiciosRoutes from "./Routes/Servicios/turnos_servicios.routes.js";

//Importo rutas de tratamientos
import tratamientosRoutes from "./Routes/Tratamientos/tratamientos.routes.js";
import turnosTratamientosRoutes from "./Routes/Tratamientos/turno_tratamiento.routes.js";

// importo rutas de empleados
import empleadoRoutes from "./Routes/Empleados/empleados.routes.js";
import categoriaEmpleadoRoutes from "./Routes/Empleados/categoria_empleados.routes.js";

// import de rutas adicionales
import comentarioRoutes from "./Routes/Comentarios/comentarioRoutes.js";
import historiaClinicaRoutes from "./Routes/HistoriaClinica/historiaClinica.routes.js";
import salaRoutes from "./Routes/Salas/salaRoutes.js";
import metricaDiariaRoutes from "./Routes/MetricasDiarias/metricasDiariasRoutes.js";
import catFaqsRoutes from "./Routes/Faqs/catFaqsRoutes.js";
import faqsRoutes from "./Routes/Faqs/faqsRoutes.js";

// importo rutas de mensajería interna
import mensajesInternosRoutes from "./Routes/mensajes-internos.routes.js";

// importar servicio de recordatorios
import { iniciarCronRecordatorios } from "./Services/recordatorios.service.js";

import obrasSocialesRoutes from "./Routes/ObrasSociales/obrassociales.routes.js";
import planObraPacientes from "./Routes/ObrasSociales/obraSocialPaciente.routes.js";
import planObraSocial from "./Routes/ObrasSociales/planObra.routes.js";
import chatWebRoutes from "./BOT/routes/chatWeb.routes.js";


// Inicializo dotenv para leer las variables de entorno

dotenv.config();

// realizo conexion a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    process.exit(1);
  }
  console.log("Conexión exitosa a la base de datos MySQL");
});

// inicializo express
const app = express();


//configuro cors (permitir requests desde cualquier origen, ya que no hay frontend aún)
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// configuracion del puerto
const PORT = process.env.PORT || 3000;

// middlewares

app.use(express.json());

// rutas
// comentarios
app.use("/api/comentarios/v1", comentarioRoutes);
// historias clinicas
app.use("/api/historiasClinicas/v1", historiaClinicaRoutes);
// salas
app.use("/api/salas/v1", salaRoutes);
// metricas diarias
app.use("/api/metricas/v1", metricaDiariaRoutes);
//categorias FAQ
app.use("/api/cat-faqs/v1", catFaqsRoutes);
// FAQs
app.use("/api/faqs/v1", faqsRoutes);

// rutas principales
app.use("/api/usuarios/v1", usuariosRoutes);
app.use("/api/localidades/v1", localidadesRoutes);
app.use("/api/usuarios-new/v1", usuariosRoutesNew);
app.use("/api/auth/v1", loginRoutes);
app.use("/api/pacientes/v1", pacientesRoutes);
app.use("/api/turnos/v1", turnosRoutes);

// rutas de mensajería interna
app.use("/api/mensajes-internos/v1", mensajesInternosRoutes);

// rutas de servicios
app.use("/api/servicios/v1", serviciosRoutes);
app.use("/api/turnos-servicios/v1", turnosServiciosRoutes);

// rutas de tratamientos
app.use("/api/tratamientos/v1", tratamientosRoutes);
app.use("/api/turnos-tratamientos/v1", turnosTratamientosRoutes);

// rutas de empleados
app.use("/api/empleados/v1/categorias", categoriaEmpleadoRoutes);
app.use("/api/empleados/v1", empleadoRoutes);

// Rutas
app.use("/api/pagos/v1", pagosRoutes);
app.use("/api/catMedioPago/v1", catMedioPagoRoutes);
app.use("/api/catTipoPago/v1", catTipoPagoRoutes);
app.use("/api/horariosTrabajo/v1", horariosTrabajoRoutes); //horarios de trabajo
app.use("/api/empleadosHorarios/v1", empleadosHorariosRoutes); //empleados con horarios
app.use("/api/asistencias/v1", asistenciasRoutes); //asistencias
app.use("/api/cobros/v1", cobrosRoutes); //cobros




app.use("/api/obras-sociales/v1", obrasSocialesRoutes);
app.use("/api/plan-obra/v1", planObraSocial);
app.use("/api/plan-obra-paciente/v1", planObraPacientes);

app.use("/api/chat-web/v1", chatWebRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} ✅`);

  // Iniciar sistema de recordatorios automáticos
  iniciarCronRecordatorios();
});
