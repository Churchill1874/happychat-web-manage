import { ProTable } from '@ant-design/pro-components';
import { politicsPage, deleteById } from '@/services/politics';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { history } from '@umijs/max';
import { PoliticsType } from '../detail';
import { Popconfirm, message, Space, App, Button } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

const Politics: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<PoliticsType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', align: 'center', width: 50 },
        { title: '标题', dataIndex: 'title', align: 'center', width: 250 },
        { title: '来源', dataIndex: 'source', width: 60, align: 'center', search: false },
        { title: '国家', dataIndex: 'country', width: 60, align: 'center', search: false },
        {
            title: '状态',
            width: 50,
            dataIndex: 'newsStatus',
            align: 'center',
            valueEnum: {
                1: { text: '普通' },
                2: { text: '置顶' },
                3: { text: '热门' }
            },
            search: {
                transform: (value) => ({
                    isTop: value
                })
            },
        },
        { title: '评论数量', dataIndex: 'commentsCount', align: 'center', width: 50, search: false },
        { title: '点赞数量', dataIndex: 'likesCount', align: 'center', width: 50, search: false },
        { title: '浏览次数', dataIndex: 'viewCount', align: 'center', width: 50, search: false },
        { title: '创建人', dataIndex: 'createName', width: 50, align: 'center', search: false },
        { title: '创建时间', dataIndex: 'createTime', width: 120, align: 'center', search: false },

        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 70,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <a
                        onClick={() => {
                            history.push(`/news/politics/detail/${record.id}`);
                        }}
                    >
                        详情
                    </a>

                    <a
                        style={{ marginLeft: '20px', color: '#ff4d4f' }}
                        onClick={() => {
                            console.log("delete click");

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
        <ProTable<PoliticsType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await politicsPage(params);
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
                labelWidth: 50,
                defaultCollapsed: false,
                className: 'compact-search', // 加 class
                optionRender: (searchConfig, formProps, dom) => {
                    return [
                        ...dom, // 保留【查询】【重置】
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                                // 新增逻辑
                                console.log('点击新增');
                                history.push('/news/politics/add')
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
                density: false, // 👈 直接关掉密度按钮
                reload: false,
                setting: false,
            }}
            size='small'
        />
    );
};

export default Politics;
