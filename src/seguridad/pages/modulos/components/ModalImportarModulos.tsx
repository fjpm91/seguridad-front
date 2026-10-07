import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import apiClient from "../../../../services/api-client";
import { ApiEndpoints } from "../../../../models/enums";

interface Props { open: boolean; userId?: number; onClose: () => void; onSuccess: (message: string) => Promise<void>; }
interface ApplicationPreview { nombre?: string | null; codigo?: string | null; titulo?: string | null; }
interface ModulePreview { titulo?: string | null; nombre?: string | null; estado?: "nuevo" | "existente" | string | null; }
interface ParentPreview { nombre?: string | null; titulo?: string | null; url?: string | null; estado?: string | null; coincidencias?: number; }
interface DestinationParent { modulo_id: number; nombre?: string | null; titulo?: string | null; url?: string | null; }
interface ChildGroupPreview { menu_padre?: ParentPreview; padre_destino?: DestinationParent; nombre_base?: string | null; modulos?: ModulePreview[]; }
interface ParentMenu extends DestinationParent { }
interface ParentOverride { grupo: { menu_padre: { nombre?: string | null; url?: string | null }; nombre_base?: string | null }; modulo_padre_id: number; }
interface PreviewTotals { total?: number; nuevos?: number; existentes?: number; }
interface PreviewData { puede_importar?: boolean; aplicacion?: ApplicationPreview; menu?: ModulePreview; modulos?: ModulePreview[]; grupos?: ChildGroupPreview[]; totales?: PreviewTotals; }
interface ImportResult { creados?: number; nuevos?: number; existentes?: number; ya_existian?: number; }

const getResponseData = (response: any): PreviewData => (response?.data?.data ?? response?.data ?? {}) as PreviewData;
const responseData = (response: any) => response?.data?.data ?? response?.data ?? {};
const getResponseMessage = (response: any, fallback: string) => response?.data?.message || response?.message || fallback;
const getStatusLabel = (status?: string | null) => status === "existente" ? "Ya existe" : status === "nuevo" ? "Se creará" : status || "";
const getStatusColor = (status?: string | null) => status === "existente" ? "default" : "success";

const getImportMessage = (response: any) => {
  const result = (response?.data?.resultado || response?.data?.data || {}) as ImportResult;
  const created = result.creados ?? result.nuevos;
  const existing = result.ya_existian ?? result.existentes;
  if (created !== undefined && existing !== undefined) return `Importación completada: ${created} creados, ${existing} ya existían.`;
  if (created !== undefined) return `Importación completada: ${created} creados.`;
  return getResponseMessage(response, "Importación completada correctamente");
};

