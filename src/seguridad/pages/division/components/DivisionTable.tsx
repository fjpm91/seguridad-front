import { useMemo } from "react";
import { Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import useAutorizado from "../../../../hooks/useAutorizado";
import { Division, RolAcceso } from "../../../../interfaces/interfaces";
import { ModulosSistema, TipoAcceso } from "../../../../models/enums";

interface Props {
  accesos: RolAcceso[] | null;
  divisiones: Division[];
  handleOpen: (aplicacion_id: number) => void;
}

export const DivisionTable = ({ accesos, divisiones, handleOpen }: Props) => {
  const { allowed } = useAutorizado(
    ModulosSistema.DIVISIONES + TipoAcceso.UPDATE,
    accesos
  );

  const columns = useMemo<MRT_ColumnDef<Division>[]>(
    () => [
      {
        accessorKey: "division_id",
        header: "Id",
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
    ],
    [divisiones]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={divisiones}
      localization={MRT_Localization_ES}
      enableRowActions={allowed}
      positionActionsColumn="last"
      defaultColumn={{
        size: 50,
      }}
      renderRowActions={({ row }) => [
        <Box
          sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
          key={row.id}
        >
          <IconButton
            color="primary"
            onClick={() => handleOpen(row.original.division_id)}
          >
            <Edit />
          </IconButton>
        </Box>,
      ]}
    />
  );
};
