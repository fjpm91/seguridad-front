import { Box } from "@mui/material";

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const PageBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "grey.100",
        minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
        pt: { xs: "64px", md: "72px" },
        px: { md: 2 },
      }}
    >
      {children}
    </Box>
  );
};
