export enum StorageKeys {
  ACCESOS = "_accesos",
  APLICACION = "_aplicacion",
  MODULOS = "_modulos",
  PERSONA = "_persona",
  ROL = "_rol",
  USER = "_user",
  USER_TOKEN = "_token",
  LOGGED = "_logged",
}

export enum ModulosSistema {
  ACCESOS = "accesos",
  APLICACIONES = "aplicaciones",
  BITACORA = "bitacora",
  COMPONENTES = "componentes",
  EMPRESA = "empresa",
  MODULOS = "modulos",
  PERSONAS = "personas",
  ROLES = "roles",
  USUARIOS = "usuarios",
}

export enum TipoAcceso {
  INDEX = "_index",
  INSERT = "_insert",
  UPDATE = "_update",
  DELETE = "_delete",
}

export enum ApiEndpoints {
  ACCESOS = "accesos",
  BITACORA = "bitacora",
  COMPONENTES = "componentes",
  APLICACIONES = "aplicaciones",
  EMPRESA = "empresa",
  LOGIN = "aut/login",
  MODULOS = "modulos",
  PERSONAS = "personas",
  ROLES = "roles",
  HABILITAR_ROLES = "roles/habilitar",
  HABILITAR_MODULOS = "modulos/habilitar",
  USUARIOS = "usuarios",
}

export enum Messages {
  NO_SE_PUDO_COMPLETAR = "No se pudo completar la operación"
}