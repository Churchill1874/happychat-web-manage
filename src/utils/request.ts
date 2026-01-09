// src/utils/request.ts
import { request as umiRequest } from '@umijs/max';

export async function request<T = any>(url: string, options?: any) {
  //const token = localStorage.getItem('token-id');
  //console.log('123123->', token)
  const token = '11111111'
  return umiRequest<T>(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      ...(token ? { 'token-id': token } : {}),
    },
  });
}
