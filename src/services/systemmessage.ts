import { request } from '@/utils/request';

export async function systemMessagePage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/systemMessage/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}




export async function addSystemMessage(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/systemMessage/send',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}



export async function deleteSystemMessage(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/systemMessage/deletePublicMessage',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}