export const ModalImportarModulos = ({ open, userId, onClose, onSuccess }: Props) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState("");
  const [parentMenus, setParentMenus] = useState<ParentMenu[]>([]);
  const [overrides, setOverrides] = useState<ParentOverride[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  const reset = () => { setArchivo(null); setPreview(null); setError(""); setParentMenus([]); setOverrides([]); setLoadingPreview(false); setLoadingImport(false); setLoadingParents(false); };
  const close = () => { reset(); onClose(); };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPreview(null);
    setError("");
    setParentMenus([]);
    setOverrides([]);
    if (file && !file.name.toLowerCase().endsWith(".json")) {
      setArchivo(null);
      setError("Selecciona únicamente un archivo JSON");
      return;
    }
    setArchivo(file);
  };

  const loadParentMenus = async (codigo: string) => {
    setLoadingParents(true);
    try {
      const response = await apiClient.get(`/${ApiEndpoints.MODULOS_TRANSFERENCIA_GRUPOS}/${codigo}/grupos`);
      const data = responseData(response);
      if (!response.data?.success) throw new Error(response.data?.message || "No se pudieron cargar los menús destino");
      setParentMenus(data.menus || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || requestError.message || "No se pudieron cargar los menús destino");
    } finally { setLoadingParents(false); }
  };

  const previewFile = async (overridesToSend: ParentOverride[] = overrides) => {
    if (!archivo) return;
    const formData = new FormData();
    formData.append("archivo", archivo);
    if (overridesToSend.length) formData.append("overrides", JSON.stringify(overridesToSend));
    setLoadingPreview(true);
    setError("");
    try {
      const response = await apiClient.post(`/${ApiEndpoints.MODULOS_TRANSFERENCIA_PREVISUALIZAR}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      const data = getResponseData(response);
      if (!response.data?.success) {
        setPreview(null);
        setError(getResponseMessage(response, "El archivo no puede importarse"));
        return;
      }
      setError("");
      setPreview(data);
      if (data.grupos?.length && data.aplicacion?.codigo && !parentMenus.length) await loadParentMenus(data.aplicacion.codigo);
    } catch (requestError: any) {
      setError(getResponseMessage(requestError?.response, "No se pudo previsualizar el archivo"));
    } finally { setLoadingPreview(false); }
  };

  const groupKey = (group: ChildGroupPreview) => `${group.menu_padre?.nombre || ""}|${group.menu_padre?.url || ""}|${group.nombre_base || ""}`;

  const changeParent = async (group: ChildGroupPreview, parent: ParentMenu | null) => {
    if (!parent) return;
    const nextOverrides = overrides.filter((override) => overrideKey(override) !== groupKey(group));
    nextOverrides.push({ grupo: { menu_padre: { nombre: group.menu_padre?.nombre, url: group.menu_padre?.url }, nombre_base: group.nombre_base }, modulo_padre_id: parent.modulo_id });
    setOverrides(nextOverrides);
    await previewFile(nextOverrides);
  };

  const overrideKey = (override: ParentOverride) => `${override.grupo.menu_padre.nombre || ""}|${override.grupo.menu_padre.url || ""}|${override.grupo.nombre_base || ""}`;

  const importFile = async () => {
    if (!archivo || !preview) return;
    const formData = new FormData();
    formData.append("archivo", archivo);
    if (overrides.length) formData.append("overrides", JSON.stringify(overrides));
    if (userId !== undefined) formData.append("user", String(userId));
    setLoadingImport(true);
    setError("");
    try {
      const response = await apiClient.post(`/${ApiEndpoints.MODULOS_TRANSFERENCIA_IMPORTAR}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data?.success) {
        setError(getResponseMessage(response, "No se pudo importar el archivo"));
        return;
      }
      await onSuccess(getImportMessage(response));
      reset();
    } catch (requestError: any) {
      setError(getResponseMessage(requestError?.response, "No se pudo importar el archivo"));
    } finally { setLoadingImport(false); }
  };

  const application = preview?.aplicacion;
  const menu = preview?.menu;
  const modules = preview?.modulos || [];
  const childGroups = preview?.grupos || [];
  const isChildrenPreview = childGroups.length > 0;
  const totals = preview?.totales;
  const canImport = preview?.puede_importar === true;
  const allAlreadyExist = totals?.nuevos === 0;
  const hasInvalidParent = childGroups.some((group) => ["no_encontrado", "ambiguo"].includes(group.menu_padre?.estado || ""));
  const hasImportProblem = preview?.puede_importar === false || hasInvalidParent;

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5">Importar módulos</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Carga una configuración exportada para revisar qué módulos se crearán antes de confirmar.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>1. Selecciona el archivo</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Debes seleccionar un archivo JSON generado desde otro ambiente.
            </Typography>
            <Button component="label" variant="outlined">
              Seleccionar archivo JSON
              <input hidden type="file" accept=".json,application/json" onChange={handleFileChange} />
            </Button>
            {archivo && <Typography variant="body2" sx={{ mt: 1 }}><strong>Archivo:</strong> {archivo.name}</Typography>}
          </Paper>

          {error && <Alert severity="error">{error}</Alert>}

          {preview && <>
            <Alert severity={hasImportProblem ? "warning" : "success"}>
              <strong>{hasImportProblem ? "No se puede completar la importación." : "Configuración revisada correctamente."}</strong>{" "}
              {hasImportProblem ? "Revisa los problemas indicados antes de importar." : "Verifica la información antes de importarla."}
            </Alert>

            {application && <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1">Aplicación destino</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>{application.nombre || application.titulo}</Typography>
              {application.codigo && <Typography variant="body2" color="text.secondary">Código: {application.codigo}</Typography>}
              {application.titulo && application.titulo !== application.nombre && <Typography variant="body2" color="text.secondary">Título: {application.titulo}</Typography>}
            </Paper>}

            {!isChildrenPreview && menu && <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1">Menú principal</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>{menu.titulo || menu.nombre}</Typography>
              {menu.titulo && menu.nombre && <Typography variant="body2" color="text.secondary">Nombre interno: {menu.nombre}</Typography>}
              {menu.estado && <Chip label={getStatusLabel(menu.estado)} color={getStatusColor(menu.estado)} size="small" sx={{ mt: 1 }} />}
            </Paper>}

            {isChildrenPreview ? <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Grupos seleccionados</Typography>
              <Stack spacing={2}>
                {childGroups.map((group, index) => {
                  const parent = group.menu_padre;
                  const groupHasNewModules = (group.modulos || []).some((module) => module.estado === "nuevo");
                  return <Box key={`${group.nombre_base || "grupo"}-${index}`}>
                    <Typography variant="subtitle1">{parent?.titulo || parent?.nombre || group.nombre_base}</Typography>
                    {!groupHasNewModules && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Todos los módulos de este grupo ya existen. No se realizarán cambios.
                    </Typography>}
                    {groupHasNewModules && <>
                    <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>Padre:</Typography>
                    <Autocomplete
                      options={parentMenus}
                      value={group.padre_destino ? parentMenus.find((option) => option.modulo_id === group.padre_destino?.modulo_id) || group.padre_destino : null}
                      loading={loadingParents || loadingPreview}
                      disabled={loadingParents || loadingPreview}
                      isOptionEqualToValue={(option, value) => option.modulo_id === value.modulo_id}
                      getOptionLabel={(option) => `${option.titulo || option.nombre || "Menú"}${option.url ? ` — ${option.url}` : ""}`}
                      onChange={(_, value) => void changeParent(group, value)}
                      renderInput={(params) => <TextField {...params} placeholder="Seleccionar padre" size="small" />}
                    />
                    {parent?.estado === "ambiguo" && !group.padre_destino && <Alert severity="warning" sx={{ mt: 1 }}>Se encontraron {parent.coincidencias ?? 0} coincidencias. Selecciona el padre correcto.</Alert>}
                    {parent?.estado === "no_encontrado" && !group.padre_destino && <Alert severity="warning" sx={{ mt: 1 }}>No se encontró el padre indicado en el archivo. Selecciona un menú padre de la aplicación destino.</Alert>}
                    </>}
                    {parent?.estado === "ambiguo" && <Alert severity="warning" sx={{ mt: 1 }}>
                      Se encontraron {parent.coincidencias ?? 0} menús con el nombre "{parent.nombre}" en la aplicación {application?.codigo || "destino"}. No se puede determinar de forma segura el menú padre.
                    </Alert>}
                    {parent?.estado === "no_encontrado" && <Alert severity="error" sx={{ mt: 1 }}>
                      No se encontró el menú padre "{parent.nombre}" en la aplicación {application?.codigo || "destino"}. Los módulos no pueden importarse hasta que exista ese menú en el ambiente destino.
                    </Alert>}
                    <Box sx={{ pl: 2, mt: 1 }}>
                      {(group.modulos || []).map((module, moduleIndex) => <Box key={`${module.nombre || "modulo"}-${moduleIndex}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.5 }}><Box>{module.titulo && <Typography>{module.titulo}</Typography>}{module.nombre && <Typography variant="body2" color="text.secondary">{module.nombre}</Typography>}</Box>{module.estado && <Chip label={getStatusLabel(module.estado)} color={getStatusColor(module.estado)} size="small" />}</Box>)}
                    </Box>
                  </Box>;
                })}
              </Stack>
              {hasInvalidParent && <Alert severity="error" sx={{ mt: 2 }}>
                No se puede importar porque no se pudo determinar de forma segura el menú padre en la aplicación destino.
              </Alert>}
            </Box> : <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Módulos incluidos</Typography>
              <Stack spacing={1}>
                {modules.map((module, index) => <Box key={`${module.nombre || module.titulo || "modulo"}-${index}`} sx={{ py: 1, borderBottom: index < modules.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    <Box>
                      {module.titulo && <Typography variant="body1">{module.titulo}</Typography>}
                      {module.nombre && <Typography variant="body2" color="text.secondary">{module.nombre}</Typography>}
                    </Box>
                    {module.estado && <Chip label={getStatusLabel(module.estado)} color={getStatusColor(module.estado)} size="small" />}
                  </Box>
                </Box>)}
              </Stack>
            </Box>}

            {totals && <Box>
              <Typography variant="subtitle1">Resumen de la importación</Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                <strong>{totals.total ?? 0}</strong> registros en total
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={`${totals.nuevos ?? 0} nuevos`} color="success" size="small" />
                <Chip label={`${totals.existentes ?? 0} existentes`} size="small" />
              </Stack>
            </Box>}

            {allAlreadyExist && <Alert severity="info">Todos los módulos de esta configuración ya existen en la aplicación destino. No es necesario importarlos.</Alert>}
          </>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={() => void previewFile()} disabled={!archivo || loadingPreview || loadingImport}>
          {loadingPreview && <CircularProgress size={18} sx={{ mr: 1 }} />}
          Previsualizar
        </Button>
        <Button onClick={importFile} variant="contained" disabled={!canImport || allAlreadyExist || hasInvalidParent || loadingPreview || loadingImport || loadingParents}>
          {loadingImport && <CircularProgress size={18} sx={{ mr: 1 }} />}
          Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
