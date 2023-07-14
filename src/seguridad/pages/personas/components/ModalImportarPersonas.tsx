import { Alert, Box, Button, CircularProgress, Container } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";

export const ModalImportarPersonas = React.forwardRef((_ref) => {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const store = async (data: any) => {
    const { file: archivo } = data;
    const formData = new FormData();
    formData.append("uploadFile", archivo[0]);

    try {
      setIsLoading(true);
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.IMPORTAR_PERSONAS}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      if (!data) {
        console.log(Messages.NO_SE_PUDO_COMPLETAR);
        setErrorMessage(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }
      if (!data.success) {
        console.log(data.message);
        setErrorMessage(data.message);
        return;
      }

      console.log(data.message);
      setMessage(data.message);
      setErrorMessage("");
      // setTimeout(() => {
      //   navigate("/empresas");
      // }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(JSON.stringify(error));
      console.log(JSON.stringify(error));
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Container>
        <Box
          sx={{
            minHeight: "200px",
            backgroundColor: "white",
            p: 4, // 4 * 8
            borderRadius: 2, // 4 * 4
          }}
        >
          <form onSubmit={handleSubmit(store)}>
            {/* <input {...register("uploadFile")} type="file" /> */}
            <input type="file" {...register("file")} />

            <Button variant="contained" type="submit" sx={{ ml: 2 }}>
              {isLoading && <CircularProgress sx={{ mr: 2 }} />}
              Importar
            </Button>
          </form>

          {message && (
            <Alert severity="info" sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
});
