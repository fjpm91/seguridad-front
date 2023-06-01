import { Edit, Done, Close } from "@mui/icons-material";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
} from "@mui/material";
import { Aplicacion, RolAcceso } from "../../../../interfaces/interfaces";
import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

interface Props {
  accesos: RolAcceso[] | null;
  aplicaciones: Aplicacion[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

interface IconoProps {
  habilitado: number;
}

const Icono = ({ habilitado }: IconoProps) => {
  return habilitado === 1 ? <Close /> : <Done />;
};

export const AplicacionTable = ({
  accesos,
  aplicaciones,
  handleHabilitar,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Aplicacion>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: "Codigo",
        // size: 100,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        // size: 180,
      },
      {
        accessorKey: "version",
        header: "Version",
        enableColumnFilter: false,
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
    [aplicaciones]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={aplicaciones}
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
            onClick={() => handleHabilitar(row.original.aplicacion_id)}
          >
            <Icono habilitado={row.original.habilitado} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.aplicacion_id)}
          >
            <Edit />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
