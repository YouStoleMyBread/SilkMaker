import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  File,
  FolderOpen,
  Plus,
  Search,
  FileText,
  Play,
  Download,
  Settings,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Project {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  lastModified: string;
}

interface ProjectSidebarProps {
  currentProject?: Project;
  onNewProject?: () => void;
  onOpenProject?: () => void;
  onExportProject?: () => void;
  onPreviewStory?: () => void;
  onAddNode?: (type: 'start' | 'story' | 'choice' | 'end') => void;
}

// Mock projects for demo //todo: remove mock functionality
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'The Enchanted Forest',
    description: 'A magical adventure story',
    nodeCount: 12,
    lastModified: '2 hours ago',
  },
  {
    id: '2',
    name: 'Space Explorer',
    description: 'Sci-fi interactive adventure',
    nodeCount: 8,
    lastModified: '1 day ago',
  },
];

export function ProjectSidebar({
  currentProject,
  onNewProject,
  onOpenProject,
  onExportProject,
  onPreviewStory,
  onAddNode,
}: ProjectSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const nodeTypes = [
    { type: 'start' as const, label: 'Start Node', icon: '▶', description: 'Beginning of your story' },
    { type: 'story' as const, label: 'Story Node', icon: '📖', description: 'Main narrative content' },
    { type: 'choice' as const, label: 'Choice Node', icon: '🔀', description: 'Player decision point' },
    { type: 'end' as const, label: 'End Node', icon: '🏁', description: 'Story conclusion' },
  ];

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="h-5 w-5 text-sidebar-foreground" />
          <h2 className="font-semibold text-sidebar-foreground">Projects</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onNewProject}
            data-testid="button-new-project"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenProject}
            data-testid="button-open-project"
          >
            <File className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Current Project */}
          {currentProject && (
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sidebar-foreground mb-1">
                  {currentProject.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {currentProject.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {currentProject.nodeCount} nodes
                  </Badge>
                  <span>•</span>
                  <span>{currentProject.lastModified}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onPreviewStory}
                  data-testid="button-preview-story"
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onExportProject}
                  data-testid="button-export-project"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
            </div>
          )}

          {/* Node Library */}
          <Accordion type="single" defaultValue="nodes" collapsible>
            <AccordionItem value="nodes">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Nodes
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {nodeTypes.map((nodeType) => (
                  <Button
                    key={nodeType.type}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => onAddNode?.(nodeType.type)}
                    data-testid={`button-add-${nodeType.type}-node`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{nodeType.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{nodeType.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {nodeType.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Recent Projects */}
          <Accordion type="single" collapsible>
            <AccordionItem value="recent">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Projects
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 mb-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8"
                      data-testid="input-search-projects"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {mockProjects
                    .filter(project => 
                      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      project.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-auto p-2"
                        data-testid={`button-project-${project.id}`}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {project.nodeCount} nodes • {project.lastModified}
                          </div>
                        </div>
                      </Button>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start"
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}