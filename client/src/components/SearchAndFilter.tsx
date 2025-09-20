import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  X, 
  Target,
  Type,
  Music,
  Video,
  Code,
  Database,
  GitBranch,
  BarChart3
} from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTypes: string[];
  onTypeFilterChange: (types: string[]) => void;
  onSearchNode: (nodeId: string) => void;
  onPanToNode: (nodeId: string) => void;
  highlightedNodeIds: string[];
  nodeStats?: {
    totalNodes: number;
    totalWords: number;
    averagePathLength: number;
    nodeTypeCounts: Record<string, number>;
  };
}

const nodeTypes = [
  { value: 'start', label: 'Start', icon: '▶' },
  { value: 'story', label: 'Story', icon: '📖' },
  { value: 'choice', label: 'Choice', icon: '🔀' },
  { value: 'end', label: 'End', icon: '🏁' },
  { value: 'css', label: 'CSS', icon: <Code className="h-3 w-3" /> },
  { value: 'variable', label: 'Variable', icon: <Database className="h-3 w-3" /> },
  { value: 'condition', label: 'Condition', icon: <GitBranch className="h-3 w-3" /> },
  { value: 'audio', label: 'Audio', icon: <Music className="h-3 w-3" /> },
  { value: 'video', label: 'Video', icon: <Video className="h-3 w-3" /> },
];

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeFilterChange,
  onSearchNode,
  onPanToNode,
  highlightedNodeIds,
  nodeStats,
}: SearchAndFilterProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const handleTypeToggle = (type: string, checked: boolean) => {
    if (checked) {
      onTypeFilterChange([...selectedTypes, type]);
    } else {
      onTypeFilterChange(selectedTypes.filter(t => t !== type));
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onTypeFilterChange([]);
  };

  const hasActiveFilters = searchTerm.length > 0 || selectedTypes.length > 0;

  return (
    <div className="flex items-center gap-2 p-2 bg-background border-b">
      {/* Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nodes by title or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-8"
          data-testid="input-search-nodes"
        />
        {searchTerm && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1 h-6 w-6"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Type filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" data-testid="button-filter-types">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Node Types</div>
            {nodeTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={(checked) => handleTypeToggle(type.value, checked)}
                className="flex items-center gap-2"
              >
                <span className="text-sm">
                  {typeof type.icon === 'string' ? type.icon : type.icon}
                </span>
                {type.label}
                {nodeStats?.nodeTypeCounts[type.value] && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    {nodeStats.nodeTypeCounts[type.value]}
                  </Badge>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Node statistics */}
      {nodeStats && (
        <Popover open={isStatsOpen} onOpenChange={setIsStatsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" data-testid="button-node-stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Story Statistics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Nodes</div>
                  <div className="text-lg font-semibold">{nodeStats.totalNodes}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Words</div>
                  <div className="text-lg font-semibold">{nodeStats.totalWords}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Avg Path Length</div>
                  <div className="text-lg font-semibold">{nodeStats.averagePathLength}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Words/Node</div>
                  <div className="text-lg font-semibold">
                    {Math.round(nodeStats.totalWords / nodeStats.totalNodes)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Node Type Breakdown</div>
                {Object.entries(nodeStats.nodeTypeCounts).map(([type, count]) => {
                  const typeConfig = nodeTypes.find(t => t.value === type);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {typeof typeConfig?.icon === 'string' ? typeConfig.icon : typeConfig?.icon}
                        </span>
                        <span className="text-sm">{typeConfig?.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Search results */}
      {highlightedNodeIds.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {highlightedNodeIds.length} found
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onPanToNode(highlightedNodeIds[0])}
            title="Go to first result"
            data-testid="button-go-to-first-result"
          >
            <Target className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="outline"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}