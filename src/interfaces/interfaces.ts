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
  ci_extension?: string;
  ci_origen?: string;
  ci?: string;
  correo?: string;
  created_at?: number;
  empresa_id?: number;
  fecha_nacimiento?: string;
  foto?: string;
  habilitado: number;
  nombre_completo: string;
  nombre?: string;
  persona_id: number;
  telefono?: string;
  ubicacion?: string;
  updated_at?: number;
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

export interface User {
  id: number;
  created_at: number;
  email: string;
  habilitado: number;
  name: string;
  persona_id: number;
  updated_at: number;
  // persona: Persona;
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
  menu: boolean;
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

// export interface AppAuthState {
//     user?: User,
//     aplicacion?: Aplicacion,
//     rol?: Rol,
//     modulos?: Modulo[],
//     token?: string;
// }
