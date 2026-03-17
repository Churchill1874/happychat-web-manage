import { request } from '@/utils/request';

export async function exposurePage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/exposure/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function getExposureDetail(param: { id: string; }) {
  return request('/api/manage/exposure/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}


export async function addExposure(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/exposure/add',
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
    '/api/manage/exposure/delete',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}


export async function update(param: { [key: string]: any; }) {
  const {...req} = param;
  return request (
    '/api/manage/exposure/update',
    {
      method: 'POST',
      data:{
        ...req
      }
    }
  )
}