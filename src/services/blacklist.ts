import { request } from '@/utils/request';

export async function blacklistPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/blacklist/page', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function addBlacklist(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/blacklist/add',
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
    '/api/manage/blacklist/del',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}

