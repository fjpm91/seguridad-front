import { useMemo } from "react";
import useAutorizado from "../../../../hooks/useAutorizado";
import { ModulosSistema, TipoAcceso } from "../../../../models/enums";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { RolAcceso, RolAsignacion } from "../../../../interfaces/interfaces";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from "@mui/material";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";
import { Delete, Edit } from "@mui/icons-material";

interface Props {
  accesos: RolAcceso[] | null;
  rolAsignaciones: RolAsignacion[];
  handleOpen: (rol_asignacion_id: number) => void;
  handleHabilitar: (rol_asignacion_id: number) => void;
  handleEliminar: (rol_asignacion_id: number) => void;
}

export const RolAsignacionTable = ({
  accesos,
  rolAsignaciones,
  handleHabilitar,
  handleOpen,
  handleEliminar,
}: Props) => {
  const { allowed } = useAutorizado(
    ModulosSistema.ROL_ASIGNACION + TipoAcceso.UPDATE,
    accesos
  );

  const columns = useMemo<MRT_ColumnDef<RolAsignacion>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "rol",
        header: "Rol",
      },
      {
        accessorKey: "visible",
        header: "Visible",
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
      {
        accessorKey: "editable",
        header: "Editable",
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
    [rolAsignaciones]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={rolAsignaciones}
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
            onClick={() => handleHabilitar(row.original.rol_asignacion_id)}
          >
            <IconoHabilitado habilitado={row.original.habilitado} />
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.rol_asignacion_id)}
          >
            <Edit />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => handleEliminar(row.original.rol_asignacion_id)}
          >
            <Delete />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
