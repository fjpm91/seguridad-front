import { Typography } from "@mui/material";

interface Props {
  text: string;
}

export const ErrorText = ({ text }: Props) => {
  return (
    <Typography color={"#d32f2f"} paddingTop={1} fontSize={12.5}>
      {text}
    </Typography>
  );
};
