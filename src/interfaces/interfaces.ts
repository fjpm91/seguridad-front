export interface Empresa {
    empresa_id: number;
    nombre: string;
    habilitado: boolean;
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
    habilitado?: boolean;
    nombre_completo?: string;
    nombre?: string;
    persona_id?: number;
    telefono?: string;
    ubicacion?: string;
    updated_at?: number;
}

export interface Rol {
    rol_id: number;
    aplicacion_id: number;
    nombre: string;
    habilitado: boolean;
    created_at?: number;
    updated_at?: number;
}

export interface User {
    id: number;
    created_at: number;
    email: string;
    habilitado: boolean;
    name: string;
    persona_id: number;
    updated_at: number;
    // persona: Persona;
}

export interface Operacion {
    operacion_id: number;
    nombre: string;
    created_at?: number;
    updated_at?: number;
}

export interface Bitacora {
    id: number;
    usuarioId: number;
    operacionId: number;
    tabla: string;
    tablaId: number;
    fecha: Date;
    // habilitado: boolean;
}

export interface Aplicacion {
    aplicacion_id: number;
    area?: string;
    base_datos?: string;
    codigo: string;
    created_at?: number;
    descripcion: string;
    habilitado: number;
    icono: string;
    ip_servidor?: string;
    nombre: string;
    titulo: string;
    updated_at?: number;
    url: string;
    version: string;
}

export interface Modulo {
    aplicacion_id: number;
    created_at?: number;
    icono: string;
    menu: boolean;
    modulo_id: number;
    modulo_padre?: number | null;
    nombre: string;
    SubModulos?: Modulo[] | null
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
    id: number;
    nombre: string;
}

export interface RolAsignacion {
    id: number;
    rolId: number;
    aplicacionId: number;
    componenteId: number;
    nombre: string;
    visible: boolean;
    habilitado: boolean;
    editable: boolean;
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