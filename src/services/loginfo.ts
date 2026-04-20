import { request } from '@/utils/request';

export async function logInfoPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;
  return request('/api/manage/logInfo/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    },
  });
}