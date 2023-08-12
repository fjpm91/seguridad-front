import { useMemo } from "react";
import { RolAcceso, User } from "../../../../interfaces/interfaces";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";
import { Edit } from "@mui/icons-material";
import useAutorizado from "../../../../hooks/useAutorizado";
import { ModulosSistema, TipoAcceso } from "../../../../models/enums";

interface Props {
  accesos: RolAcceso[] | null;
  users: User[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const UsersTable = ({
  accesos,
  users,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const { allowed } = useAutorizado(
    ModulosSistema.USUARIOS + TipoAcceso.UPDATE,
    accesos
  );

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        // size: 100,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        // size: 180,
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
    [users]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={users}
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
            onClick={() => handleHabilitar(row.original.id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.id)}
          >
            <Edit />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
