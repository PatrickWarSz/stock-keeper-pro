import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Importa o cliente cedo para que `detectSessionInUrl` consuma qualquer
// `#access_token=...` (handoff vindo do Hub Nexus) antes do roteamento.
import "./lib/supabase";

createRoot(document.getElementById("root")!).render(<App />);
