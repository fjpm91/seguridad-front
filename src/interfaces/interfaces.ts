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
  cargos_id?: number;
  cargos?: any;
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
  division_id?: number;
  empresa_id?: number;
  empresa: Empresa;
  fecha_nacimiento?: string;
  foto?: string;
  habilitado: number;
  nombre_completo: string;
  nombre?: string;
  persona_centros_costos?: PCC[];
  persona_id: number;
  telefono?: string;
  ubicacion?: string;
  unidad_negocio_id: number;
  unidad_organizativa_id?: number;
  updated_at?: number;
  user: any;
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
  users: any[];
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
  empresa_id?: number;
  empresa_nombre?: string;
  unidades_negocio: UnidadNegocio[];
}

export interface User {
  created_at: number;
  email: string;
  habilitado: number;
  id: number;
  name: string;
  persona_id: number;
  updated_at: number;
  user_sai: string;
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
  aplicacion_id: number;
  componente_id: number;
  aplicacion_codigo: string;
  formulario: string;
  habilitado: number;
  nombre: string;
  ruta: string;
}

export interface ComponenteForm extends Componente {
  habilitadoForm: boolean;
}

export interface RolAsignacion {
  aplicacion_id: number;
  codigo_app: string | null;
  componente_id: number;
  editable: number;
  formulario: string | null;
  habilitado: number;
  nombre: string;
  nombre_componente: string;
  rol_asignacion_id: number;
  rol_id: number;
  rol: string;
  visible: number;
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

export interface BackendResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Cargo {
  cargo_competencias?: string;
  cargo_descripcion?: string;
  cargo_id: number;
  cargo_nombre: string;
  cargo_salario: number;
  cargo_superior_nombre?: string;
  division_id?: number;
  empresa_id: number;
  empresa_nombre: string;
  monto_maximo_salario: number;
  monto_minimo_salario: number;
  superior_id?: number;
  total_vacantes: number;
  unidad_negocio_codigo: number;
  unidad_negocio_id: number;
  unidad_negocio_nombre: string;
  unidad_organizativa_id?: number;
  unidad_organizativa_nombre?: string;
  vacantes_ocupadas: number;
}

export interface PersonaCentroCosto {
  centro_costo_id: number;
  codigo?: number;
  created_at: string;
  encargado: number;
  id: number;
  nombre?: string;
  persona_id: number;
  updated_at: string;
}

export interface PCC {
  id: number;
  cc_id: number;
  cc_codigo: number;
  cc_nombre: string;
  cc_encargado: number;
  persona_id: number;
  persona_nombre: string;
}

export interface UnidadOrganizativa {
  descripcion: string;
  division_id?: number;
  division_nombre: string;
  empresa_id?: number;
  empresa_nombre?: string;
  nombre: string;
  unidad_organizativa_id: number;
}

export interface UsuarioRol {
  aplicacion_id: number;
  rol_id: number;
  rol?: any;
  user_id: number;
  usuario_rol_id: number;
  usuario?: any;
}
