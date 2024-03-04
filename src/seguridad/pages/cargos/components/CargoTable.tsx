import { Edit } from "@mui/icons-material";
import { useMemo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Cargo } from "../../../../interfaces/interfaces";

interface Props {
  allowUpdate: boolean;
  cargos: Cargo[];
  handleOpen: (cargo_id: number) => void;
}

export const CargoTable = ({ allowUpdate, cargos, handleOpen }: Props) => {
  const columns = useMemo<MRT_ColumnDef<Cargo>[]>(
    () => [
      {
        accessorKey: "cargo_id",
        header: "Id",
        // size: 100,
      },
      {
        accessorKey: "cargo_nombre",
        header: "Nombre",
        // size: 180,
      },
      {
        accessorKey: "unidad_negocio_id",
        header: "#UN",
      },
      {
        accessorKey: "unidad_negocio_nombre",
        header: "UN",
      },
      {
        accessorKey: "empresa_nombre",
        header: "Empresa",
      },
      // {
      //   accessorKey: "habilitado",
      //   header: "Habilitado",
      //   enableColumnActions: false,
      //   enableColumnFilter: false,
      //   Cell: ({ cell }) => (
      //     <FormGroup>
      //       <FormControlLabel
      //         control={
      //           <Checkbox
      //             checked={cell.getValue<number>() === 1 ? true : false}
      //             disabled
      //           />
      //         }
      //         label=""
      //       />
      //     </FormGroup>
      //   ),
      // },
    ],
    [cargos]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={cargos}
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
              onClick={() => handleOpen(row.original.cargo_id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>,
      ]}
    />
  );
};
