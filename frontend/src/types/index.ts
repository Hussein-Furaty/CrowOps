// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'USER';

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  locked: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserPageResponse = {
  content: UserResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

// ─── Server ───────────────────────────────────────────────────────────────────

export type ServerResponse = {
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
};

export type CreateServerPayload = {
  name: string;
  hostname: string;
  ipAddress: string;
  sshPort: number;
  os?: string;
  architecture?: string;
  description?: string;
};

export type SshCredentialStatus = {
  id: number;
  serverId: number;
  username: string;
  authType: 'PASSWORD' | 'KEY';
  hasPassword: boolean;
  hasPrivateKey: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaveSshCredentialPayload = {
  username: string;
  authType: 'PASSWORD' | 'KEY';
  password?: string;
  privateKey?: string;
  passphrase?: string;
};

export type ServerSystemInfo = {
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
};
