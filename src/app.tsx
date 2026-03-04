import { Question, SelectLang, Footer } from '@/components';
import defaultSettings from '../config/defaultSettings';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { App } from 'antd';
import { setMessageApi } from '@/utils/antd-message';

/**
 * layout 配置
 */
export const layout: RunTimeLayoutConfig = () => ({
  actionsRender: () => [<Question />, <SelectLang />],
  avatarProps: { title: 'dev' },
  waterMarkProps: { content: 'dev' },
  footerRender: () => <Footer />,
  menuHeaderRender: undefined,
  siderWidth: 170,

  // ⭐⭐⭐ 关键改动在这里 ⭐⭐⭐
  childrenRender: (children) => (
    <App>
      <MessageProvider />
      {children}
    </App>
  ),

  ...defaultSettings,
});

/**
 * 用于注入 antd v5 的 message api
 * 只渲染一次，不影响 UI
 */
const MessageProvider = () => {
  const { message } = App.useApp();
  setMessageApi(message);
  return null;
};
