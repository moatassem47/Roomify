import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactLenis } from "lenis/react";

import "./styles/index.css";
import "lenis/dist/lenis.css";
import App from "./App.jsx";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter >
        <ReactLenis root>
          <App />
        </ReactLenis>
      </BrowserRouter>  
    </QueryClientProvider>
  </StrictMode>,
);
