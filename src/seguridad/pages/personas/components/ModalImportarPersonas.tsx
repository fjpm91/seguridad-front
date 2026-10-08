import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import apiClient from "../../../../services/api-client";
import { BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";

interface Props { open: boolean; onClose: () => void; onSuccess: () => void; }

export const ModalImportarPersonas = ({ open, onClose, onSuccess }: Props) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [format, setFormat] = useState<"excel" | "json">("excel");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setArchivo(null); setFormat("excel"); setError(""); setIsLoading(false); };
  const close = () => { reset(); onClose(); };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { setArchivo(event.target.files?.[0] || null); setError(""); };
  const handleFormatChange = (event: ChangeEvent<HTMLInputElement>) => { setFormat(event.target.value as "excel" | "json"); setArchivo(null); setError(""); };

  const importFile = async () => {
    if (!archivo) return;
    const formData = new FormData();
    formData.append("uploadFile", archivo);
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.post<BackendResponse>(`/${format === "excel" ? ApiEndpoints.IMPORTAR_PERSONAS : ApiEndpoints.IMPORTAR_PERSONAS_JSON}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (!response.data?.success) { setError(response.data?.message || Messages.NO_SE_PUDO_COMPLETAR); return; }
      onSuccess();
      reset();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || requestError?.message || Messages.NO_SE_PUDO_COMPLETAR);
    } finally { setIsLoading(false); }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5">Importar Personas</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Selecciona el formato y carga el archivo de Personas que deseas importar.</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>1. Selecciona el formato</Typography>
            <FormControl>
              <RadioGroup row value={format} onChange={handleFormatChange}>
                <FormControlLabel value="excel" control={<Radio />} label="Excel (.xls, .xlsx)" />
                <FormControlLabel value="json" control={<Radio />} label="JSON (.json)" />
              </RadioGroup>
            </FormControl>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>2. Selecciona el archivo</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{format === "excel" ? "Debes seleccionar un archivo Excel con extensión .xls o .xlsx." : "Debes seleccionar un archivo JSON generado para importar Personas."}</Typography>
            <Button component="label" variant="outlined">
              Seleccionar archivo {format === "excel" ? "Excel" : "JSON"}
              <input hidden type="file" accept={format === "excel" ? ".xls,.xlsx" : ".json,application/json"} onChange={handleFileChange} />
            </Button>
            {archivo && <Typography variant="body2" sx={{ mt: 1 }}><strong>Archivo:</strong> {archivo.name}</Typography>}
          </Paper>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={() => void importFile()} variant="contained" disabled={!archivo || isLoading}>
          {isLoading && <CircularProgress size={18} sx={{ mr: 1 }} />}Importar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
