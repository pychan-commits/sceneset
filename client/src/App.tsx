import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SharedDayOf from "./pages/SharedDayOf";
import Workspace from "./pages/Workspace";

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster position="bottom-right" /><Switch><Route path="/" component={Landing} /><Route path="/login" component={Login} /><Route path="/shared" component={SharedDayOf} /><Route path="/share/:token" component={SharedDayOf} /><Route path="/app/recap/:id" component={Workspace} /><Route path="/app/:view?" component={Workspace} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
