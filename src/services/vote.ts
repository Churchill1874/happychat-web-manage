// 目标路径: src/services/vote.ts
import { request } from '@/utils/request';

// 投票选项（对应后端 VoteOption）
export interface VoteOptionType {
  id?: string; // 新增选项时为空
  voteId?: string;
  content: string;
  imagePath?: string;
  sort?: number;
  voteCount?: number;
}

// 投票（对应后端 VoteResp）
export interface VoteType {
  id: string;
  title: string;
  description?: string;
  coverImagePath?: string;
  multiSelect: boolean;
  deadline: string; // yyyy-MM-dd HH:mm:ss
  voterCount: number;
  viewCount: number;
  commentsCount: number;
  isTop: boolean;
  status: boolean;
  ended: boolean;
  options: VoteOptionType[];
  createTime: string;
  createName?: string;
  updateTime?: string;
  updateName?: string;
}

export async function votePage(params: { current?: number; pageSize?: number; [key: string]: any }) {
  const { current, pageSize, ...req } = params;
  return request('/api/manage/vote/queryPage', {
    method: 'POST',
    data: {
      pageNum: current,
      pageSize,
      ...req,
    },
  });
}

export async function getVoteDetail(param: { id: string }) {
  return request<VoteType>('/api/manage/vote/findById', {
    method: 'POST',
    data: { id: param.id },
  });
}

export async function addVote(data: { [key: string]: any }) {
  return request('/api/manage/vote/add', { method: 'POST', data });
}

export async function updateVote(data: { [key: string]: any }) {
  return request('/api/manage/vote/update', { method: 'POST', data });
}

export async function deleteVote(param: { id: string }) {
  return request('/api/manage/vote/delete', { method: 'POST', data: param });
}

export async function sendVoteBotComments(param: { id: string; contentList: string[] }) {
  return request('/api/manage/vote/sendBotComments', { method: 'POST', data: param });
}

// 计算百分比：票数 / 参与人数（多选时各项相加可能超过100%）
export function votePercent(count: number | undefined, voterCount: number | undefined): number {
  if (!voterCount || !count) return 0;
  return Math.round((count / voterCount) * 1000) / 10;
}
