import { ProTable } from '@ant-design/pro-components';
import { viewsRecordPage, deleteById } from '@/services/viewsrecord';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { Button, App, message, Space } from 'antd';
import { history } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface ViewsRecordType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    playerId: string;
    viewsId: string;
    viewsType: string;
    ip: string;
    content: string;
    playerName: string;
    account: string;
    level: string;
    createTime: string;
    createName?: string;

}
const Blacklist: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<ViewsRecordType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', width: 100, align: 'center', search: false },
        { title: '用户名称', dataIndex: 'playerName', width: 150, search: false, align: 'center' },
        //{ title: '用户账号', dataIndex: 'account', width: 100, search: false, align: 'center' },
        { title: '用户id', dataIndex: 'playerId', width: 100, align: 'center' },
        { title: 'ip地址', dataIndex: 'ip', width: 50, align: 'center' },
        {
            title: '咨询类型',
            dataIndex: 'viewsType',
            width: 80,
            search: true,
            align: 'center',
            valueEnum: { 1: '国内新闻', 2: '工作', 3: '公司', 4: '聊妹', 5: '投注', 6: '东南亚新闻', 7: '政治', 8: '社会', 9: '推广', 10: '话题', 11: '曝光' }
        },
        { title: '简介', dataIndex: 'content', width: 300, search: false, align: 'center' },

        { title: '咨询id', dataIndex: 'viewsId', width: 100, align: 'center' },

        { title: '创建时间', dataIndex: 'createTime', width: 130, search: false, align: 'center' },

        // ✅ 新增：详情按钮
        /*         {
                    title: '操作',
                    search: false,
                    align: 'center',
                    valueType: 'option',
                    width: 40,
                    fixed: 'right',
                    render: (_, record) => [
                        <a
                            style={{ color: '#ff4d4f', fontWeight: 500 }}
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
                }, */
    ];

    return (
        <ProTable<ViewsRecordType>
            rowKey="id"
            actionRef={actionRef}
            columns={columns}
            request={async (params) => {
                const res = await viewsRecordPage(params);
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
                labelWidth: 'auto',
                defaultCollapsed: false,
                className: 'compact-search', // 👈 加 class
                optionRender: (searchConfig, formProps, dom) => {
                    return [
                        ...dom, // 保留【查询】【重置】
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
