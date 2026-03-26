import { ProTable } from '@ant-design/pro-components';
import { privateChatPage } from '@/services/privatechat';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { App } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface PrivateChatType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    sendId: string;
    senderName: string;
    sendAvatarPath: string;

    receiveId: string;
    receiverName: string;
    receiveAvatarPath: string;

    content: string;
    status: boolean;
    type: string;
    createTime: string;
}

const LikesRecord: React.FC = () => {
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<PrivateChatType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        //{ title: 'ID', dataIndex: 'id', width: 100, align: 'center', search: false },
        {
            title: '发送人Id',
            dataIndex: 'sendId',
            width: 100,
            align: 'center',
            search: {
                transform: (value) => ({
                    playerAId: value
                })
            },
        },
        { title: '发送人名称', dataIndex: 'senderName', width: 140, search: false, align: 'center' },

        {
            title: '头像', dataIndex: 'avatarPath', width: 50, align: 'center', search: false,
            render: (_, record) => (
                <img
                    src={`/avatars/${record.sendAvatarPath}.jpg`}
                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                />
            )
        },
        { title: '内容', dataIndex: 'content', width: 300, search: false, align: 'center' },
        { title: '接收人名称', dataIndex: 'receiverName', width: 140, align: 'center', search: false },
        {
            title: '头像', dataIndex: 'avatarPath', width: 50, align: 'center', search: false,
            render: (_, record) => (
                <img
                    src={`/avatars/${record.receiveAvatarPath}.jpg`}
                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                />
            )
        },
        {
            title: '接收人Id',
            dataIndex: 'receiveId',
            width: 100,
            align: 'center',
            search: {
                transform: (value) => ({
                    playerBId: value
                })
            },
        },
        { title: '状态', dataIndex: 'status', width: 50, align: 'center', valueEnum: { true: "已读", false: "未读" }, search: false },
        { title: '创建时间', dataIndex: 'createTime', width: 120, search: false, align: 'center' },


    ];

    return (
        <ProTable<PrivateChatType>
            rowKey="id"
            actionRef={actionRef}
            columns={columns}
            scroll={{ x: 'max-content' }}
            request={async (params) => {
                const res = await privateChatPage(params);
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
