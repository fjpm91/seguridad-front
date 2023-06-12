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

// Los nombres de los modulos deben ir en plural
export enum ModulosSistema {
  ACCESOS = "accesos",
  APLICACIONES = "aplicaciones",
  BITACORA = "bitacora",
  COMPONENTES = "componentes",
  EMPRESA = "empresas",
  MODULOS = "modulos",
  PERSONAS = "personas",
  ROLES = "roles",
  USUARIOS = "users",
}

export enum TipoAcceso {
  INDEX = "_index",
  INSERT = "_insert",
  UPDATE = "_update",
  DELETE = "_delete",
}

export enum ApiEndpoints {
  ACCESOS = "accesos",
  APLICACIONES = "aplicaciones",
  BITACORA = "bitacora",
  COMPONENTES = "componentes",
  EMPRESAS = "empresas",
  HABILITAR_EMPRESAS = "empresas/habilitar",
  HABILITAR_MODULOS = "modulos/habilitar",
  HABILITAR_ROLES = "roles/habilitar",
  HABILITAR_USERS = "users/habilitar",
  LOGIN = "aut/login",
  MODULOS = "modulos",
  PERSONAS = "personas",
  ROLES = "roles",
  USERS = "users",
}

export enum Messages {
  NO_SE_PUDO_COMPLETAR = "No se pudo completar la operación"
}