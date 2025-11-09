import axios from "axios";
import { BASE_URL } from "../../Api/api.js";
import { useAuthStore } from "../../Store/useAuthStore";

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Agregar token dinámicamente desde el store (si existe)
const getAuthHeaders = () => {
	try {
		const user = useAuthStore.getState().user;
		console.log('🔑 Usuario en store (getAuthHeaders):', user);
		
		const token = user?.token || user?.usuario?.token || user;
		console.log('🔑 Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
		
		return {
			Authorization: `Bearer ${token || ""}`,
		};
	} catch (err) {
		// Si ocurre un error al leer el store, devolvemos sin headers y lo registramos
		console.error("❌ Error obteniendo token del store:", err);
		return {};
	}
};

export const getActiveEmployees = async () => {
	console.log('📞 API: Obteniendo empleados activos...');
	const headers = getAuthHeaders();
	const response = await api.get("/api/empleados/v1/activos", { headers });
	console.log('✅ API: Empleados obtenidos:', response.data);
	return response.data;
};

// idUsuario1 e idUsuario2 (usuarios) para la conversación
export const getConversation = async (idUsuario1, idUsuario2) => {
	console.log(`📞 API: Obteniendo conversación entre ${idUsuario1} y ${idUsuario2}...`);
	const headers = getAuthHeaders();
	const response = await api.get(`/api/mensajes-internos/v1/conversacion/${idUsuario1}/${idUsuario2}`, { headers });
	console.log('✅ API: Conversación obtenida:', response.data);
	return response.data;
};

// Enviar mensaje: mensaje (string) y destinatarios (array de idEmpleado)
export const sendMessage = async (mensaje, destinatarios = []) => {
	console.log('📞 API: Enviando mensaje...', { mensaje, destinatarios });
	const headers = getAuthHeaders();
	const body = { mensaje, destinatarios };
	console.log('📦 Body de la petición:', body);
	console.log('📦 Headers de la petición:', headers);
	const response = await api.post("/api/mensajes-internos/v1/enviar", body, { headers });
	console.log('✅ API: Respuesta del servidor:', response.data);
	return response.data;
};

// Marcar como leído: idNotificacion, idEmpleadoDestinatario
export const markAsRead = async (idNotificacion, idEmpleadoDestinatario) => {
	console.log('📞 API: Marcando como leído...', { idNotificacion, idEmpleadoDestinatario });
	const headers = getAuthHeaders();
	const body = { idNotificacion, idEmpleadoDestinatario };
	const response = await api.put("/api/mensajes-internos/v1/leido", body, { headers });
	console.log('✅ API: Mensaje marcado como leído');
	return response.data;
};

export default {
	getActiveEmployees,
	getConversation,
	sendMessage,
	markAsRead,
};
