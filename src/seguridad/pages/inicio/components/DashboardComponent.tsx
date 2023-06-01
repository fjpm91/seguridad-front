import { MenuRounded, ShoppingBag } from "@mui/icons-material";
import { Box, Grid, Paper, Typography } from "@mui/material";

export const DashboardComponent = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper
          sx={{
            backgroundColor: "#673ab7",
            color: "white",
            height: "180px",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                backgroundColor: "#7d3cf0",
                color: "white",
              }}
            >
              <ShoppingBag />
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                backgroundColor: "#7d3cf0",
                color: "white",
              }}
            >
              <MenuRounded />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mt: 1, color: "white", fontSize: "1.5rem" }}>
              $500.00
            </Typography>
            <p style={{ marginTop: 0, color: "gray" }}>Total earnings</p>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={4}>
        <Paper
          sx={{
            backgroundColor: "#3503fc",
            color: "white",
            height: "180px",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                backgroundColor: "#2d06c9",
                color: "white",
              }}
            >
              <ShoppingBag />
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: "8px",
                backgroundColor: "#2d06c9",
                color: "white",
              }}
            >
              <MenuRounded />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mt: 1, color: "white", fontSize: "1.5rem" }}>
              $500.00
            </Typography>
            <p style={{ marginTop: 0, color: "gray" }}>Total earnings</p>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
