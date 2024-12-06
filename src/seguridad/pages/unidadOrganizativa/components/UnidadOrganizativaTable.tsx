import { useMemo } from "react";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { UnidadOrganizativa } from "../../../../interfaces/interfaces";

interface Props {
  allowUpdate: boolean;
  unidades: UnidadOrganizativa[];
  filtroDivisiones: string[];
  handleOpen: (model_id: number) => void;
}

export const UnidadOrganizativaTable = ({
  allowUpdate,
  unidades,
  filtroDivisiones,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<UnidadOrganizativa>[]>(
    () => [
      {
        accessorKey: "unidad_organizativa_id",
        header: "Id",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "descripcion",
        header: "Descripcion",
      },
      {
        accessorKey: "division_nombre",
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
              onClick={() => handleOpen(row.original.unidad_organizativa_id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>,
      ]}
    />
  );
};
