import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FolderOpen, 
  Upload, 
  Image, 
  Music, 
  Video, 
  FileImage,
  Trash2,
  Download,
  Copy,
  MoreVertical,
  Search
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'gif';
  url: string;
  size: number;
  uploadDate: string;
  thumbnail?: string;
}

interface AssetLibraryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
  onUploadAsset: (file: File) => void;
  onDeleteAsset: (assetId: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export function AssetLibrary({
  isOpen,
  onOpenChange,
  assets,
  onUploadAsset,
  onDeleteAsset,
  onSelectAsset,
}: AssetLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'video' | 'gif'>('all');

  //todo: remove mock functionality - Mock assets for demo
  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'forest-background.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
      size: 245760,
      uploadDate: '2024-01-15',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100',
    },
    {
      id: '2',
      name: 'ambient-music.mp3',
      type: 'audio',
      url: '/assets/audio/ambient.mp3',
      size: 5242880,
      uploadDate: '2024-01-14',
    },
    {
      id: '3',
      name: 'fire-animation.gif',
      type: 'gif',
      url: '/assets/gifs/fire.gif',
      size: 1048576,
      uploadDate: '2024-01-13',
    },
    {
      id: '4',
      name: 'intro-cutscene.mp4',
      type: 'video',
      url: '/assets/videos/intro.mp4',
      size: 15728640,
      uploadDate: '2024-01-12',
    },
  ];

  const allAssets = [...assets, ...mockAssets];

  const filteredAssets = allAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'gif':
        return <FileImage className="h-4 w-4" />;
      default:
        return <FileImage className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        onUploadAsset(file);
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-asset-library">
          <FolderOpen className="h-4 w-4 mr-2" />
          Assets
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Asset Library</SheetTitle>
          <SheetDescription>
            Manage images, audio, video, and animated assets for your story
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Upload section */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Upload Assets</h4>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag files here or click to browse
                </p>
                <Input
                  type="file"
                  accept="image/*,audio/*,video/*,.gif,.apng"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="asset-upload"
                />
                <Label htmlFor="asset-upload" asChild>
                  <Button variant="outline" size="sm" data-testid="button-upload-assets">
                    Choose Files
                  </Button>
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, APNG, MP3, WAV, MP4, WebM
              </p>
            </div>
          </Card>

          {/* Search and filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                data-testid="input-search-assets"
              />
            </div>

            <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="gif">GIFs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Asset grid */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-2 gap-3">
              {filteredAssets.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <FolderOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'No assets match your search' : 'No assets uploaded yet'}
                  </p>
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <Card
                    key={asset.id}
                    className="p-2 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onSelectAsset(asset)}
                    data-testid={`asset-${asset.id}`}
                  >
                    {/* Asset preview */}
                    <div className="aspect-square bg-muted rounded mb-2 overflow-hidden">
                      {asset.type === 'image' || asset.type === 'gif' ? (
                        <img
                          src={asset.thumbnail || asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getAssetIcon(asset.type)}
                        </div>
                      )}
                    </div>

                    {/* Asset info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-medium truncate">
                          {asset.name}
                        </h5>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteAsset(asset.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(asset.size)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Stats */}
          <div className="pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              {filteredAssets.length} assets • {formatFileSize(
                filteredAssets.reduce((total, asset) => total + asset.size, 0)
              )} total
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}