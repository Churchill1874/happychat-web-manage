import { ProTable } from '@ant-design/pro-components';
import { likesRecordPage } from '@/services/likesrecord';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { App } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface LikesRecordType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    playerId: string;
    playerName: string;
    account: string;
    level: string;
    avatarPath: string;
    likesId: string;
    likesType: string;
    content: string;
    targetPlayerId: string;
    infoType: string;
    createTime: string;
    createName?: string;
}

const LikesRecord: React.FC = () => {
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<LikesRecordType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', width: 100, align: 'center', search: false },
        { title: '用户名称', dataIndex: 'playerName', width: 150, search: false, align: 'center' },
        { title: '用户id', dataIndex: 'playerId', width: 100, align: 'center' },
        {
            title: '头像', dataIndex: 'avatarPath', width: 50, align: 'center', search: false,
            render: (_, record) => (
                <img
                    src={`/avatars/${record.avatarPath}.jpg`}
                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                />
            )
        },
        { title: '数据id', dataIndex: 'likesId', width: 100, align: 'center' },

        {
            title: '目标类型',
            dataIndex: 'likesType',
            width: 80,
            search: true,
            align: 'center',
            valueEnum: { 1: '新闻', 2: '评论' }
        },
        {
            title: '信息类型',
            dataIndex: 'infoType',
            width: 100,
            align: 'center',
            valueEnum: {
                1: "国内", 2: "东南亚新闻", 3: "政治", 4: "社会", 5: "推广", 6: "话题", 7: "贴吧", 8: "曝光", 9: "公司"
            }
        },
        { title: '内容', dataIndex: 'content', width: 300, search: false, align: 'center' },
        { title: '被赞人ID', dataIndex: 'targetPlayerId', width: 100, align: 'center' },


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
        <ProTable<LikesRecordType>
            rowKey="id"
            actionRef={actionRef}
            columns={columns}
            scroll={{ x: 'max-content' }}
            request={async (params) => {
                const res = await likesRecordPage(params);
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

export default LikesRecord;
