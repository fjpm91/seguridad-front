import { Delete, Edit } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

interface Props {
  headers: string[];
  items: any[];
  canEdit: string;
  handleOpen: (itemid: number) => void;
  handleDelete?: (itemid: number) => void;
}

export const BasicTable = ({
  headers,
  items,
  handleOpen,
  canEdit,
  handleDelete,
}: Props) => {
  const keys =
    !items || items.length === 0
      ? []
      : Object.keys(items[0]).map((key) => {
          return key;
        });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              {keys.map((key) => (
                <TableCell key={`${item.id}` + key}>
                  {item[key] ?? "----"}
                </TableCell>
              ))}
              <TableCell>
                {!item[canEdit] ? (
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(item.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                ) : (
                  "----"
                )}
                {!item[canEdit] && handleDelete ? (
                  <Tooltip title="Eliminar">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
