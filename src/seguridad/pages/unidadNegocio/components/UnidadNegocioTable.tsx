import { useMemo } from "react";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { UnidadNegocio } from "../../../../interfaces/interfaces";

interface Props {
  allowUpdate: boolean;
  unidades: UnidadNegocio[];
  filtroEmpresas: string[];
  filtroDivisiones: string[];
  handleOpen: (aplicacion_id: number) => void;
  handleHabilitar: (aplicacion_id: number) => void;
}

export const UnidadNegocioTable = ({
  allowUpdate,
  unidades,
  filtroEmpresas,
  filtroDivisiones,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<UnidadNegocio>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: "Codigo",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorFn: (row) => row.empresa.nombre ?? "",
        header: "Empresa",
        filterVariant: "select",
        filterSelectOptions: filtroEmpresas,
      },
      {
        accessorFn: (row) => (row?.division ? row.division.nombre : ""),
        header: "Division",
        filterVariant: "select",
        filterSelectOptions: filtroDivisiones,
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
              onClick={() => handleOpen(row.original.id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>,
      ]}
    />
  );
};
