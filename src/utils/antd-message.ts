import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance | null = null;

export const setMessageApi = (api: MessageInstance) => {
  messageApi = api;
};

export const showError = (msg: string) => {
  if (messageApi) {
    messageApi.error(msg);
  }
};
