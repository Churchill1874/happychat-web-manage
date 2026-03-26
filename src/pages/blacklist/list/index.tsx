import { ProTable } from '@ant-design/pro-components';
import { blacklistPage, deleteById } from '@/services/blacklist';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { Button, App, message, Space } from 'antd';
import { history } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface BlacklistType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    ip: string;
    phone: string;
    device: string;
    remarks: string;
    /** yyyy-MM-dd HH:mm:ss */
    createTime: string;
    createName?: string;
    updateTime: string;
    updateName?: string;
}
const Blacklist: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<BlacklistType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', width: 60, align: 'center', search: false },
        { title: 'ip地址', dataIndex: 'ip', width: 100, align: 'center' },
        //{ title: '手机号', dataIndex: 'phone', width: 100 , align: 'center'},
        //{ title: '终端', dataIndex: 'device', width: 50, align: 'center', search: false },
        { title: '备注', dataIndex: 'remarks', width: 350, search: false, align: 'center' },

        { title: '创建时间', dataIndex: 'createTime', width: 100, search: false, align: 'center' },
        { title: '创建人', dataIndex: 'createName', width: 100, search: false, align: 'center' },

        // ✅ 新增：详情按钮
        {
            title: '操作',
            search: false,
            align: 'center',
            valueType: 'option',
            width: 50,
            fixed: 'right',
            render: (_, record) => [

                <a
                    style={{ width:'100%', color: '#ff4d4f', fontWeight: 500 }}
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



            ],
        },
    ];

    return (
        <ProTable<BlacklistType>
            rowKey="id"
            actionRef={actionRef}
            columns={columns}
            request={async (params) => {
                const res = await blacklistPage(params);
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
                className: 'compact-search', // 👈 加 class
                optionRender: (searchConfig, formProps, dom) => {
                    return [
                        ...dom, // 保留【查询】【重置】
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                                // 新增逻辑
                                console.log('点击新增');
                                history.push('/blacklist/add')
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

export default Blacklist;
