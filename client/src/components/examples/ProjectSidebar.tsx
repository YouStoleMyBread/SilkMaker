import { ProjectSidebar } from '../ProjectSidebar';

export default function ProjectSidebarExample() {
  //todo: remove mock functionality
  const currentProject = {
    id: '1',
    name: 'The Enchanted Forest',
    description: 'A magical adventure story with multiple paths',
    nodeCount: 12,
    lastModified: '2 hours ago',
  };

  return (
    <div className="flex h-screen">
      <ProjectSidebar
        currentProject={currentProject}
        onNewProject={() => console.log('New project')}
        onOpenProject={() => console.log('Open project')}
        onExportProject={() => console.log('Export project')}
        onPreviewStory={() => console.log('Preview story')}
        onAddNode={(type) => console.log('Add node:', type)}
      />
      <div className="flex-1 bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Main content area</p>
      </div>
    </div>
  );
}