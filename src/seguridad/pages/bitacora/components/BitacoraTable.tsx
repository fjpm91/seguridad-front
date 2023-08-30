import { useMemo } from "react";
import { Bitacora, RolAcceso } from "../../../../interfaces/interfaces";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

interface Props {
  accesos: RolAcceso[] | null;
  bitacoras: Bitacora[];
}

export const BitacoraTable = ({ bitacoras }: Props) => {
  const columns = useMemo<MRT_ColumnDef<Bitacora>[]>(
    () => [
      {
        accessorKey: "bitacora_id",
        header: "Id",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "nombre_completo",
        header: "Usuario",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "operacion",
        header: "Operacion",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "tabla",
        header: "Tabla",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "tabla_identificador",
        header: "Id Tabla",
        // enableColumnFilter: false,
      },
      {
        accessorKey: "fecha",
        header: "Fecha",
        // enableColumnFilter: false,
      },
    ],
    [bitacoras]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={bitacoras}
      defaultColumn={{
        size: 50,
      }}
      localization={MRT_Localization_ES}
    />
  );
};
