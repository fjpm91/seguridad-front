import { Box, Container } from "@mui/material";

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const FormBoxContainer = ({ children }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
        pt: { xs: "64px", md: "84px" },
        px: { xs: 1, md: 2 },
      }}
    >
      <Container sx={{ p: 0 }}>{children}</Container>
    </Box>
  );
};
