export interface Empresa {
  empresa_id: number;
  nombre: string;
  habilitado: number;
  created_at?: number;
  updated_at?: number;
}

export interface Persona {
  apellido_materno: string;
  apellido_paterno: string;
  cargo?: string;
  centro_costo_encargado?: number;
  centro_costo_id?: number;
  centros_costo?: CentroCosto[];
  ci_extension?: string;
  ci_origen?: string;
  ci?: string;
  ciudad: string;
  codigo: number;
  correo?: string;
  created_at?: number;
  empresa_id?: number;
  empresa: Empresa;
  fecha_nacimiento?: string;
  foto?: string;
  habilitado: number;
  nombre_completo: string;
  nombre?: string;
  persona_id: number;
  telefono?: string;
  ubicacion?: string;
  unidad_negocio_id: number;
  updated_at?: number;
  user: any;
  persona_centros_costos?: PersonaCentroCosto[];
}

export interface Rol {
  rol_id: number;
  aplicacion_id: number;
  nombre: string;
  habilitado: number;
  created_at?: number;
  updated_at?: number;
  aplicacion: Aplicacion;
  modulos: Modulo[];
}

export interface UnidadNegocio {
  check: boolean;
  codigo: number;
  division: Division;
  empresa_id: number;
  empresa: Empresa;
  habilitado: number;
  id: number;
  nombre: string;
}

export interface CentroCosto {
  centro_costo_id: number;
  checkEncargado?: boolean;
  checkPertenece?: boolean;
  codigo: string;
  empresa_id?: number;
  id: number;
  nombre: string;
  unidad_negocio_id: number;
}

export interface Division {
  division_id: number;
  nombre: string;
  unidades_negocio: UnidadNegocio[];
}

export interface User {
  id: number;
  created_at: number;
  email: string;
  habilitado: number;
  name: string;
  persona_id: number;
  updated_at: number;
  persona: Persona;
  roles: Rol[];
}

export interface Operacion {
  operacion_id: number;
  nombre: string;
  created_at?: number;
  updated_at?: number;
}

export interface Bitacora {
  bitacora_id: number;
  codigo_app: string;
  fecha: Date;
  nombre_completo: string;
  operacion: string;
  tabla_identificador: number;
  tabla: string;
}

export interface Aplicacion {
  aplicacion_id: number;
  area?: string;
  base_datos?: string;
  codigo_nombre: string;
  codigo: string;
  created_at?: number;
  descripcion: string;
  habilitado: number;
  icono: string;
  ip_servidor?: string;
  modulos: Modulo[];
  nombre: string;
  roles: Rol[];
  titulo: string;
  updated_at?: number;
  url: string;
  version: string;
}

export interface Modulo {
  aplicacion_id: number;
  aplicacion_nombre: string;
  aplicacion: Aplicacion;
  check: boolean;
  created_at?: number;
  habilitado: number;
  icono: string;
  menu: number;
  modulo_id: number;
  modulo_padre?: number | null;
  nombre: string;
  SubModulos: Modulo[];
  titulo: string;
  updated_at?: number;
  url: string;
}

export interface RolAcceso {
  acceso_id: number;
  rol_id: number;
  modulo_id: number;
  nombre: string;
  titulo: string;
  url: string;
}

export interface Componente {
  componente_id: number;
  habilitado: number;
  nombre: string;
}

export interface RolAsignacion {
  rol_asignacion_id: number;
  rol_id: number;
  aplicacion_id: number;
  componente_id: number;
  nombre: string;
  rol: string;
  visible: number;
  habilitado: number;
  editable: number;
}

export interface AuhtUser {
  persona: Persona;
  aplicacion: Aplicacion;
}

export interface MenuItem {
  IdRol: number;
  NombreRol: string;
  IdModulo: number;
  IdModuloPadre?: number;
  TituloModulo: string;
  NombreModulo: string;
  RutaModulo: string;
  Menu: number;
}

export interface BackendResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface Cargo {
  cargo_id: number;
  cargo_nombre: string;
  cargo_superior_nombre?: string;
  created_at: string;
  empresa_id: number;
  empresa_nombre: string;
  superior_id?: number;
  unidad_negocio_id?: number;
  unidad_negocio_nombre: string;
  updated_at: string;
}

export interface PersonaCentroCosto {
  id: number;
  nombre?: string;
  codigo?: number;
  encargado: number;
  persona_id: number;
  centro_costo_id: number;
  created_at: string;
  updated_at: string;
  centro_costos: Centrocostos2;
}

interface Centrocostos2 {
  id: number;
  nombre: string;
  codigo: number;
  unidad_negocio_id: number;
  created_at?: any;
  updated_at?: any;
}
