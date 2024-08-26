import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

export const TabPanel = ({
  children,
  index,
  sx,
  value,
  ...other
}: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`panel-${index}`}
      {...other}
    >
      {value === index && <Box sx={sx}>{children}</Box>}
    </div>
  );
};
