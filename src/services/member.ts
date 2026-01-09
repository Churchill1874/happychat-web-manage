import { request } from '@/utils/request';

export async function memberPage (
  params: {
    current?: number;
    pageSize?: number;
  }) {
  return request('/api/manage/playerInfo/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize
    }
  });
}


export async function getMemberDetail(param: {id: string;}) {
   return request('/api/manage/playerInfo/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}