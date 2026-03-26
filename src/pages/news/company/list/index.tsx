import { ProTable } from '@ant-design/pro-components';
import { companyPage, deleteById } from '@/services/company';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { history } from '@umijs/max';
import { CompanyType } from '../detail';
import { Popconfirm, message, Space, App, Button } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

const Politics: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<CompanyType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', align: 'center', width: 50 },
        { title: '公司', dataIndex: 'name', align: 'center', width: 100 },
        { title: '所在城市', dataIndex: 'city', width: 60, align: 'center', search: false },
        { title: '规模', dataIndex: 'teamScale', align: 'center', width: 50, search: false },
        { title: '休假', dataIndex: 'holiday', align: 'center', width: 50, search: false },
        { title: '薪资', dataIndex: 'salaryRange', align: 'center', width: 50, search: false },

        //{ title: '领导性格', dataIndex: 'leadershipCharacter', align: 'center', width: 50, search: false },
        { title: '居住', dataIndex: 'live', align: 'center', width: 50, search: false },
        { title: '办公环境', dataIndex: 'officeEnvironment', align: 'center', width: 50, search: false },
        { title: '加班补偿', dataIndex: 'overtimeCompensation', align: 'center', width: 50, search: false },
        { title: '奖金制度', dataIndex: 'bonus', align: 'center', width: 50, search: false },

        //{ title: '创建人', dataIndex: 'createName', width: 50, align: 'center', search: false },
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
                            history.push(`/news/company/detail/${record.id}`);
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
        <ProTable<CompanyType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await companyPage(params);
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
                                history.push('/news/company/add')
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
