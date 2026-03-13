import {
  AlipayCircleOutlined,
  LockOutlined,
  SmileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  SelectLang,
  useIntl,
  useModel,
} from '@umijs/max';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import Settings from '../../../../config/defaultSettings';
import { Alert, App, Tabs, Row, Col } from 'antd';
import { adminLogin, AdminLoginResp, getCaptchaImage } from '@/services/admin';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});


const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};



const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<AdminLoginResp | null>(null);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaKey, setCaptchaKey] = useState('');

  React.useEffect(() => {
    changeCaptcha();
  }, []);


  const changeCaptcha = async () => {
    console.log("请求验证")
    const resp = (await getCaptchaImage());

    console.log(resp.data.captchaImage)
    if (resp.code === 0) {
      setCaptchaImg(resp.data.captchaImage)

    } else {
      message.error(resp.msg);
    }


  };


  interface LoginParam {
    username: string;
    password: string;
    captcha: string;
  }

  const handleSubmit = async (values: LoginParam) => {
    try {
      // 登录
      const resp = (await adminLogin({ ...values }));
      if (resp.code === 0) {
        localStorage.setItem("token-id", resp.data.tokenId);

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/dashboard/analysis';
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(resp.data);
    } catch (error:any) {
      console.log(error)
      message.error(error?.message || '请求登录失败');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="整点劲儿大的! 紫到卜"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
          })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParam);
          }}
        >
          <Tabs
            centered
            items={[
              {
                key: 'account',
                label: (
                  <span style={{ fontSize: 20, fontWeight: 500 }}>
                    {intl.formatMessage({
                      id: 'pages.login.accountLogin.tab',
                      defaultMessage: '上就完了 该上就上 别控制 不用给我面子 干就完了',
                    })}
                  </span>
                ),
              }
            ]}
          />

          {status === 'error' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          <ProFormText
            name="account"
            formItemProps={{
              style: { marginBottom: 30 }
            }}
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.username.placeholder',
              defaultMessage: '用户名: admin or user',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            formItemProps={{
              style: { marginBottom: 30 }
            }}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder={intl.formatMessage({
              id: 'pages.login.password.placeholder',
              defaultMessage: '密码: ant.design',
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />

          <ProFormText
            name="verificationCode"
            formItemProps={{ style: { marginBottom: 30 } }}
            fieldProps={{
              size: 'large',
              prefix: <SmileOutlined />,
              placeholder: '请输入验证码',
              suffix: captchaImg ? (
                <img
                  src={captchaImg}
                  onClick={changeCaptcha}
                  style={{
                    height: 32,
                    cursor: 'pointer',
                  }}
                />
              ) : null,
            }}
            rules={[{ required: true, message: '请输入验证码' }]}
          />


          <div
            style={{
              marginBottom: 24,
            }}
          >
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
