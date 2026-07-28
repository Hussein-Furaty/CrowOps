export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  enabled: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServerResponse {
  id: number;
  name: string;
  hostname: string;
  ipAddress: string;
  sshPort: number;
  os?: string;
  architecture?: string;
  description?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServerPayload {
  name: string;
  hostname: string;
  ipAddress: string;
  sshPort: number;
  os?: string;
  architecture?: string;
  description?: string;
}

export interface SshCredentialStatus {
  id: number;
  serverId: number;
  username: string;
  authType: 'PASSWORD' | 'KEY';
  hasPassword: boolean;
  hasPrivateKey: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSshCredentialPayload {
  username: string;
  authType: 'PASSWORD' | 'KEY';
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

export interface ServerSystemInfo {
  serverId: number;
  hostname: string;
  osInfo: string;
  uptime: string;
  cpuUsage: string;
  memoryUsage: string;
  diskUsage: string;
  networkIn: string;
  networkOut: string;
  loadAverage: string;
  openPorts: string;
  processCount: number;
}
