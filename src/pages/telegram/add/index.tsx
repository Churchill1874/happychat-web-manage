// 目标路径: src/pages/telegram/add/index.tsx
import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { message, Button, Card, Image } from 'antd';
import { history } from '@umijs/max';
import { addTelegram } from '@/services/telegram';
import { useState } from 'react';
import { request } from '@/utils/request';
import './index.less';

const TelegramAdd = () => {

  const [posterImagePath, setPosterImagePath] = useState<string>();
  const [qrImagePath, setQrImagePath] = useState<string>();

  const handleUploadPoster = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const resp = await request<string>('/api/manage/tools/upload', {
        method: 'POST',
        data: formData,
      });

      setPosterImagePath(resp.data);
      message.success('海报图上传成功');
    };

    input.click();
  };

  const handleUploadQr = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const resp = await request<string>('/api/manage/tools/upload', {
        method: 'POST',
        data: formData,
      });

      setQrImagePath(resp.data);
      message.success('二维码上传成功');
    };

    input.click();
  };

  const handleFinish = async (values: any) => {

    if (!posterImagePath) {
      message.warning('请先上传海报图（建议3:1比例）');
      return false;
    }

    const submitData = {
      ...values,
      posterImagePath,
      qrImagePath,
    };

    const res = await addTelegram(submitData);

    if (res?.code === 0) {
      message.success('新增成功');
      history.push('/telegram/list');
      return true;
    }

    return false;
  };

  return (
    <PageContainer title="新增电报频道/群组">

      <ProForm
        onFinish={handleFinish}
        submitter={{
          render: (props, doms) => {
            return [
              doms[0],
              <Button
                key="cancel"
                onClick={() => history.push('/telegram/list')}
              >
                取消
              </Button>,
              doms[1],
            ];
          },
        }}
      >

        {/* 基本信息 */}
        <Card>
          <ProForm.Group colProps={{ span: 24 }}>

            <ProFormText
              name="title"
              label="标题"
              width="lg"
              rules={[
                { required: true, message: '请输入标题' },
                { max: 50, message: '标题最多50个字符' },
              ]}
            />

            <ProFormSelect
              name="type"
              label="类型"
              width="md"
              rules={[{ required: true, message: '请选择类型' }]}
              valueEnum={{
                1: '频道',
                2: '群组',
              }}
            />

            <ProFormText
              name="account"
              label="Telegram账号"
              width="md"
              placeholder="例如 @huiyakuaixun"
              rules={[{ required: true, message: '请输入Telegram账号' }]}
            />

            <ProFormText
              name="jumpUrl"
              label="跳转链接"
              width="md"
              placeholder="例如 https://t.me/huiyakuaixun"
              rules={[
                { required: true, message: '请输入跳转链接' },
                { type: 'url', warningOnly: true, message: '请确认链接格式是否正确' },
              ]}
            />

            <ProFormSelect
              name="isTop"
              label="置顶"
              width="md"
              rules={[{ required: true, message: '请选择是否置顶' }]}
              initialValue="false"
              valueEnum={{
                false: '否',
                true: '是',
              }}
            />

            <ProFormSelect
              name="status"
              label="状态"
              width="md"
              rules={[{ required: true, message: '请选择展示状态' }]}
              initialValue="true"
              valueEnum={{
                false: '不显示',
                true: '显示',
              }}
            />

          </ProForm.Group>
        </Card>

        {/* 图片 */}
        <Card style={{ marginTop: 10 }}>

          <div className="detail-container">

            {/* 海报图 */}
            <div className="detail-left">

              <div className="media-title">海报图（必传，建议3:1比例）</div>

              <div className="video-box">

                {posterImagePath ? (
                  <Image src={posterImagePath} className="poster-preview-img" />
                ) : (
                  <div
                    className="upload-btn"
                    style={{ width: 300, height: 100 }}
                    onClick={handleUploadPoster}
                  >
                    +
                  </div>
                )}

                {posterImagePath && (
                  <div className="video-btn-group">
                    <Button onClick={handleUploadPoster}>重新上传</Button>
                    <Button danger onClick={() => setPosterImagePath(undefined)}>
                      清除
                    </Button>
                  </div>
                )}

              </div>

            </div>

            {/* 二维码 */}
            <div className="detail-right">

              <div className="media-title">二维码（选传，没有则不展示该字段）</div>

              <div className="video-box">

                {qrImagePath ? (
                  <Image src={qrImagePath} className="qr-preview-img" />
                ) : (
                  <div
                    className="upload-btn"
                    style={{ width: 140, height: 140 }}
                    onClick={handleUploadQr}
                  >
                    +
                  </div>
                )}

                {qrImagePath && (
                  <div className="video-btn-group">
                    <Button onClick={handleUploadQr}>重新上传</Button>
                    <Button danger onClick={() => setQrImagePath(undefined)}>
                      清除
                    </Button>
                  </div>
                )}

              </div>

            </div>

          </div>

        </Card>

        {/* 描述 */}
        <Card style={{ marginTop: 10 }}>
          <div className="section-title">详情页描述内容</div>
          <ProFormTextArea
            name="description"
            fieldProps={{
              autoSize: { minRows: 6 },
            }}
            rules={[{ required: true, message: '请输入详情页描述内容' }]}
          />
        </Card>

      </ProForm>

    </PageContainer>
  );
};

export default TelegramAdd;
