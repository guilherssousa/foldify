import { useContext } from "react";

import { FolderContext } from "../contexts/FolderContext";

function useFolder() {
  const context = useContext(FolderContext);

  return context;
}

export { useFolder };
