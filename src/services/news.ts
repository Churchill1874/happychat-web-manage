import { request } from '@/utils/request';

export async function newsPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/news/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function getNewsDetail(param: { id: string; }) {
  return request('/api/manage/news/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}


export async function addNews(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/news/addNews',
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
    '/api/manage/news/delete',
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
    '/api/manage/news/updateNews',
    {
      method: 'POST',
      data:{
        ...req
      }
    }
  )
}