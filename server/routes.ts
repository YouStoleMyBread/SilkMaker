import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertStoryNodeSchema, 
  insertNodeGroupSchema, 
  insertAssetSchema,
  type EnhancedStoryNodeData,
  type ProjectData,
  type NodeGroupData,
  type AssetData
} from "@shared/schema";
import { format } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const projectsData: ProjectData[] = await Promise.all(
        projects.map(async (project) => {
          const nodes = await storage.getProjectNodes(project.id);
          return {
            id: project.id.toString(),
            name: project.name,
            description: project.description || undefined,
            nodeCount: nodes.length,
            lastModified: format(project.updatedAt, 'MMM d, yyyy'),
            settings: project.settings || undefined,
          };
        })
      );
      res.json(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const nodes = await storage.getProjectNodes(projectId);
      const groups = await storage.getProjectGroups(projectId);
      const assets = await storage.getProjectAssets(projectId);

      const projectData: ProjectData & { 
        nodes: EnhancedStoryNodeData[], 
        groups: NodeGroupData[], 
        assets: AssetData[] 
      } = {
        id: project.id.toString(),
        name: project.name,
        description: project.description || undefined,
        nodeCount: nodes.length,
        lastModified: format(project.updatedAt, 'MMM d, yyyy'),
        settings: project.settings || undefined,
        nodes: nodes.map(node => ({
          id: node.nodeId,
          title: node.title,
          content: node.content,
          type: node.type,
          position: node.position,
          connections: node.connections,
          variables: node.variables || undefined,
          hasImage: !!node.cssStyles?.backgroundImage,
          color: node.color || undefined,
          cssStyles: node.cssStyles || undefined,
          audioFile: node.audioFile || undefined,
          videoFile: node.videoFile || undefined,
          wordCount: node.wordCount || undefined,
        })),
        groups: groups.map(group => ({
          id: group.groupId,
          name: group.name,
          color: group.color,
          nodeIds: group.nodeIds,
          isVisible: group.isVisible,
        })),
        assets: assets.map(asset => ({
          id: asset.assetId,
          name: asset.name,
          type: asset.type,
          url: asset.url,
          size: asset.size,
          uploadDate: format(asset.createdAt, 'yyyy-MM-dd'),
          thumbnail: asset.thumbnail || undefined,
        })),
      };

      res.json(projectData);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      const projectData: ProjectData = {
        id: project.id.toString(),
        name: project.name,
        description: project.description || undefined,
        nodeCount: 0,
        lastModified: format(project.updatedAt, 'MMM d, yyyy'),
        settings: project.settings || undefined,
      };
      
      res.status(201).json(projectData);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ error: 'Failed to create project' });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = insertProjectSchema.partial().parse(req.body);
      
      const project = await storage.updateProject(projectId, updates);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const nodes = await storage.getProjectNodes(projectId);
      const projectData: ProjectData = {
        id: project.id.toString(),
        name: project.name,
        description: project.description || undefined,
        nodeCount: nodes.length,
        lastModified: format(project.updatedAt, 'MMM d, yyyy'),
        settings: project.settings || undefined,
      };
      
      res.json(projectData);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(400).json({ error: 'Failed to update project' });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const success = await storage.deleteProject(projectId);
      
      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Story Nodes API
  app.get("/api/projects/:projectId/nodes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const nodes = await storage.getProjectNodes(projectId);
      
      const nodesData: EnhancedStoryNodeData[] = nodes.map(node => ({
        id: node.nodeId,
        title: node.title,
        content: node.content,
        type: node.type,
        position: node.position,
        connections: node.connections,
        variables: node.variables || undefined,
        hasImage: !!node.cssStyles?.backgroundImage,
        color: node.color || undefined,
        cssStyles: node.cssStyles || undefined,
        audioFile: node.audioFile || undefined,
        videoFile: node.videoFile || undefined,
        wordCount: node.wordCount || undefined,
      }));
      
      res.json(nodesData);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      res.status(500).json({ error: 'Failed to fetch nodes' });
    }
  });

  app.post("/api/projects/:projectId/nodes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const nodeData = {
        ...req.body,
        projectId,
        wordCount: req.body.content ? req.body.content.split(' ').length : 0,
      };
      
      const validatedData = insertStoryNodeSchema.parse(nodeData);
      const node = await storage.createNode(validatedData);
      
      const nodeResponse: EnhancedStoryNodeData = {
        id: node.nodeId,
        title: node.title,
        content: node.content,
        type: node.type,
        position: node.position,
        connections: node.connections,
        variables: node.variables || undefined,
        hasImage: !!node.cssStyles?.backgroundImage,
        color: node.color || undefined,
        cssStyles: node.cssStyles || undefined,
        audioFile: node.audioFile || undefined,
        videoFile: node.videoFile || undefined,
        wordCount: node.wordCount || undefined,
      };
      
      res.status(201).json(nodeResponse);
    } catch (error) {
      console.error('Error creating node:', error);
      res.status(400).json({ error: 'Failed to create node' });
    }
  });

  app.put("/api/projects/:projectId/nodes/:nodeId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const nodeId = req.params.nodeId;
      
      const updates = {
        ...req.body,
        wordCount: req.body.content ? req.body.content.split(' ').length : undefined,
      };
      
      const validatedData = insertStoryNodeSchema.partial().parse(updates);
      const node = await storage.updateNode(projectId, nodeId, validatedData);
      
      if (!node) {
        return res.status(404).json({ error: 'Node not found' });
      }

      const nodeResponse: EnhancedStoryNodeData = {
        id: node.nodeId,
        title: node.title,
        content: node.content,
        type: node.type,
        position: node.position,
        connections: node.connections,
        variables: node.variables || undefined,
        hasImage: !!node.cssStyles?.backgroundImage,
        color: node.color || undefined,
        cssStyles: node.cssStyles || undefined,
        audioFile: node.audioFile || undefined,
        videoFile: node.videoFile || undefined,
        wordCount: node.wordCount || undefined,
      };
      
      res.json(nodeResponse);
    } catch (error) {
      console.error('Error updating node:', error);
      res.status(400).json({ error: 'Failed to update node' });
    }
  });

  app.delete("/api/projects/:projectId/nodes/:nodeId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const nodeId = req.params.nodeId;
      
      const success = await storage.deleteNode(projectId, nodeId);
      if (!success) {
        return res.status(404).json({ error: 'Node not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting node:', error);
      res.status(500).json({ error: 'Failed to delete node' });
    }
  });

  // Export API - Simple HTML export
  app.post("/api/projects/:projectId/export", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      const nodes = await storage.getProjectNodes(projectId);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Generate basic HTML export
      const exportHtml = generateStoryHTML(project, nodes);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name}.html"`);
      res.send(exportHtml);
    } catch (error) {
      console.error('Error exporting project:', error);
      res.status(500).json({ error: 'Failed to export project' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple HTML export generator
function generateStoryHTML(project: any, nodes: any[]): string {
  const startNode = nodes.find(node => node.type === 'start');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background: #1a1a1a;
            color: #e2e8f0;
        }
        .node {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 8px;
            background: #2d3748;
            border: 1px solid #4a5568;
        }
        .node-title {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffffff;
        }
        .node-content {
            margin-bottom: 20px;
            white-space: pre-wrap;
        }
        .choices {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .choice-button {
            padding: 12px 20px;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .choice-button:hover {
            background: #3182ce;
        }
        .hidden {
            display: none;
        }
        .project-title {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            color: #ffffff;
        }
        .project-description {
            text-align: center;
            margin-bottom: 40px;
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <h1 class="project-title">${project.name}</h1>
    ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
    
    <div id="story-container">
        ${nodes.map(node => `
            <div id="node-${node.nodeId}" class="node ${node.nodeId !== startNode?.nodeId ? 'hidden' : ''}">
                <h2 class="node-title">${node.title}</h2>
                <div class="node-content">${node.content}</div>
                ${node.connections && node.connections.length > 0 ? `
                    <div class="choices">
                        ${node.connections.map((connectionId: string) => {
                          const targetNode = nodes.find(n => n.nodeId === connectionId);
                          return targetNode ? `<button class="choice-button" onclick="showNode('${connectionId}')">${targetNode.title}</button>` : '';
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <script>
        function showNode(nodeId) {
            document.querySelectorAll('.node').forEach(node => {
                node.classList.add('hidden');
            });
            
            const targetNode = document.getElementById('node-' + nodeId);
            if (targetNode) {
                targetNode.classList.remove('hidden');
                targetNode.scrollIntoView({ behavior: 'smooth' });
            }
        }
    </script>
</body>
</html>`;
}
