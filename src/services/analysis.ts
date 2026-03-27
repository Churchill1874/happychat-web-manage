import { request } from '@/utils/request';

export async function registerReport() {
  return request('/api/manage/report/registerReport', {
    method: 'POST',
  });
}

export async function commentReport() {
  return request('/api/manage/report/commentReport', {
    method: 'POST',
  });
}

export async function viewReport() {
  return request('/api/manage/report/viewReport', {
    method: 'POST',
  });
}

export async function rankReport() {
  return request('/api/manage/report/rankReport', {
    method: 'POST',
  });
}





