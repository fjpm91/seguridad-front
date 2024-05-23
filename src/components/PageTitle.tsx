import { Typography, Divider } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

interface Props {
  title: string;
  variant?: Variant;
  divider?: boolean;
}
export const PageTitle = ({ title, variant, divider }: Props) => {
  return (
    <>
      <Typography
        variant={variant ? variant : "h4"}
        component="div"
        sx={{ flexGrow: 1 }}
      >
        {title}
      </Typography>
      {divider && <Divider sx={{ mb: 2 }} />}
    </>
  );
};
