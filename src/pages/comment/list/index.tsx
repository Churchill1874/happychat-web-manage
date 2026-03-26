import { ProTable } from '@ant-design/pro-components';
import { commentPage } from '@/services/comment';
import type { ProColumns } from '@ant-design/pro-components';
import './index.less'
import { history } from '@umijs/max';
import { Popconfirm, message, Space, App, Tag } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface CommentType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    newsId: string;
    topId: string;
    replyId: string;
    playerId: string;
    targetPlayerId: string;
    content: string;
    infoType: number;
    likesCount: string;
    commentsCount: string;
    readStatus: boolean;
    title: string;
    level: string;
    commentator: string;
    targetPlayerName: string;
    targetPlayerLevel: string;
    createTime: string;
    createName?: string;
}


const Comment: React.FC = () => {
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<CommentType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', align: 'center', width: 60 },
        { title: '标题', dataIndex: 'title', width: 280, align: 'center', search: false },
        { title: '标题id', dataIndex: 'newsId', width: 150, align: 'center', search: true , hidden: true},
        {
            title: '类型',
            dataIndex: 'infoType',
            width: 30,
            align: 'center',
            valueEnum: { 1: '国内', 2: '东南亚', 3: '政治', 4: '社会', 5: '推广', 6: '话题', 7: '贴吧', 8: '曝光', 9: '公司' },
            render: (_, record) => {
                const map: Record<number, { text: string; color: string }> = {
                    1: { text: '国内', color: 'blue' },
                    2: { text: '东南亚', color: 'green' },
                    3: { text: '政治', color: 'red' },
                    4: { text: '社会', color: 'orange' },
                    5: { text: '推广', color: 'purple' },
                    6: { text: '话题', color: 'cyan' },
                    7: { text: '贴吧', color: 'gold' },
                    8: { text: '曝光', color: 'magenta' },
                    9: { text: '公司', color: 'volcano' },
                };

                const item = map[record.infoType];

                if (!item) return '-';

                return (
                    <Tag color={item.color} style={{ fontWeight: 500 }}>
                        {item.text}
                    </Tag>
                );
            },

        },
        { title: '评论人', dataIndex: 'commentator', align: 'center', width: 80, search: false },
        {
            title: '评论人ID',
            dataIndex: 'playerId',
            align: 'center',
            width: 80,
            hidden: true
        },
        { title: '内容', dataIndex: 'content', width: 280, align: 'center', search: false },
        { title: '被评论人', dataIndex: 'targetPlayerName', align: 'center', width: 80, search: false },
/*         {
            title: '被评论人id',
            dataIndex: 'replyId',
            align: 'center',
            width: 50,
            search: true
        }, */
        { title: '回复量', dataIndex: 'commentsCount', align: 'center', width: 60, search: false },
        { title: '点赞量', dataIndex: 'likesCount', align: 'center', width: 60, search: false },
        {
            title: '状态', dataIndex: 'readStatus', align: 'center', width: 50, search: false,
            valueEnum: {
                false: { text: '未读' },
                true: { text: '已读' }
            }
        },
        { title: '时间', dataIndex: 'createTime', width: 120, align: 'center', search: false },


    ];

    return (
        <ProTable<CommentType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await commentPage(params);
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

export default Comment;
