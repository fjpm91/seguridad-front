import { Box, Container, Typography } from "@mui/material";

export const PersonasPage = () => {
  return (
    <Box sx={{ backgroundColor: "grey.100", height: "100%", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Personas
        </Typography>
      </Container>
    </Box>
  );
}
