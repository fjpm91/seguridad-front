import { useMemo } from "react";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Edit } from "@mui/icons-material";
import { CentroCosto } from "../../../../interfaces/interfaces";

interface Props {
  allowUpdate: boolean;
  centros: CentroCosto[];
  handleOpen: (persona_id: number) => void;
}

export const CentrosCostoTable = ({
  allowUpdate,
  centros,
  handleOpen,
}: Props) => {
  const columns = useMemo<MRT_ColumnDef<CentroCosto>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "codigo",
        header: "Codigo",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "unidad_negocio_id",
        header: "UN",
      },
      // {
      //   accessorFn: (row) => (row?.empresa ? row.empresa.nombre : ""),
      //   header: "Empresa",
      //   filterVariant: "select",
      //   filterSelectOptions: ["Empacar", "Italsa"],
      // },
    ],
    [centros]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={centros}
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
          {/* <Tooltip
            title={`${row.original.habilitado ? "Inhabilitar" : "Habilitar"}`}
          >
            <IconButton
              color="warning"
              onClick={() => handleHabilitar(row.original.persona_id)}
            >
              <IconoHabilitado habilitado={row.original.habilitado} />
            </IconButton>
          </Tooltip> */}

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
