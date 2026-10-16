// 目标路径: src/pages/vote/list/index.tsx
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { App, Button, Image, Input, message, Modal, Progress, Space, Tag } from 'antd';
import { history } from '@umijs/max';
import { useRef, useState } from 'react';
import { deleteVote, sendVoteBotComments, votePage, votePercent, VoteType } from '@/services/vote';
import './index.less';

const VoteList: React.FC = () => {
  const { modal } = App.useApp();
  const actionRef = useRef<ActionType | undefined>(undefined);

  // 查看结果
  const [resultVote, setResultVote] = useState<VoteType | null>(null);

  // 机器评论
  const [botVote, setBotVote] = useState<VoteType | null>(null);
  const [botText, setBotText] = useState('');

  const columns: ProColumns<VoteType>[] = [
    { title: '序号', align: 'center', valueType: 'indexBorder', width: 40, search: false },
    { title: 'ID', dataIndex: 'id', align: 'center', width: 60, search: false },
    {
      title: '封面',
      dataIndex: 'coverImagePath',
      align: 'center',
      width: 70,
      search: false,
      render: (_, r) =>
        r.coverImagePath ? <Image src={r.coverImagePath} width={50} height={36} style={{ objectFit: 'cover' }} /> : '-',
    },
    { title: '标题', dataIndex: 'title', align: 'center', width: 220, ellipsis: true },
    {
      title: '方式',
      dataIndex: 'multiSelect',
      align: 'center',
      width: 60,
      search: false,
      render: (_, r) => (r.multiSelect ? <Tag color="purple">多选</Tag> : <Tag>单选</Tag>),
    },
    {
      title: '选项数',
      align: 'center',
      width: 60,
      search: false,
      render: (_, r) => r.options?.length || 0,
    },
    { title: '参与人数', dataIndex: 'voterCount', align: 'center', width: 70, search: false },
    { title: '截止时间', dataIndex: 'deadline', align: 'center', width: 140, search: false },
    {
      title: '进度',
      dataIndex: 'ended',
      align: 'center',
      width: 70,
      valueEnum: {
        false: { text: '进行中', status: 'processing' },
        true: { text: '已截止', status: 'default' },
      },
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      align: 'center',
      width: 50,
      valueEnum: { false: { text: '否' }, true: { text: '是' } },
      render: (_, r) => <span style={{ color: r.isTop ? '#610593' : 'gray' }}>{r.isTop ? '是' : '否'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 60,
      valueEnum: {
        false: { text: '不显示', status: 'error' },
        true: { text: '显示', status: 'success' },
      },
    },
    { title: '浏览', dataIndex: 'viewCount', align: 'center', width: 50, search: false },
    { title: '评论', dataIndex: 'commentsCount', align: 'center', width: 50, search: false },
    { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 140, search: false },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a onClick={() => setResultVote(record)}>结果</a>
          <a onClick={() => history.push(`/vote/edit/${record.id}`)}>编辑</a>
          <a
            onClick={() => {
              setBotText('');
              setBotVote(record);
            }}
          >
            机器评论
          </a>
          <a
            style={{ color: '#ff4d4f' }}
            onClick={() => {
              modal.confirm({
                title: '确认删除？',
                content: '会同时删除所有选项和投票记录，无法恢复',
                okType: 'danger',
                onOk: async () => {
                  await deleteVote({ id: record.id });
                  message.success('删除成功');
                  actionRef.current?.reload();
                },
              });
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<VoteType>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        scroll={{ x: 1400 }}
        request={async (params) => {
          const res = await votePage(params);
          return { data: res.data.records, total: res.data.total, success: true };
        }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        search={{
          span: 6,
          labelWidth: 60,
          defaultCollapsed: false,
          className: 'compact-search',
          optionRender: (_, __, dom) => [
            ...dom,
            <Button key="add" type="primary" onClick={() => history.push('/vote/add')}>
              新增
            </Button>,
          ],
        }}
        beforeSearchSubmit={(params) => {
          const clean = { ...params };
          Object.keys(clean).forEach((key) => {
            if (clean[key] === '' || clean[key] === undefined || clean[key] === null) delete clean[key];
          });
          return clean;
        }}
        options={{ density: false, reload: false, setting: false }}
        size="small"
      />

      {/* 投票结果 */}
      <Modal
        open={!!resultVote}
        title={resultVote?.title}
        footer={null}
        onCancel={() => setResultVote(null)}
        width={560}
      >
        {resultVote && (
          <div className="vote-result">
            <div className="vote-result-meta">
              {resultVote.multiSelect ? '多选' : '单选'} · 参与 {resultVote.voterCount} 人 · 截止 {resultVote.deadline}
              {resultVote.ended ? <Tag style={{ marginLeft: 8 }}>已截止</Tag> : <Tag color="blue" style={{ marginLeft: 8 }}>进行中</Tag>}
            </div>
            {resultVote.options?.map((o) => {
              const percent = votePercent(o.voteCount, resultVote.voterCount);
              return (
                <div key={o.id} className="vote-result-row">
                  {o.imagePath && <Image src={o.imagePath} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} />}
                  <div className="vote-result-body">
                    <div className="vote-result-label">
                      <span>{o.content}</span>
                      <span>
                        {o.voteCount || 0} 票 · {percent}%
                      </span>
                    </div>
                    <Progress percent={percent} showInfo={false} size="small" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* 机器评论 */}
      <Modal
        open={!!botVote}
        title={`发送机器评论 - ${botVote?.title || ''}`}
        onCancel={() => setBotVote(null)}
        onOk={async () => {
          const contentList = botText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
          if (contentList.length === 0) {
            message.warning('请输入评论内容');
            return;
          }
          await sendVoteBotComments({ id: botVote!.id, contentList });
          message.success(`已发送 ${contentList.length} 条评论`);
          setBotVote(null);
          actionRef.current?.reload();
        }}
      >
        <Input.TextArea
          value={botText}
          onChange={(e) => setBotText(e.target.value)}
          autoSize={{ minRows: 6 }}
          placeholder="每行一条评论，会随机分配给机器人账号"
        />
      </Modal>
    </>
  );
};

export default VoteList;
