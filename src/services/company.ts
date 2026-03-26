import { request } from '@/utils/request';

export async function companyPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/company/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}


export async function getCompanyDetail(param: { id: string; }) {
  return request('/api/manage/company/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}


export async function addCompany(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/company/addCompany',
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
    '/api/manage/company/deleteCompany',
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
    '/api/manage/company/updateCompany',
    {
      method: 'POST',
      data:{
        ...req
      }
    }
  )
}


//事件




export async function addEvent(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/company/addEvent',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}

export async function deleteEvent(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/company/deleteEvent',
    {
      method: 'POST',
      data: {
        ...req
      }
    });

}


export async function updateEvent(param: { [key: string]: any; }) {
  const {...req} = param;
  return request (
    '/api/manage/company/updateEvent',
    {
      method: 'POST',
      data:{
        ...req
      }
    }
  )
}