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
import { Edit } from "@mui/icons-material";
import useAutorizado from "../../../../hooks/useAutorizado";
import { ModulosSistema, TipoAcceso } from "../../../../models/enums";

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
}: Props) => {
  const { allowed } = useAutorizado(
    ModulosSistema.ROLES + TipoAcceso.UPDATE,
    accesos
  );

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
      enableRowActions={allowed}
      positionActionsColumn="last"
      defaultColumn={{
        size: 50,
      }}
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
        </Box>,
      ]}
    />
  );
};
