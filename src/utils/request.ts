import { request as umiRequest } from '@umijs/max';
import { message } from 'antd';
import { showError } from '@/utils/antd-message'; // ✅ 用你注入的


export interface Resp<T = any> {
  code: number;
  msg: string;
  data: T;
}

export async function request<T = any>(
  url: string,
  options?: any
): Promise<Resp<T>> {
  const token = localStorage.getItem('token-id');

  const resp = (await umiRequest(url, {
    ...options,
    getResponse: false,
    headers: {
      ...(options?.headers || {}),
      ...(token ? { 'token-id': token } : {}),
    },
  })) as unknown as Resp<T>; // ✅ 关键：unknown 中转

  if (resp.code !== 0) {
    showError(resp.msg || '请求失败');
    throw new Error(resp.msg || 'Business Error');
  }

  return resp;
}
