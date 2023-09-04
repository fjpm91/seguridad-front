import { useMemo } from "react";
import { Persona } from "../../../../interfaces/interfaces";
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
  personas: Persona[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const PersonasTable = ({
  allowUpdate,
  personas,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Persona>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: "Codigo",
      },
      {
        accessorKey: "nombre_completo",
        header: "Nombre",
      },
      {
        accessorKey: "cargo",
        header: "Cargo",
      },
      {
        accessorFn: (row) => (row?.empresa ? row.empresa.nombre : ""),
        header: "Empresa",
        filterVariant: "select",
        filterSelectOptions: ["Empacar", "Italsa"],
      },
      {
        accessorFn: (row) => (row?.user ? row.user.name : ""),
        header: "Usuario",
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
    [personas]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={personas}
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
            onClick={() => handleHabilitar(row.original.persona_id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.persona_id)}
          >
            <Edit />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
