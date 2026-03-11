import { Question, SelectLang, Footer } from '@/components';
import defaultSettings from '../config/defaultSettings';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { App } from 'antd';
import { setMessageApi } from '@/utils/antd-message';
import { Dropdown } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '@/services/admin'

/**
 * layout 配置
 */
export const layout: RunTimeLayoutConfig = () => ({
  actionsRender: () => [<Question />, <SelectLang />],

  avatarProps: {
    title: '管理员',
    render: (_, avatarChildren) => {
      return (
        <Dropdown
          menu={{
            items: [
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: async () => {
                  try {
                    const res = await logout();

                    if (res.code === 0) {
                      localStorage.removeItem('token-id');
                      window.location.href = '/user/login';
                    }
                  } catch (e) {
                    localStorage.removeItem('token-id');
                    window.location.href = '/user/login';
                  }
                },
              },
            ],
          }}
        >
          {avatarChildren}
        </Dropdown>
      );
    },
  },

  waterMarkProps: { content: '' },
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

export async function getInitialState() {

  const token = localStorage.getItem("token-id");

  if (!token) {
    history.push('/user/login');
    return {};
  }

  return {};
}

/**
 * 用于注入 antd v5 的 message api
 * 只渲染一次，不影响 UI
 */
const MessageProvider = () => {
  const { message } = App.useApp();
  setMessageApi(message);
  return null;
};
