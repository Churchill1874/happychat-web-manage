import { ProTable } from '@ant-design/pro-components';
import { logInfoPage } from '@/services/loginfo';
import type { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

export interface LogInfoType {
    id: string;
    type: number;
    content: string;
    ip: string;
    address: string;
    playerId: string;
    createTime: string;
    createName: string;
}

const LogInfoList: React.FC = () => {
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<LogInfoType>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder',
            width: 40,
            search: false,
        },
        {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            width: 80,
            valueEnum: { 1: '报错', 2: '风控', 3: '统计' },
            render: (_, record) => {
                const map: Record<number, { text: string; color: string }> = {
                    1: { text: '报错', color: 'red' },
                    2: { text: '风控', color: 'orange' },
                    3: { text: '统计', color: 'blue' },
                };
                const item = map[record.type];
                if (!item) return '-';
                return <Tag color={item.color}>{item.text}</Tag>;
            },
        },
        { title: 'IP', dataIndex: 'ip', align: 'center', width: 130 },
        { title: '地址', dataIndex: 'address', align: 'center', width: 150, search: false },
        { title: '用户ID', dataIndex: 'playerId', align: 'center', width: 80 },
        { title: '时间', dataIndex: 'createTime', align: 'center', width: 150, search: false },
        { title: '内容', dataIndex: 'content', align: 'center', ellipsis: true },
    ];

    return (
        <ProTable<LogInfoType>
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await logInfoPage(params);
                return {
                    data: res.data.records,
                    total: res.data.total,
                    success: true,
                };
            }}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            search={{
                span: 6,
                labelWidth: 'auto',
                defaultCollapsed: false,
            }}
            beforeSearchSubmit={(params) => {
                const cleanParams = { ...params };
                Object.keys(cleanParams).forEach((key) => {
                    if (cleanParams[key] === '' || cleanParams[key] === undefined || cleanParams[key] === null) {
                        delete cleanParams[key];
                    }
                });
                return cleanParams;
            }}
            options={{ density: false, reload: false, setting: false }}
            size="small"
        />
    );
};

export default LogInfoList;