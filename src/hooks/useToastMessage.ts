import { useState } from "react";

export const UseToastMessage = () => {
  const [toastMessage, setToastMessage] = useState("");
  
  return { toastMessage, setToastMessage };
};
