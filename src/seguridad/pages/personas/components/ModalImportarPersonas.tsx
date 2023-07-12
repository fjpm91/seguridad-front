import { Box, Button, Container } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../../../services/api-client";
import { BackendResponse } from "../../../../interfaces/interfaces";
import { ApiEndpoints, Messages } from "../../../../models/enums";

export const ModalImportarPersonas = React.forwardRef((_ref) => {
  const { register, handleSubmit } = useForm();

  const store = async (data: any) => {
    const { file: archivo } = data;
    const formData = new FormData();
    formData.append("uploadFile", archivo[0]);

    try {
      const { data } = await apiClient.post<BackendResponse>(
        `/${ApiEndpoints.IMPORTAR_PERSONAS}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!data) {
        console.log(Messages.NO_SE_PUDO_COMPLETAR);
        return;
      }
      if (!data.success) {
        console.log(data.message);
        return;
      }

      console.log(data.message);
      // setTimeout(() => {
      //   navigate("/empresas");
      // }, 1000);
    } catch (error) {
      console.log("🚀 ~ file: EmpresaForm.tsx:79 ~ store ~ error:", error);
      console.log(JSON.stringify(error));
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Container>
        <Box
          sx={{
            height: "200px",
            backgroundColor: "white",
            p: 4, // 4 * 8
            borderRadius: 2, // 4 * 4
          }}
        >
          <form onSubmit={handleSubmit(store)}>
            {/* <input {...register("uploadFile")} type="file" /> */}
            <input type="file" {...register("file")} />

            <Button variant="contained" type="submit" sx={{ ml: 2 }}>
              Importar
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
});
