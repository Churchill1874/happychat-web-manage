import { request as umiRequest } from '@umijs/max';
import { message } from 'antd';
import { showError } from '@/utils/antd-message'; // ✅ 用你注入的
import { history } from '@umijs/max';

//白名单
const noAuthUrls = [
  '/api/manage/website/login',
  '/api/manage/verificationCode/get'
];
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
  const isNoAuth = noAuthUrls.some(path => url.includes(path));



  // ✅ 前端主动检查登录
  if (!token && !isNoAuth) {
    history.replace('/user/login');
    throw new Error('未登录');
  }


  const resp = (await umiRequest(url, {
    ...options,
    getResponse: false,
    headers: {
      ...(options?.headers || {}),
      ...(token ? { 'token-id': token } : {}),
    },
    errorHandler: (error: any) => {

      if (error?.response?.status === 401) {

        localStorage.removeItem("token-id");

        history.push("/user/login");

      }

      throw error;
    }

  })) as unknown as Resp<T>; // ✅ 关键：unknown 中转

  if (resp.code === -2) {

    localStorage.removeItem("token-id");

    history.push("/user/login");

    throw new Error("未登录");
  }

  if (resp.code !== 0) {
    showError(resp.msg || '请求失败');
    throw new Error(resp.msg || 'Business Error');
  }

  return resp;
}

