import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Modulo } from "../interfaces/interfaces";
import { DynamicMenuIcon } from ".";

interface Props {
  modulo: Modulo | null;
  onCloseSideBar: () => void;
}

const CollapsableItem = ({ modulo, onCloseSideBar }: Props) => {
  const [foldItem, setFoldItem] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event?: Modulo | undefined | null) => {
    if (!event) return;
    if (event.menu && event?.SubModulos?.length !== 0) {
      setFoldItem(!foldItem);
    } else {
      navigate(event?.url ?? "/");
      onCloseSideBar();
    }
  };

  return (
    <>
      <ListItemButton onClick={() => handleClick(modulo)}>
        <ListItemIcon>
          <DynamicMenuIcon icon={modulo?.icono ? modulo?.icono : "Home"} />
        </ListItemIcon>
        <ListItemText primary={modulo?.titulo} />
        {!!modulo?.SubModulos && modulo.SubModulos.length !== 0 ? (
          foldItem ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : null}
      </ListItemButton>
      {!!modulo?.SubModulos && modulo.SubModulos.length === 0 ? null : (
        <Collapse in={foldItem} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {modulo?.SubModulos?.map((subModulo) => (
              <ListItemButton
                key={subModulo.modulo_id}
                sx={{ pl: 4 }}
                onClick={() => handleClick(subModulo)}
              >
                <ListItemIcon>
                  <DynamicMenuIcon
                    icon={modulo?.icono ? modulo?.icono : "Home"}
                  />
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
