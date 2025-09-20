import { useState } from 'react';
import { AssetLibrary } from '../AssetLibrary';

export default function AssetLibraryExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  const handleUploadAsset = (file: File) => {
    console.log('Upload asset:', file.name);
    // In a real app, this would upload the file and add it to the assets
  };

  const handleDeleteAsset = (assetId: string) => {
    console.log('Delete asset:', assetId);
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleSelectAsset = (asset: any) => {
    console.log('Select asset:', asset.name);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Asset Library</h2>
        <p className="text-muted-foreground">
          Manage all your story assets in one place - images, audio, video, and animations.
        </p>
        
        <AssetLibrary
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          assets={assets}
          onUploadAsset={handleUploadAsset}
          onDeleteAsset={handleDeleteAsset}
          onSelectAsset={handleSelectAsset}
        />

        <div className="text-sm text-muted-foreground">
          Click the Assets button to open the library. The library includes demo assets to show functionality.
        </div>
      </div>
    </div>
  );
}