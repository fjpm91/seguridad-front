import { Box } from "@mui/material";
import { DashboardComponent } from "./components";

export const InicioPage = () => {
  return (
    <Box sx={{ backgroundColor: "grey.100", height: "100vh", padding: "1rem" }}>
      <DashboardComponent />
    </Box>
  );
};
