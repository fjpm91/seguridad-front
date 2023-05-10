import Drawer from "@mui/material/Drawer";
import SideBarList from "./SideBarList";
import { Aplicacion, User } from "../App";

interface Props {
  user: User;
  aplicacion: Aplicacion;
  open: boolean;
  onOpenClose: () => void;
}
export default function SideBar({
  user,
  aplicacion,
  open = false,
  onOpenClose,
}: Props) {
  // const [state, setState] = React.useState(open);

  return (
    <>
      {/* <Button onClick={() => setState(false)}>Cerrar</Button> */}
      <Drawer anchor="left" open={open} onClose={() => onOpenClose()}>
        <SideBarList user={user} aplicacion={aplicacion} />
      </Drawer>
    </>
  );
}
