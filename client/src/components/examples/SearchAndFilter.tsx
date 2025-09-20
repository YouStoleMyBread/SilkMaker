import { useState } from 'react';
import { SearchAndFilter } from '../SearchAndFilter';

export default function SearchAndFilterExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  //todo: remove mock functionality
  const nodeStats = {
    totalNodes: 15,
    totalWords: 342,
    averagePathLength: 4.2,
    nodeTypeCounts: {
      start: 1,
      story: 8,
      choice: 4,
      end: 2,
      css: 3,
      variable: 2,
      condition: 1,
      audio: 2,
      video: 1,
    },
  };

  const highlightedNodeIds = searchTerm ? ['node-1', 'node-3'] : [];

  return (
    <div className="bg-background min-h-screen">
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypeFilterChange={setSelectedTypes}
        onSearchNode={(nodeId) => console.log('Search node:', nodeId)}
        onPanToNode={(nodeId) => console.log('Pan to node:', nodeId)}
        highlightedNodeIds={highlightedNodeIds}
        nodeStats={nodeStats}
      />
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Search and Filter Demo</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Search term:</strong> {searchTerm || 'None'}</p>
          <p><strong>Selected types:</strong> {selectedTypes.length ? selectedTypes.join(', ') : 'None'}</p>
          <p><strong>Found nodes:</strong> {highlightedNodeIds.length}</p>
        </div>
      </div>
    </div>
  );
}