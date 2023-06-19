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
  BITACORA = "bitacoras",
  COMPONENTES = "componentes",
  EMPRESAS = "empresas",
  HABILITAR_EMPRESAS = "empresas/habilitar",
  HABILITAR_MODULOS = "modulos/habilitar",
  HABILITAR_ROLES = "roles/habilitar",
  HABILITAR_USERS = "users/habilitar",
  LOGIN = "aut/login",
  MODULOS = "modulos",
  MODULOS_BY_APP = "modulos/app",
  PERSONAS = "personas",
  ROLES = "roles",
  ROLES_ACCESOS = "roles/accesos",
  USERS = "users",
  USUARIO_ROL = "usuario-rol",
}

export enum Messages {
  NO_SE_PUDO_COMPLETAR = "No se pudo completar la operación"
}

// export enum IconNames {
//   Add = 'Add',
//   AddCircle = 'AddCircle',
//   AddPhoto = 'AddPhotoAlternateIcon',
//   Android = 'Android',
//   Apple = 'Apple',
//   Apps = 'Apps',
//   Archive = 'Archive',
//   AttachFile = 'AttachFile',
//   Backup = 'Backup',
//   Block = 'Block',
//   Bolt = 'Bolt',
//   Bookmark = 'Bookmark',
//   Build = 'Build',
//   Business = 'Business',
//   CalendarMonthIcon = 'CalendarMonthIcon',
//   Call = 'Call',
//   CameraAlt = 'CameraAlt',
//   Check = 'Check',
//   CLOCK = 'AccessTime',
//   Close = 'Close',
//   Coffee = 'Coffee',
//   Computer = 'Computer',
//   ContentCopy = 'ContentCopy',
//   ContentCut = 'ContentCut',
//   ContentPaste = 'ContentPaste',
//   Home = 'Home',
//   Man = 'Accessibility',
//   PeopleAlt = 'PeopleAlt',
//   Extension = 'Extension',
//   Wallet = 'AccountBalanceWalletIcon',
// }