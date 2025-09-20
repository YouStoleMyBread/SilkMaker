import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnhancedStoryEditor } from "@/components/EnhancedStoryEditor";
import { ProjectsBrowser } from "@/pages/ProjectsBrowser";
import NotFound from "@/pages/not-found";
import { ProjectData } from "@shared/schema";

function Router() {
  const [, setLocation] = useLocation();
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);

  const handleOpenProject = (project: ProjectData) => {
    setCurrentProject(project);
    setLocation(`/editor/${project.id}`);
  };

  const handleCloseProject = () => {
    setCurrentProject(null);
    setLocation('/');
  };

  return (
    <Switch>
      <Route path="/" component={() => <ProjectsBrowser onOpenProject={handleOpenProject} />} />
      <Route 
        path="/editor/:projectId" 
        component={({ params }) => (
          <EnhancedStoryEditor 
            projectId={params.projectId} 
            onBackToProjects={handleCloseProject}
          />
        )} 
      />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
