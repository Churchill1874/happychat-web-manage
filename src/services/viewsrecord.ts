import { request } from '@/utils/request';

export async function viewsRecordPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/views/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
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
    '/api/manage/views/delete',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}

