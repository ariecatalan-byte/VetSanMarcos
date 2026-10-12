import { Link } from "react-router-dom";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { useAuth } from "../../context/AuthContext";
import { useDatos } from "../../context/DatosContext";
import { formatearCLP } from "../../utils/formato";
import { puede, type Accion } from "../../utils/permisos";
import { esStockCritico } from "../../utils/productos";

interface Atajo {
  a: string;
  titulo: string;
  texto: string;
  permiso: Accion;
}

const ATAJOS: Atajo[] = [
  { a: "/admin/ordenes", titulo: "Órdenes", texto: "Gestión y seguimiento de las órdenes de compra realizadas.", permiso: "ordenes:ver" },
  { a: "/admin/productos", titulo: "Productos", texto: "Inventario, precios y stock de los productos.", permiso: "productos:ver" },
  { a: "/admin/categorias", titulo: "Categorías", texto: "Organiza los productos en categorías.", permiso: "categorias:gestionar" },
  { a: "/admin/usuarios", titulo: "Usuarios", texto: "Gestión de cuentas de usuario y sus roles.", permiso: "usuarios:listar" },
  { a: "/admin/usuarios/nuevo", titulo: "Nuevo cliente", texto: "Registra una cuenta de cliente.", permiso: "usuarios:crear" },
  { a: "/admin/reportes", titulo: "Reportes", texto: "Informes de ventas y productos.", permiso: "reportes:ver" },
  { a: "/perfil", titulo: "Perfil", texto: "Tus datos personales.", permiso: "panel:acceder" },
  { a: "/", titulo: "Tienda", texto: "Ver la tienda como la ven los clientes.", permiso: "panel:acceder" },
];

/** Dashboard: tarjetas de resumen (según el rol) y accesos directos a las secciones permitidas. */
export function Dashboard() {
  const { usuario, usuarios } = useAuth();
  const { productos, ordenes } = useDatos();
  const rol = usuario?.rol;
  const pagadas = ordenes.filter((o) => o.estado === "pagada");
  const criticos = productos.filter(esStockCritico).length;

  return (
    <>
      <EncabezadoPagina titulo="Dashboard" descripcion={`Resumen de actividades. Bienvenido/a, ${usuario?.nombre ?? ""}.`} />
      <div className="row g-3 mb-4">
        {puede(rol, "ordenes:ver") && (
          <div className="col-12 col-md-6 col-xl-3"><div className="card text-bg-primary border-0 p-3"><div className="small">Compras pagadas</div><div className="fs-2 fw-bold">{pagadas.length}</div></div></div>
        )}
        <div className="col-12 col-md-6 col-xl-3"><div className="card text-bg-success border-0 p-3"><div className="small">Productos</div><div className="fs-2 fw-bold">{productos.length}</div></div></div>
        <div className="col-12 col-md-6 col-xl-3"><div className="card text-bg-danger border-0 p-3"><div className="small">Productos con stock crítico</div><div className="fs-2 fw-bold">{criticos}</div></div></div>
        {puede(rol, "usuarios:listar") && (
          <div className="col-12 col-md-6 col-xl-3"><div className="card text-bg-warning border-0 p-3"><div className="small">Usuarios</div><div className="fs-2 fw-bold">{usuarios.length}</div></div></div>
        )}
        {puede(rol, "reportes:ver") && (
          <div className="col-12"><div className="card border-0 shadow-sm p-3"><span className="text-secondary small">Ventas totales</span><span className="fs-3 fw-bold">{formatearCLP(pagadas.reduce((s, o) => s + o.total, 0))}</span></div></div>
        )}
      </div>

      <div className="row g-3">
        {ATAJOS.filter((a) => puede(rol, a.permiso)).map((a) => (
          <div key={a.a} className="col-12 col-sm-6 col-xl-3">
            <Link to={a.a} className="text-decoration-none text-reset">
              <div className="card border-0 shadow-sm h-100 producto-card"><div className="card-body"><h2 className="h6 fw-bold">{a.titulo}</h2><p className="small text-secondary mb-0">{a.texto}</p></div></div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
