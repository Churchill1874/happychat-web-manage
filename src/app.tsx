import { Question, SelectLang, Footer } from '@/components';
import defaultSettings from '../config/defaultSettings';
import type { RunTimeLayoutConfig } from '@umijs/max';

/**
 * layout 配置
 */
export const layout: RunTimeLayoutConfig = () => ({
  actionsRender: () => [<Question />, <SelectLang />],
  avatarProps: { title: 'dev' },
  waterMarkProps: { content: 'dev' },
  footerRender: () => <Footer />,
  menuHeaderRender: undefined,
  ...defaultSettings,
});
