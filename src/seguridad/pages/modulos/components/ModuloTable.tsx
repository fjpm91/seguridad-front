import { useMemo } from "react";
import { Modulo } from "../../../../interfaces/interfaces";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Edit } from "@mui/icons-material";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";

interface Props {
  allowUpdate: boolean;
  modulos: Modulo[];
  filtroAplicaciones: string[];
  handleOpen: (modulo_id: number) => void;
  handleHabilitar: (modulo_id: number) => void;
  handleExportar: (modulo: Modulo) => void;
}

export const ModuloTable = ({
  allowUpdate,
  modulos,
  filtroAplicaciones,
  handleHabilitar,
  handleOpen,
  handleExportar,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<Modulo>[]>(
    () => [
      {
        accessorKey: "titulo",
        header: "Título",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "aplicacion.codigo",
        header: "Aplicación",
        filterVariant: "select",
        filterSelectOptions: filtroAplicaciones,
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
      {
        accessorKey: "menu",
        header: "Menu",
        enableColumnActions: false,
        // enableColumnFilter: false,
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
    [filtroAplicaciones]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={modulos}
      localization={MRT_Localization_ES}
      enableRowActions={true}
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
          {allowUpdate && (
            <>
              <Tooltip title={row.original.habilitado ? "Deshabilitar" : "Habilitar"}>
                <IconButton
                  color="warning"
                  onClick={() => handleHabilitar(row.original.modulo_id)}
                >
                  <IconoHabilitado habilitado={row.original.habilitado} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton
                  color="primary"
                  onClick={() => handleOpen(row.original.modulo_id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </>
          )}
          {!!row.original.menu && (
            <Tooltip title="Exportar módulos">
              <IconButton
                color="secondary"
                onClick={() => handleExportar(row.original)}
              >
                <Download />
              </IconButton>
            </Tooltip>
          )}
        </Box>,
      ]}
    />
  );
};
