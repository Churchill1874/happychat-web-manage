import { request } from '@/utils/request';


export interface AdminLoginResp {
  name: string;
  account: string;
  role: string;
  loginTime: string;
  tokenId: string;
}


export async function adminLogin(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;

  return request<AdminLoginResp>('/api/manage/website/login', {
    method: 'POST',
    data: {
      ...req
    }
  });
}

export async function logout(){
    return request('/api/manage/website/logout', {
    method: 'POST'
  });
}

export interface Verification{
  captchaImage:string;
}
export async function getCaptchaImage(){
    return request<Verification>('/api/manage/verificationCode/get', {
    method: 'POST'
  });
}

