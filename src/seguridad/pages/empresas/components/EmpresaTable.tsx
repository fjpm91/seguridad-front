import { useMemo } from "react";
import { Empresa } from "../../../../interfaces/interfaces";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";

interface Props {
  allowUpdate: boolean;
  empresas: Empresa[];
  handleOpen: (modulo_id: number) => void;
  handleHabilitar: (modulo_id: number) => void;
}

export const EmpresaTable = ({
  allowUpdate,
  empresas,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Empresa>[]>(
    () => [
      {
        accessorKey: "empresa_id",
        header: "Id",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
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
    [empresas]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={empresas}
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
            onClick={() => handleHabilitar(row.original.empresa_id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.empresa_id)}
          >
            <Edit />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
