import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { EnhancedTodoList } from "./EnhancedTodoList.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EnhancedTodoList />
  </StrictMode>
);
