// 目标路径: src/pages/vote/edit/index.tsx
// 新增和编辑共用：/vote/add 新增，/vote/edit/:id 编辑
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Alert, Button, Card, Image, Input, message, Radio, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { request } from '@/utils/request';
import { addVote, getVoteDetail, updateVote, VoteOptionType } from '@/services/vote';
import './index.less';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 5;

// 选择图片并上传，返回图片路径
const pickAndUpload = (): Promise<string | undefined> =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(undefined);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const resp = await request<string>('/api/manage/tools/upload', { method: 'POST', data: formData });
        message.success('上传成功');
        resolve(resp.data);
      } catch (e) {
        resolve(undefined);
      }
    };
    input.click();
  });

const VoteEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const formRef = useRef<ProFormInstance>(undefined);

  const [loading, setLoading] = useState<boolean>(isEdit);
  const [coverImagePath, setCoverImagePath] = useState<string>();
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [options, setOptions] = useState<VoteOptionType[]>([{ content: '' }, { content: '' }]);
  const [hasVotes, setHasVotes] = useState<boolean>(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const resp = await getVoteDetail({ id: id! });
        const vote = resp.data;
        formRef.current?.setFieldsValue({
          title: vote.title,
          description: vote.description,
          deadline: vote.deadline ? dayjs(vote.deadline) : undefined,
          isTop: vote.isTop,
          status: vote.status,
        });
        setCoverImagePath(vote.coverImagePath || undefined);
        setMultiSelect(!!vote.multiSelect);
        setOptions(
          (vote.options || []).map((o) => ({
            id: o.id,
            content: o.content,
            imagePath: o.imagePath || undefined,
            voteCount: o.voteCount,
          })),
        );
        setHasVotes((vote.voterCount || 0) > 0);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateOption = (index: number, patch: Partial<VoteOptionType>) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  };

  const moveOption = (index: number, delta: number) => {
    setOptions((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleFinish = async (values: any) => {
    const cleaned = options.map((o) => ({ ...o, content: (o.content || '').trim() }));
    if (cleaned.length < MIN_OPTIONS || cleaned.length > MAX_OPTIONS) {
      message.warning(`投票选项至少${MIN_OPTIONS}个，最多${MAX_OPTIONS}个`);
      return false;
    }
    if (cleaned.some((o) => !o.content)) {
      message.warning('请填写所有选项内容');
      return false;
    }
    if (new Set(cleaned.map((o) => o.content)).size !== cleaned.length) {
      message.warning('选项内容不能重复');
      return false;
    }

    const deadline = dayjs(values.deadline);
    if (!isEdit && deadline.isBefore(dayjs())) {
      message.warning('截止时间不能早于当前时间');
      return false;
    }

    const submitData = {
      ...values,
      deadline: deadline.format('YYYY-MM-DD HH:mm:ss'),
      coverImagePath: coverImagePath || '',
      multiSelect,
      options: cleaned.map((o) => ({ id: o.id, content: o.content, imagePath: o.imagePath || '' })),
    };

    if (isEdit) {
      await updateVote({ ...submitData, id });
      message.success('修改成功');
    } else {
      await addVote(submitData);
      message.success('新增成功');
    }
    history.push('/vote/list');
    return true;
  };

  return (
    <PageContainer title={isEdit ? '编辑投票' : '新增投票'}>
      <Spin spinning={loading}>
        <ProForm
          formRef={formRef}
          onFinish={handleFinish}
          initialValues={{ isTop: false, status: true }}
          submitter={{
            render: (_, doms) => [
              doms[0],
              <Button key="cancel" onClick={() => history.push('/vote/list')}>
                取消
              </Button>,
              doms[1],
            ],
          }}
        >
          {/* 基本信息 */}
          <Card>
            <ProFormText
              name="title"
              label="投票标题"
              width="xl"
              rules={[
                { required: true, message: '请输入投票标题' },
                { max: 100, message: '标题最多100字' },
              ]}
            />

            <ProForm.Group>
              <ProFormDateTimePicker
                name="deadline"
                label="统计截止时间"
                width="md"
                rules={[{ required: true, message: '请选择截止时间' }]}
                fieldProps={{ format: 'YYYY-MM-DD HH:mm:ss' }}
              />
              <ProForm.Item label="选择方式">
                <Radio.Group value={multiSelect} onChange={(e) => setMultiSelect(e.target.value)}>
                  <Radio.Button value={false}>单选</Radio.Button>
                  <Radio.Button value={true}>多选</Radio.Button>
                </Radio.Group>
              </ProForm.Item>
              <ProFormSwitch name="isTop" label="置顶" />
              <ProFormSwitch name="status" label="展示" />
            </ProForm.Group>

            <div className="media-title">封面图（选传）</div>
            <div className="vote-image-box">
              {coverImagePath ? (
                <Image src={coverImagePath} className="cover-preview-img" />
              ) : (
                <div
                  className="upload-btn"
                  style={{ width: 300, height: 150 }}
                  onClick={async () => {
                    const path = await pickAndUpload();
                    if (path) setCoverImagePath(path);
                  }}
                >
                  +
                </div>
              )}
              {coverImagePath && (
                <div className="btn-group">
                  <Button
                    onClick={async () => {
                      const path = await pickAndUpload();
                      if (path) setCoverImagePath(path);
                    }}
                  >
                    重新上传
                  </Button>
                  <Button danger onClick={() => setCoverImagePath(undefined)}>
                    清除
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 选项 */}
          <Card
            style={{ marginTop: 10 }}
            title={`投票选项（${options.length}/${MAX_OPTIONS}，至少${MIN_OPTIONS}个）`}
            extra={
              <Button
                icon={<PlusOutlined />}
                disabled={options.length >= MAX_OPTIONS}
                onClick={() => setOptions((prev) => [...prev, { content: '' }])}
              >
                添加选项
              </Button>
            }
          >
            {isEdit && hasVotes && (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 12 }}
                message="该投票已有人参与：修改选项文字会保留票数；删除选项会同时删除该选项的所有投票记录。"
              />
            )}

            {options.map((option, index) => (
              <div className="vote-option-row" key={option.id || `new-${index}`}>
                <div className="vote-option-index">{index + 1}</div>

                <div className="vote-option-image">
                  {option.imagePath ? (
                    <div className="vote-option-image-inner">
                      <Image src={option.imagePath} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 6 }} />
                      <div className="vote-option-image-actions">
                        <a
                          onClick={async () => {
                            const path = await pickAndUpload();
                            if (path) updateOption(index, { imagePath: path });
                          }}
                        >
                          换图
                        </a>
                        <a style={{ color: '#ff4d4f' }} onClick={() => updateOption(index, { imagePath: undefined })}>
                          清除
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="upload-btn"
                      style={{ width: 80, height: 80, fontSize: 28 }}
                      onClick={async () => {
                        const path = await pickAndUpload();
                        if (path) updateOption(index, { imagePath: path });
                      }}
                    >
                      +
                    </div>
                  )}
                </div>

                <div className="vote-option-content">
                  <Input
                    value={option.content}
                    maxLength={100}
                    showCount
                    placeholder={`选项 ${index + 1} 内容`}
                    onChange={(e) => updateOption(index, { content: e.target.value })}
                  />
                  {option.id && <div className="vote-option-count">当前得票：{option.voteCount || 0}</div>}
                </div>

                <div className="vote-option-actions">
                  <Button size="small" disabled={index === 0} onClick={() => moveOption(index, -1)}>
                    上移
                  </Button>
                  <Button size="small" disabled={index === options.length - 1} onClick={() => moveOption(index, 1)}>
                    下移
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={options.length <= MIN_OPTIONS}
                    onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
                  />
                </div>
              </div>
            ))}
          </Card>

          {/* 简介 */}
          <Card style={{ marginTop: 10 }}>
            <div className="section-title">投票事件简介</div>
            <ProFormTextArea
              name="description"
              fieldProps={{ autoSize: { minRows: 6 } }}
              placeholder="介绍一下这个投票的背景、事件经过"
            />
          </Card>
        </ProForm>
      </Spin>
    </PageContainer>
  );
};

export default VoteEdit;
