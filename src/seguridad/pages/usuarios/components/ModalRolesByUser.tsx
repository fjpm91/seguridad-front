import { Close } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import React from "react";
import { PageTitle } from "../../../../components";
import { User } from "../../../../interfaces/interfaces";

interface Props {
  user: User | null;
  handleCloseModal: () => void;
}

export const ModalRolesByUser = React.forwardRef(
  ({ user, handleCloseModal }: Props, _ref) => {
    const roles = user?.roles ?? [];
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
            <Grid container justifyContent="center">
              {/* Roles del Usuario*/}
              <Grid item xs={12} sm={10} md={8} sx={{ p: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <PageTitle
                    variant="h5"
                    title={"Roles del usuario " + user?.name}
                  />
                  <Tooltip title="Cerrar">
                    <IconButton onClick={() => handleCloseModal()}>
                      <Close />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  {!roles.length ? (
                    <Typography color="text.secondary" sx={{ p: 2 }}>Este usuario no tiene roles asignados.</Typography>
                  ) : (
                    <Box sx={{ maxHeight: "55vh", overflowY: "auto", px: 2 }}>
                      <List disablePadding>
                        {roles.map((rol) => (
                          <ListItem key={rol.rol_id} divider sx={{ py: 0.75, px: 0 }}>
                            <ListItemText
                              primary={rol.nombre}
                              secondary={<Box component="span" sx={{ display: "block", pl: 1.5 }}>└─ {rol.aplicacion.nombre}</Box>}
                              primaryTypographyProps={{ variant: "body1" }}
                              secondaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  },
);
