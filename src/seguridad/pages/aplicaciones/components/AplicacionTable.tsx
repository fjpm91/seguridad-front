import { Edit, Launch } from "@mui/icons-material";
import { useMemo } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { IconoHabilitado } from "../../../../components";
import { Aplicacion } from "../../../../interfaces/interfaces";
import { Link } from "react-router-dom";

interface Props {
  allowUpdate: boolean;
  aplicaciones: Aplicacion[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const AplicacionTable = ({
  allowUpdate,
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
          <Tooltip
            title={row.original.habilitado ? "Deshabilitar" : "Habilitar"}
          >
            <IconButton
              color="warning"
              onClick={() => handleHabilitar(row.original.aplicacion_id)}
            >
              <IconoHabilitado habilitado={row.original.habilitado} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton
              color="primary"
              onClick={() => handleOpen(row.original.aplicacion_id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          {row.original.url && (
            <Link to={row.original.url} target="_blank">
              <IconButton>
                <Launch color="secondary" />
              </IconButton>
            </Link>
          )}
          {/* <Tooltip title="Abrir">
            </Tooltip> */}
        </Box>,
      ]}
    />
  );
};

/**
 *           <Link to={row.original.LINK} target="_blank">
            <RemoveRedEye color="primary" />
          </Link>
 */
