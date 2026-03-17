import { ProTable } from '@ant-design/pro-components';
import { exposurePage, deleteById } from '@/services/exposure';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { history } from '@umijs/max';
import { ExposureType } from '../detail';
import { message, Space, App, Button } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

const Exposure: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<ExposureType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: '标题', dataIndex: 'title', align: 'center', width: 250 },
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
            render: (_, record: ExposureType) => (
                <span style={{ color: record.isTop ? '#610593' : 'gray' }}>
                    {record.isTop ? '是' : '否'}
                </span>
            ),
        },

        { title: '区域', dataIndex: 'address', width: 70, align: 'center', search: false },
        { title: '浏览次数', dataIndex: 'viewsCount', align: 'center', width: 50, search: false },
        { title: '等级', dataIndex: 'level', width: 50, align: 'center', search: false },
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
                            history.push(`/news/exposure/detail/${record.id}`);
                        }}
                    >
                        详情
                    </a>

                    <a
                        style={{ marginLeft:'20px', color: '#ff4d4f' }}
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
        <ProTable<ExposureType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await exposurePage(params);
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
                                history.push('/news/exposure/add')
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

export default Exposure;
