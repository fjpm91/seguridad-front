export interface Empresa {
    empresa_id: number;
    nombre: string;
    habilitado: boolean;
    created_at?: number;
    updated_at?: number;
}

export interface Persona {
    persona_id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    ci: string;
    ci_origen: string;
    ci_extension: string;
    fecha_nacimiento: string;
    correo: string;
    telefono: string;
    empresa: string;
    cargo: string;
    foto: string;
    ubicacion: string;
    habilitado: boolean;
    created_at?: number;
    updated_at?: number;
}

export interface Rol {
    rol_id: number;
    nombre: string;
    habilitado: boolean;
    created_at?: number;
    updated_at?: number;
}

export interface Usuario {
    usuario_id: number;
    persona_id: number;
    rol_id: number;
    habilitado: boolean;
    created_at?: number;
    updated_at?: number;
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
    codigo: string;
    nombre: string;
    titulo: string;
    icono: string;
    url: string;
    descripcion: string;
    area: string;
    base_datos: string;
    ip_servidor: string;
    version: string;
    created_at?: number;
    updated_at?: number;
}

export interface Modulo {
    modulo_id: number;
    aplicacion_id: number;
    modulo_padre: number;
    url: string;
    nombre: string;
    icono: string;
    menu: number;
    created_at?: number;
    updated_at?: number;
}

export interface RolAcceso {
    id: number;
    rolId: number;
    modulod: number;   
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