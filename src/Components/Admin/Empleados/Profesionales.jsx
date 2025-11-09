import Categorias from "./Categorias/Categorias";
import Empleados from "./RegistroEmpleados/Empleados";


const Profesionales = () => (
  <div className="p-5 bg-white rounded shadow">
    <h2 className="text-2xl font-bold text-gray-800">Profesionales</h2>
    <Empleados />
    <br />
    <Categorias />

  </div>
);
export default Profesionales;
