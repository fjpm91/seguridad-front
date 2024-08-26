import React, { useState } from "react";
import { FormBoxContainer, TabPanel } from "../../../../components";
import { Box, Tab, Tabs } from "@mui/material";
import { CardBackground, tabPanelStyles } from "../../../../models/constants";
import { UsuarioRolForm } from "../../usuarioRol";
import { RolForm } from "./RolForm";

interface Props {
  setOpen: (open: boolean) => void;
  setToastMessage: (toastMessage: string) => void;
}

export const RolFormPage = ({ setOpen, setToastMessage }: Props) => {
  const [tabValue, setTabvalue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabvalue(newValue);
  };

  const allProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <FormBoxContainer>
      <Box sx={CardBackground}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label="Rol" {...allProps(0)} />
          <Tab label="Asignar Usuario Rol" {...allProps(1)} />
        </Tabs>

        <TabPanel value={tabValue} index={0} sx={tabPanelStyles}>
          <RolForm setOpen={setOpen} setToastMessage={setToastMessage} />
        </TabPanel>
        <TabPanel value={tabValue} index={1} sx={tabPanelStyles}>
          <UsuarioRolForm setOpen={setOpen} setToastMessage={setToastMessage} />
        </TabPanel>
      </Box>
    </FormBoxContainer>
  );
};
