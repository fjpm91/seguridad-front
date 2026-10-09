import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import apiClient from "../../../../services/api-client";
import { BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";

interface Props { open: boolean; onClose: () => void; onSuccess: () => void; }

export const ModalImportarUsuarios = ({ open, onClose, onSuccess }: Props) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const reset = () => { setArchivo(null); setError(""); setLoading(false); };
  const close = () => { reset(); onClose(); };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { setArchivo(event.target.files?.[0] || null); setError(""); };
  const importFile = async () => {
    if (!archivo) return;
    const formData = new FormData();
    formData.append("uploadFile", archivo);
    setLoading(true); setError("");
    try {
      const response = await apiClient.post<BackendResponse>(`/${ApiEndpoints.IMPORTAR_USERS_JSON}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data?.success) { setError(response.data?.message || Messages.NO_SE_PUDO_COMPLETAR); return; }
      onSuccess(); reset();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || requestError?.message || Messages.NO_SE_PUDO_COMPLETAR);
    } finally { setLoading(false); }
  };
  return <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
    <DialogTitle sx={{ pb: 1 }}><Typography variant="h5">Importar Usuarios</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Carga un archivo JSON para importar Usuarios.</Typography></DialogTitle>
    <DialogContent dividers><Stack spacing={2}><Paper variant="outlined" sx={{ p: 2 }}><Typography variant="subtitle1" gutterBottom>1. Selecciona el archivo</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Debes seleccionar un archivo JSON generado desde otro ambiente.</Typography><Button component="label" variant="outlined">Seleccionar archivo JSON<input hidden type="file" accept=".json,application/json" onChange={handleFileChange} /></Button>{archivo && <Typography variant="body2" sx={{ mt: 1 }}><strong>Archivo:</strong> {archivo.name}</Typography>}</Paper>{error && <Alert severity="error">{error}</Alert>}</Stack></DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}><Button onClick={close}>Cancelar</Button><Button onClick={() => void importFile()} variant="contained" disabled={!archivo || loading}>{loading && <CircularProgress size={18} sx={{ mr: 1 }} />}Importar</Button></DialogActions>
  </Dialog>;
};
