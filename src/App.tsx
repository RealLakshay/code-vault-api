import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Snippets from "./pages/Snippets";
import SnippetDetail from "./pages/SnippetDetail";
import CreateSnippet from "./pages/CreateSnippet";
import MySnippets from "./pages/MySnippets";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
<Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/snippet/:id" element={<SnippetDetail />} />
          <Route path="/create" element={<CreateSnippet />} />
          <Route path="/edit/:id" element={<CreateSnippet />} />
          <Route path="/my-snippets" element={<MySnippets />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
