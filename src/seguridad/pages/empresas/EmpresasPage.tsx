import { Box, Container, Typography } from '@mui/material';
import { CountryList } from './components/CountryList';

export const EmpresasPage = () => {
  return (
    <Box sx={{ backgroundColor: "grey.100", height: "100%", padding: "1rem" }}>
      <Container>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Empresas
        </Typography>

        <CountryList />
      </Container>
    </Box>
  );
}
