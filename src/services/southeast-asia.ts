import { request } from '@/utils/request';

export async function southeastAsiaPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/southeastAsia/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function getSoutheastAsiaDetail(param: { id: string; }) {
  return request('/api/manage/southeastAsia/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}


export async function addSoutheastAsia(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/southeastAsia/add',
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
    '/api/manage/southeastAsia/delete',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}


