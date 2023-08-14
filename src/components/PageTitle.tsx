import { Typography, Divider } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

interface Props {
  title: string;
  variant?: Variant;
}
export const PageTitle = ({ title, variant }: Props) => {
  return (
    <>
      <Typography
        variant={variant ? variant : "h4"}
        component="div"
        sx={{ flexGrow: 1 }}
      >
        {title}
      </Typography>
      <Divider />
    </>
  );
};
