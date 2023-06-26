import { Box } from "@mui/material";
import { DashboardComponent } from "./components";

export const InicioPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        minHeight: "calc(100vh - 64px)",
        padding: "1rem",
      }}
    >
      <DashboardComponent />
    </Box>
  );
};
