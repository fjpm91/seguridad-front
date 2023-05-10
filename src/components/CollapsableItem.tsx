import React, { useState } from "react";
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
import { AccountCircle, Home } from "@mui/icons-material";
import { Modulo } from "./SideBarList";

interface Props {
  acceso: Modulo;
}

const CollapsableItem = ({ acceso }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {acceso.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText primary={acceso.Nombre} />
        {acceso.SubModulos.length !== 0 ? (
          open ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : null}
      </ListItemButton>
      {acceso.SubModulos.length === 0 ? null : (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {acceso.SubModulos.map((subModulo) => (
              <ListItemButton key={subModulo.id} sx={{ pl: 4 }}>
                <ListItemIcon>
                  {acceso.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={subModulo.Nombre} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CollapsableItem;
