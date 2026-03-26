import { request } from '@/utils/request';

export async function commentPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/comment/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


