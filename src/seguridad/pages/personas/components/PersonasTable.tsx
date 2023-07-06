import { useMemo } from "react";
import { Persona, RolAcceso } from "../../../../interfaces/interfaces";
import useAutorizado from "../../../../hooks/useAutorizado";
import { ModulosSistema, TipoAcceso } from "../../../../models/enums";
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
  accesos: RolAcceso[] | null;
  personas: Persona[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const PersonasTable = ({
  accesos,
  personas,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const { allowed } = useAutorizado(
    ModulosSistema.PERSONAS + TipoAcceso.UPDATE,
    accesos
  );

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
      enableRowActions={allowed}
      positionActionsColumn="last"
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
