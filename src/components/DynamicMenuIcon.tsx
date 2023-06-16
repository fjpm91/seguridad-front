import {
  AccessTime,
  Accessibility,
  AccountBalanceWallet,
  Add,
  AddCircle,
  AddPhotoAlternate,
  Android,
  Apple,
  Apps,
  Archive,
  AttachFile,
  Backup,
  Block,
  Bolt,
  Bookmark,
  Build,
  Business,
  CalendarMonth,
  Call,
  CameraAlt,
  Check,
  Close,
  Coffee,
  Computer,
  ContentCopy,
  ContentCut,
  ContentPaste,
  Extension,
  Home,
  Lock,
  PeopleAlt,
  WebStories,
} from "@mui/icons-material";

interface Props {
  icon: string;
}
export const DynamicMenuIcon = ({ icon }: Props) => {
  switch (icon) {
    case "Accessibility":
      return <Accessibility />;

    case "AccessTime":
      return <AccessTime />;

    case "AccountBalanceWallet":
      return <AccountBalanceWallet />;

    case "Add":
      return <Add />;

    case "AddCircle":
      return <AddCircle />;

    case "AddPhotoAlternate":
      return <AddPhotoAlternate />;

    case "Android":
      return <Android />;

    case "Apps":
      return <Apps />;

    case "Apple":
      return <Apple />;

    case "Archive":
      return <Archive />;

    case "AttachFile":
      return <AttachFile />;

    case "Backup":
      return <Backup />;

    case "Block":
      return <Block />;

    case "Bolt":
      return <Bolt />;

    case "Bookmark":
      return <Bookmark />;

    case "Build":
      return <Build />;

    case "Business":
      return <Business />;

    case "CalendarMonth":
      return <CalendarMonth />;

    case "Call":
      return <Call />;

    case "CameraAlt":
      return <CameraAlt />;

    case "Check":
      return <Check />;

    case "Close":
      return <Close />;

    case "Coffee":
      return <Coffee />;

    case "Computer":
      return <Computer />;

    case "ContentCopy":
      return <ContentCopy />;

    case "ContentCut":
      return <ContentCut />;

    case "ContentPaste":
      return <ContentPaste />;

    case "Extension":
      return <Extension />;

    case "Home":
      return <Home />;

    case "Lock":
      return <Lock />;

    case "PeopleAlt":
      return <PeopleAlt />;

    case "WebStories":
      return <WebStories />;

    default:
      return <Home />;
  }
};
