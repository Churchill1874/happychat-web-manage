import { ProTable } from '@ant-design/pro-components';
import { systemMessagePage } from '@/services/systemmessage';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { history } from '@umijs/max';
import { Popconfirm, message, Space, App, Button } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface SystemMessageType {
    id: string;
    title: string;
    content: string;
    status: boolean;
    messageType: string;
    recipientId: string;
    senderId: string;
    newsId: string;
    infoType: string;
    imagePath: string;
    popup: boolean;
    commentId: string;
    comment: string;
    systemNoticeType: string;
    createTime: string;
    createName: string;
}

const SystemMessage: React.FC = () => {
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<SystemMessageType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: '类型', dataIndex: 'messageType', width: 50, align: 'center', valueEnum: { 1: '系统', 2: '评论' } },
        { title: '标题', dataIndex: 'title', align: 'center', width: 200 },
        { title: '状态', dataIndex: 'status', width: 30, align: 'center', search: false, valueEnum: { true: '已读', false: '未读' } },
        { title: '内容', dataIndex: 'content', width: 300, align: 'center', search: false },
        { title: '收信人Id', dataIndex: 'recipientId', align: 'center', width: 80 },
        { title: '弹窗', dataIndex: 'popup', width: 30, align: 'center', search: false, valueEnum: { true: '是', false: '否' } },
        { title: '创建人', dataIndex: 'createName', width: 70, align: 'center', search: false },
        { title: '创建时间', dataIndex: 'createTime', width: 100, align: 'center', search: false },

    ];

    return (
        <ProTable<SystemMessageType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await systemMessagePage(params);
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
                className: 'compact-search', // 加 class
                optionRender: (searchConfig, formProps, dom) => {
                    return [
                        ...dom, // 保留【查询】【重置】
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                                // 新增逻辑
                                history.push('/system-message/add')
                            }}
                        >
                            新增
                        </Button>,
                        <Button
                            key="add"
                            type="default"
                            onClick={() => {
                                // 新增逻辑
                                history.push('/system-message/delete')
                            }}
                        >
                            删除
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

export default SystemMessage;
