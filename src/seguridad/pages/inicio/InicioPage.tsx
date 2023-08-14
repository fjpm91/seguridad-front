import { Box, Container, Typography } from "@mui/material";
// import { DashboardComponent } from "./components";
import { PageBox } from "../../../components";

export const InicioPage = () => {
  return (
    // <DashboardComponent />
    <PageBox>
      <Container>
        <Box
          sx={{
            backgroundColor: "white",
            minHeight: "400px",
            padding: "1rem",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ mt: 1, fontSize: "1.5rem" }}>
            Bienvenido al {import.meta.env.VITE_NOMBRE_APP}
          </Typography>
        </Box>
      </Container>
    </PageBox>
  );
};
