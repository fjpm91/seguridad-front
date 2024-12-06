import { useMemo } from "react";
import { User } from "../../../../interfaces/interfaces";
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
import { AccountCircle, AccountTree, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Props {
  allowUpdate: boolean;
  users: User[];
  handleOpen: (user_id: number) => void;
  handleHabilitar: (user_id: number) => void;
  handleVerRoles: (usuario: User) => void;
}

export const UsersTable = ({
  allowUpdate,
  users,
  handleHabilitar,
  handleVerRoles,
  handleOpen,
}: Props) => {
  const navigate = useNavigate();
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "name",
        header: "Username",
      },
      {
        accessorFn: (row) =>
          row?.persona
            ? `${row.persona.nombre} ${row.persona.apellido_paterno}`
            : "",
        header: "Persona",
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
      enableRowActions={allowUpdate}
      positionActionsColumn="last"
      initialState={{ density: "compact" }}
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

          {row.original.persona && (
            <IconButton
              onClick={() =>
                navigate(`/personas/${row.original.persona.persona_id}`)
              }
            >
              <AccountCircle color="secondary" />
            </IconButton>
          )}

          {row.original.roles.length > 0 && (
            <IconButton onClick={() => handleVerRoles(row.original)}>
              <AccountTree color="info" />
            </IconButton>
          )}
        </Box>,
      ]}
    />
  );
};
