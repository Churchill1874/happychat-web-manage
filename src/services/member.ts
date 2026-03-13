import { request } from '@/utils/request';

export async function memberPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/playerInfo/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function getMemberDetail(param: { id: string; }) {
  return request('/api/manage/playerInfo/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}


export async function addMember(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/playerInfo/add',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}

export async function updateMember(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/playerInfo/update',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}


export async function deleteById(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/playerInfo/delete',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}

