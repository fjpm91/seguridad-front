import { Close } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
                <Stack
                  sx={{ flexDirection: "row", alignContent: "space-around" }}
                >
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
                <Divider sx={{ mb: 1 }} />
                <List>
                  {!!user &&
                    user.roles.map((rol) => (
                      <ListItem key={rol.rol_id}>
                        <ListItemText
                          primary={rol.aplicacion.nombre + " - " + rol.nombre}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  },
);
