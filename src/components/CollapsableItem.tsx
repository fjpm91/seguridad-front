import { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Modulo } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";
// import { Modulo } from "./SideBarList";

interface Props {
  modulo: Modulo | null;
}

const CollapsableItem = ({ modulo }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event?: Modulo | undefined | null) => {
    if (!event) return;
    event.menu && event?.SubModulos?.length !== 0 ? setOpen(!open) : navigate(event?.url ?? "/");
  };

  return (
    <>
      <ListItemButton onClick={() => handleClick(modulo)}>
        <ListItemIcon>
          <MailIcon />
        </ListItemIcon>
        <ListItemText primary={modulo?.titulo} />
        {!!modulo?.SubModulos && modulo.SubModulos.length !== 0 ? (
          open ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : null}
      </ListItemButton>
      {!!modulo?.SubModulos && modulo.SubModulos.length === 0 ? null : (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {modulo?.SubModulos?.map((subModulo) => (
              <ListItemButton
                key={subModulo.modulo_id}
                sx={{ pl: 4 }}
                onClick={() => handleClick(subModulo)}
              >
                <ListItemIcon>
                  {modulo.modulo_id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={subModulo.titulo} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CollapsableItem;
