// 目标路径: src/pages/telegram/list/index.tsx
import { ProTable } from '@ant-design/pro-components';
import { telegramPage, deleteById, TelegramType } from '@/services/telegram';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import './index.less';
import { history } from '@umijs/max';
import { message, Space, App, Button, Tag } from 'antd';
import { useRef } from 'react';

const Telegram: React.FC = () => {
  const { modal } = App.useApp();
  const actionRef = useRef<ActionType | undefined>(undefined);

  const columns: ProColumns<TelegramType>[] = [
    {
      title: '序号',
      align: 'center',
      valueType: 'indexBorder',
      width: 40,
      search: false,
    },
    { title: 'ID', dataIndex: 'id', align: 'center', width: 60, search: false },
    { title: '标题', dataIndex: 'title', align: 'center', width: 220 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 70,
      align: 'center',
      valueEnum: {
        1: { text: '频道' },
        2: { text: '群组' },
      },
    },
    { title: 'Telegram账号', dataIndex: 'account', width: 140, align: 'center' },
    {
      title: '跳转链接',
      dataIndex: 'jumpUrl',
      width: 200,
      align: 'center',
      search: false,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '二维码',
      dataIndex: 'qrImagePath',
      width: 60,
      align: 'center',
      search: false,
      render: (_, record) => (
        <Tag color={record.qrImagePath ? 'green' : 'default'}>
          {record.qrImagePath ? '有' : '无'}
        </Tag>
      ),
    },
    {
      title: '置顶',
      width: 50,
      dataIndex: 'isTop',
      align: 'center',
      valueEnum: {
        false: { text: '否' },
        true: { text: '是' },
      },
      search: {
        transform: (value) => ({
          isTop: value
        })
      },
      render: (_, record: TelegramType) => (
        <span style={{ color: record.isTop ? '#610593' : 'gray' }}>
          {record.isTop ? '是' : '否'}
        </span>
      ),
    },
    {
      title: '状态', dataIndex: 'status', width: 60, align: 'center',
      valueEnum: {
        false: { text: '不显示', status: 'error' },
        true: { text: '显示', status: 'success' }
      },
    },
    { title: '创建人', dataIndex: 'createName', width: 60, align: 'center', search: false },
    { title: '创建时间', dataIndex: 'createTime', width: 120, align: 'center', search: false },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      width: 60,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a
            style={{ color: '#ff4d4f' }}
            onClick={() => {
              modal.confirm({
                title: '确认删除？',
                content: '删除后数据无法恢复',
                okType: 'danger',
                onOk: async () => {
                  await deleteById({ id: record.id });
                  message.success('删除成功');
                  actionRef.current?.reload();
                },
              });
            }}
          >
            删除
          </a>
        </Space>
      )
    },
  ];

  return (
    <ProTable<TelegramType>
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      request={async (params) => {
        const res = await telegramPage(params);
        return {
          data: res.data.records,
          total: res.data.total,
          success: true,
        };
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
      search={{
        span: 6,
        labelWidth: 60,
        defaultCollapsed: false,
        className: 'compact-search',
        optionRender: (searchConfig, formProps, dom) => {
          return [
            ...dom,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                history.push('/telegram/add');
              }}
            >
              新增
            </Button>,
          ];
        },
      }}
      beforeSearchSubmit={(params) => {
        const cleanParams = { ...params };
        Object.keys(cleanParams).forEach((key) => {
          if (
            cleanParams[key] === '' ||
            cleanParams[key] === undefined ||
            cleanParams[key] === null
          ) {
            delete cleanParams[key];
          }
        });
        return cleanParams;
      }}
      options={{
        density: false,
        reload: false,
        setting: false,
      }}
      size="small"
    />
  );
};

export default Telegram;
