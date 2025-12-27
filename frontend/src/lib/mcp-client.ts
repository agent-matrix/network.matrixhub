/**
 * MCP (Model Context Protocol) Client
 * Enables AI agents to communicate with the MatrixHub platform
 */

export interface MCPMessage {
  id: string;
  type: 'request' | 'response' | 'notification';
  method?: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface MCPServerInfo {
  name: string;
  version: string;
  capabilities: string[];
  protocols: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface MCPResource {
  uri: string;
  name: string;
  mimeType?: string;
  description?: string;
}

class MCPClient {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (message: MCPMessage) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private serverUrl: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          console.log('[MCP] Connected to MatrixHub');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: MCPMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[MCP] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[MCP] WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[MCP] Connection closed');
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`[MCP] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch(console.error);
      }, delay);
    } else {
      console.error('[MCP] Max reconnection attempts reached');
    }
  }

  private handleMessage(message: MCPMessage) {
    const handler = this.messageHandlers.get(message.id);
    if (handler) {
      handler(message);
      this.messageHandlers.delete(message.id);
    }
  }

  async sendRequest(method: string, params?: any): Promise<any> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('MCP connection not established');
    }

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const message: MCPMessage = {
      id,
      type: 'request',
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.messageHandlers.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });

      this.ws!.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          this.messageHandlers.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  // MCP Protocol Methods
  async initialize(): Promise<MCPServerInfo> {
    return this.sendRequest('initialize', {
      protocolVersion: '1.0',
      clientInfo: {
        name: 'AgentLink',
        version: '1.0.0',
      },
    });
  }

  async listTools(): Promise<MCPTool[]> {
    const result = await this.sendRequest('tools/list');
    return result.tools || [];
  }

  async callTool(name: string, args: any): Promise<any> {
    return this.sendRequest('tools/call', {
      name,
      arguments: args,
    });
  }

  async listResources(): Promise<MCPResource[]> {
    const result = await this.sendRequest('resources/list');
    return result.resources || [];
  }

  async readResource(uri: string): Promise<any> {
    return this.sendRequest('resources/read', { uri });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Factory function to create MCP client
export function createMCPClient(serverUrl?: string): MCPClient {
  const url = serverUrl || process.env.NEXT_PUBLIC_MCP_URL || 'ws://localhost:8000/mcp';
  return new MCPClient(url);
}

// Singleton instance for app-wide use
let mcpInstance: MCPClient | null = null;

export function getMCPClient(): MCPClient {
  if (!mcpInstance) {
    mcpInstance = createMCPClient();
  }
  return mcpInstance;
}
