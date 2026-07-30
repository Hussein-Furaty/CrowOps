import { axiosClient } from './axiosClient';
import type { 
  UserResponse, 
  UserPageResponse, 
  CreateUserPayload, 
  UpdateUserPayload, 
  ChangePasswordPayload, 
  ResetPasswordPayload 
} from '../types';

export const userApi = {
  getUsers: async (page = 0, size = 20, query = '') => {
    const response = await axiosClient.get<UserPageResponse>('/api/users', {
      params: { page, size, query }
    });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await axiosClient.get<UserResponse>(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (payload: CreateUserPayload) => {
    const response = await axiosClient.post<UserResponse>('/api/users', payload);
    return response.data;
  },

  updateUser: async (id: number, payload: UpdateUserPayload) => {
    const response = await axiosClient.put<UserResponse>(`/api/users/${id}`, payload);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await axiosClient.delete(`/api/users/${id}`);
  },

  changePassword: async (id: number, payload: ChangePasswordPayload) => {
    await axiosClient.patch(`/api/users/${id}/password`, payload);
  },

  resetPassword: async (id: number, payload: ResetPasswordPayload) => {
    await axiosClient.post(`/api/users/${id}/reset-password`, payload);
  },

  activateUser: async (id: number) => {
    const response = await axiosClient.patch<UserResponse>(`/api/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id: number) => {
    const response = await axiosClient.patch<UserResponse>(`/api/users/${id}/deactivate`);
    return response.data;
  },

  lockUser: async (id: number) => {
    const response = await axiosClient.patch<UserResponse>(`/api/users/${id}/lock`);
    return response.data;
  },

  unlockUser: async (id: number) => {
    const response = await axiosClient.patch<UserResponse>(`/api/users/${id}/unlock`);
    return response.data;
  }
};
