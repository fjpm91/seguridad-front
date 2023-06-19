import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Rol, RolAcceso } from "../../../../interfaces/interfaces";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";
import { Edit, Https } from "@mui/icons-material";

interface Props {
  accesos: RolAcceso[] | null;
  roles: Rol[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
  handleNavegarPermisos: (rol_id: number) => void;
}

export const RolTable = ({
  accesos,
  roles,
  handleHabilitar,
  handleOpen,
  handleNavegarPermisos,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Rol>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "aplicacion.codigo",
        header: "Aplicacion",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "habilitado",
        header: "Habilitado",
        enableColumnActions: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cell.getValue<number>() === 1 ? true : false}
                  disabled
                />
              }
              label=""
            />
          </FormGroup>
        ),
      },
    ],
    [roles]
  );
  return (
    <MaterialReactTable
      columns={columns}
      data={roles}
      localization={MRT_Localization_ES}
      enableRowActions
      positionActionsColumn="last"
      renderRowActions={({ row }) => [
        <Box
          sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
          key={row.id}
        >
          <IconButton
            color="warning"
            onClick={() => handleHabilitar(row.original.rol_id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.rol_id)}
          >
            <Edit />
          </IconButton>
          {/* <IconButton
            color="primary"
            onClick={() => handleNavegarPermisos(row.original.rol_id)}
          >
            <Https />
          </IconButton> */}
        </Box>,
      ]}
    />
  );
};
