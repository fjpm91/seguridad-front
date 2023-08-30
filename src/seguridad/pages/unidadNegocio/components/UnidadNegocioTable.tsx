import { useMemo } from "react";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { UnidadNegocio } from "../../../../interfaces/interfaces";

interface Props {
  allowUpdate: boolean;
  unidades: UnidadNegocio[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const UnidadNegocioTable = ({
  allowUpdate,
  unidades,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<UnidadNegocio>[]>(
    () => [
      {
        accessorKey: "unidad_negocio_id",
        header: "Codigo",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "empresa.nombre",
        header: "Empresa",
      },
      {
        accessorFn: (row) => (row?.division ? row.division.nombre : ""),
        header: "Division",
      },
    ],
    [unidades]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={unidades}
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
          <Tooltip title="Editar">
            <IconButton
              color="primary"
              onClick={() => handleOpen(row.original.unidad_negocio_id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>,
      ]}
    />
  );
};
