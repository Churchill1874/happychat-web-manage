// 目标路径: src/services/telegram.ts
import { request } from '@/utils/request';

// 电报频道/群组类型（对应后端 Telegram 实体）
export interface TelegramType {
  id: string; // Long → string（后端用了 ToStringSerializer）
  title: string;
  type: number; // 1-频道 2-群组
  account: string; // Telegram账号，如 @xxxx
  jumpUrl: string; // 跳转链接，如 https://t.me/xxxx
  posterImagePath: string; // 海报图（3:1）
  qrImagePath?: string; // 二维码图片，可为空
  description: string;
  isTop: boolean;
  status: boolean;
  createTime: string;
  createName?: string;
}

export async function telegramPage(params: {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}) {
  const { current, pageSize, ...req } = params;

  return request('/api/manage/telegram/queryPage', {
    method: 'POST',
    data: {
      pageNum: params.current,
      pageSize: params.pageSize,
      ...req,
    }
  });
}

export async function getTelegramDetail(param: { id: string; }) {
  return request('/api/manage/telegram/findById', {
    method: 'POST',
    data: {
      id: param.id
    }
  });
}

export async function addTelegram(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/telegram/add',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}

export async function updateTelegram(param: { [key: string]: any; }) {
  const { ...req } = param;
  return request(
    '/api/manage/telegram/update',
    {
      method: 'POST',
      data: {
        ...req
      }
    }
  );
}

export async function deleteById(
  params: {
    [key: string]: any;
  }
) {
  const { ...req } = params;
  return request(
    '/api/manage/telegram/delete',
    {
      method: 'POST',
      data: {
        ...req
      }
    });
}
