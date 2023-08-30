import { useMemo } from "react";
import { Componente } from "../../../../interfaces/interfaces";
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

interface Props {
  allowUpdate: boolean;
  componentes: Componente[];
  handleOpen: (modulo_id: number) => void;
  handleHabilitar: (modulo_id: number) => void;
  handleAsignar: (modulo_id: number) => void;
}

export const ComponentsTable = ({
  allowUpdate,
  componentes,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Componente>[]>(
    () => [
      {
        accessorKey: "componente_id",
        header: "Id",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
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
    [componentes]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={componentes}
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
            onClick={() => handleHabilitar(row.original.componente_id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.componente_id)}
          >
            <Edit />
          </IconButton>

          {/* <IconButton
            color="success"
            onClick={() => handleAsignar(row.original.componente_id)}
          >
            <Settings />
          </IconButton> */}
        </Box>,
      ]}
    />
  );
};
