import React, { useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import apiClient from "../../../../services/api-client";
import { Aplicacion, BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints } from "../../../../models/enums";
import { useForm } from "react-hook-form";

export const CountryList = () => {
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>("");
  const {} = useForm();
  useEffect(() => {
    getAplicaciones();
  }, []);

  const getAplicaciones = async () => {
    const { data } = await apiClient.get<BackendResponse>(
      `/${ApiEndpoints.APLICACIONES}`
    );

    if (!data) {
      console.log("No se pudo completar la operacion");
      return;
    }

    if (!data.success) {
      console.log(data.message);
      return;
    }

    setAplicaciones([...data.data]);
  };

  return (
    <>
      <Typography variant="h4">Aplicaciones</Typography>

      <Autocomplete
        value={
          selectedApp
            ? aplicaciones.find((option) => selectedApp === option.codigo) ??
              null
            : null
        }
        getOptionLabel={(option) => option.codigo}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.codigo} - {option.nombre}
          </Box>
        )}
        onChange={(event: any, newValue) =>
          setSelectedApp(newValue ? newValue.codigo : null)
        }
        options={aplicaciones}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select app"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password",
            }}
          />
        )}
      />
    </>
  );
};
