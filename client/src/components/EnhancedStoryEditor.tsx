import { useState, useCallback } from 'react';
import { TopToolbar } from './TopToolbar';
import { ProjectSidebar } from './ProjectSidebar';
import { EnhancedStoryNode, type EnhancedStoryNodeData } from './EnhancedStoryNode';
import { PropertiesPanel } from './PropertiesPanel';
import { NodeEditModal } from './NodeEditModal';
import { NodeGroupDrawer } from './NodeGroupDrawer';
import { AssetLibrary } from './AssetLibrary';
import { SearchAndFilter } from './SearchAndFilter';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight,
  Grid3x3,
  Play,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useProject } from '@/hooks/useProjects';
import { useProjectNodes, useCreateNode, useUpdateNode, useDeleteNode } from '@/hooks/useStoryNodes';
import { useExportProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NodeGroup {
  id: string;
  name: string;
  color: string;
  nodeIds: string[];
  isVisible: boolean;
}

interface EnhancedStoryEditorContentProps {
  projectId: string;
  onBackToProjects: () => void;
}

function EnhancedStoryEditorContent({ projectId, onBackToProjects }: EnhancedStoryEditorContentProps) {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  // Backend data
  const { data: projectData, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();
  const exportProject = useExportProject();
  
  // Updated to use single project query that includes nodes data instead of separate calls
  
  // Loading and error states
  if (projectLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            Loading project...
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  if (projectError) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mb-4">
              Failed to load project. Please check your connection and try again.
            </AlertDescription>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBackToProjects}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }
  
  if (!currentProject) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested project could not be found.</p>
          <Button onClick={onBackToProjects}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }
  
  // Data from backend
  const nodes: EnhancedStoryNodeData[] = (projectData as any)?.nodes ?? [];
  const groups: NodeGroup[] = (projectData as any)?.groups ?? [];
  const currentProject = projectData || null;

  // UI state
  const [selectedNodeId, setSelectedNodeId] = useState<string>('3');
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<EnhancedStoryNodeData | undefined>();
  const [isModified, setIsModified] = useState(false);
  
  // Canvas state
  const [zoom, setZoom] = useState(75);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // UI toggles
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Calculated values
  const totalWords = nodes.reduce((sum, node) => sum + (node.wordCount || 0), 0);
  const nodeStats = {
    totalNodes: nodes.length,
    totalWords,
    averagePathLength: 4.2, // Would be calculated based on actual paths
    nodeTypeCounts: nodes.reduce((counts, node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>),
  };

  const highlightedNodeIds = nodes
    .filter(node => 
      (searchTerm === '' || 
       node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       node.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTypes.length === 0 || selectedTypes.includes(node.type))
    )
    .map(node => node.id);

  // Event handlers
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeEdit = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    setEditingNode(node);
    setIsEditModalOpen(true);
  }, [nodes]);

  const handleNodeHover = useCallback((nodeId: string, isHovering: boolean) => {
    setHoveredNodeId(isHovering ? nodeId : null);
  }, []);

  const getConnectedNodes = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    return nodes.filter(n => node.connections.includes(n.id));
  }, [nodes]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleZoomFit = () => { setZoom(100); setPan({ x: 0, y: 0 }); };

  const handleAutoAlign = () => {
    console.log('Auto-align nodes');
    // Would implement automatic node alignment logic
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Top Toolbar */}
      <TopToolbar
        projectName={currentProject.name}
        isModified={isModified}
        canUndo={false}
        canRedo={false}
        isDarkMode={theme === 'dark'}
        onSave={() => {
          setIsModified(false);
          console.log('Project saved');
        }}
        onNew={() => console.log('New project')}
        onOpen={() => console.log('Open project')}
        onExport={() => console.log('Export to HTML')}
        onPreview={() => window.open('/preview', '_blank')}
        onShare={() => console.log('Share project')}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        onToggleTheme={toggleTheme}
        onSettings={() => console.log('Settings')}
        onHelp={() => console.log('Help')}
      />

      {/* Search and Filter Bar */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypeFilterChange={setSelectedTypes}
        onSearchNode={handleNodeSelect}
        onPanToNode={handleNodeSelect}
        highlightedNodeIds={highlightedNodeIds}
        nodeStats={nodeStats}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Collapsible */}
        <div className={`transition-all duration-300 ${isLeftSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
          <ProjectSidebar
            currentProject={currentProject}
            onNewProject={() => console.log('New project')}
            onOpenProject={() => console.log('Open project')}
            onExportProject={() => console.log('Export project')}
            onPreviewStory={() => window.open('/preview', '_blank')}
            onAddNode={(type) => {
              setEditingNode(undefined);
              setIsEditModalOpen(true);
            }}
          />
        </div>

        {/* Left Sidebar Toggle */}
        <div className="flex flex-col border-r border-border">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="h-8 w-8 rounded-none"
            data-testid="button-toggle-left-sidebar"
          >
            {isLeftSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-background">
          {/* Canvas */}
          <div
            className="w-full h-full relative cursor-grab"
            style={{
              backgroundImage: `
                radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
            data-testid="enhanced-story-canvas"
          >
            {/* Canvas content */}
            <div
              className="relative"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                transformOrigin: '0 0',
              }}
            >
              {/* Connection lines (for all visible connections when not hovering) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="hsl(var(--primary))"
                    />
                  </marker>
                </defs>
                
                {/* Show all connections with low opacity when not hovering */}
                {!hoveredNodeId && nodes.map(node => 
                  node.connections.map(targetId => {
                    const targetNode = nodes.find(n => n.id === targetId);
                    if (!targetNode) return null;
                    
                    const startX = node.position.x + 128;
                    const startY = node.position.y + 64;
                    const endX = targetNode.position.x + 128;
                    const endY = targetNode.position.y + 64;
                    
                    return (
                      <line
                        key={`${node.id}-${targetId}`}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                        className="opacity-30"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })
                )}
              </svg>

              {/* Enhanced story nodes */}
              {nodes
                .filter(node => highlightedNodeIds.includes(node.id))
                .map(node => (
                  <EnhancedStoryNode
                    key={node.id}
                    data={node}
                    isSelected={selectedNodeId === node.id}
                    isHovered={hoveredNodeId === node.id}
                    showConnections={hoveredNodeId === node.id}
                    connectedNodes={getConnectedNodes(node.id)}
                    onSelect={handleNodeSelect}
                    onEdit={handleNodeEdit}
                    onDelete={(nodeId) => {
                      setNodes(prev => prev.filter(n => n.id !== nodeId));
                      setIsModified(true);
                    }}
                    onConnect={(nodeId) => console.log('Connect node:', nodeId)}
                    onHover={handleNodeHover}
                  />
                ))}
            </div>
          </div>

          {/* Enhanced Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomOut} disabled={zoom <= 25}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomFit}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleAutoAlign}>
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <div className="bg-secondary px-2 py-1 rounded text-xs font-mono text-center">
              {zoom}%
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <NodeGroupDrawer
              isOpen={isGroupDrawerOpen}
              onOpenChange={setIsGroupDrawerOpen}
              groups={groups}
              nodes={nodes}
              selectedNodes={selectedNodeIds}
              onCreateGroup={(name, color, nodeIds) => {
                console.log('Create group:', { name, color, nodeIds });
                setIsModified(true);
              }}
              onUpdateGroup={(groupId, updates) => {
                console.log('Update group:', groupId, updates);
              }}
              onDeleteGroup={(groupId) => {
                console.log('Delete group:', groupId);
              }}
              onToggleGroupVisibility={(groupId) => {
                console.log('Toggle visibility:', groupId);
              }}
              onSelectGroup={(groupId) => {
                console.log('Select group:', groupId);
              }}
            />
            
            <AssetLibrary
              isOpen={isAssetLibraryOpen}
              onOpenChange={setIsAssetLibraryOpen}
              assets={[]}
              onUploadAsset={(file) => console.log('Upload asset:', file.name)}
              onDeleteAsset={(assetId) => console.log('Delete asset:', assetId)}
              onSelectAsset={(asset) => console.log('Select asset:', asset)}
            />

            <Button
              variant="default"
              size="sm"
              onClick={() => window.open('/preview', '_blank')}
              data-testid="button-play-story"
            >
              <Play className="h-4 w-4 mr-2" />
              Play Story
            </Button>
          </div>
        </div>

        {/* Right Panel Toggle */}
        <div className="flex flex-col border-l border-border">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="h-8 w-8 rounded-none"
            data-testid="button-toggle-right-panel"
          >
            {isRightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Right Properties Panel - Collapsible */}
        <div className={`transition-all duration-300 ${isRightPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
          {/* Enhanced Properties Panel placeholder */}
          <div className="w-80 bg-card border-l border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <h3 className="font-medium mb-2">Enhanced Properties</h3>
              <p className="text-sm">
                Advanced node editing with support for CSS styling, variables, and media assets.
              </p>
              {selectedNodeId && (
                <div className="mt-4 text-xs">
                  <p>Selected: {nodes.find(n => n.id === selectedNodeId)?.title}</p>
                  <p>Type: {nodes.find(n => n.id === selectedNodeId)?.type}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Node Edit Modal */}
      <NodeEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNode(undefined);
        }}
        nodeData={editingNode as any}
        onSave={(data) => {
          if (editingNode) {
            setNodes(prev => prev.map(node => 
              node.id === editingNode.id ? { ...node, ...data } : node
            ));
          } else {
            // Create new node
            const newNode: EnhancedStoryNodeData = {
              id: `node-${Date.now()}`,
              title: data.title,
              content: data.content,
              type: data.type,
              position: { x: 200, y: 200 },
              connections: [],
              variables: data.variables,
              hasImage: data.hasImage,
              wordCount: data.content.split(' ').length,
            };
            setNodes(prev => [...prev, newNode]);
          }
          setIsModified(true);
        }}
      />
    </div>
  );
}

interface EnhancedStoryEditorProps {
  projectId: string;
  onBackToProjects: () => void;
}

export function EnhancedStoryEditor({ projectId, onBackToProjects }: EnhancedStoryEditorProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <EnhancedStoryEditorContent projectId={projectId} onBackToProjects={onBackToProjects} />
    </ThemeProvider>
  );
}