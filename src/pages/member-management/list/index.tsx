import { ProTable } from '@ant-design/pro-components';
import { memberPage } from '@/services/member';
import type { ProColumns } from '@ant-design/pro-components';
import { calcAge } from '@/utils/date';
import './index.less'
import { Button } from 'antd';
import { history } from '@umijs/max';
import { Member } from '../detail';

const MemberManagement: React.FC = () => {
    const columns: ProColumns<Member>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 60,
        },
        { title: '昵称', dataIndex: 'name', width: 250 },
        { title: '账号', dataIndex: 'account', width: 250 },
        { title: '性别', dataIndex: 'gender', align: 'center', valueEnum: { 1: { text: '男' }, 0: { text: '女' } }, width: 50 },
        { title: '生日', dataIndex: 'birth', width: 60, render: (_, record: Member) => calcAge(record.birth) },
        { title: '等级', dataIndex: 'level', width: 50, align: 'center' },
        { title: '城市', dataIndex: 'city' },
        //{ title: '机器人', dataIndex: 'isBot', valueEnum: { true: { text: "是",status: 'Default' }, false: { text: "否",status:'Success' } } },
        {
            title: '机器人',
            width: 70,
            dataIndex: 'isBot',
            align: 'center',
            render: (_, record: Member) => (
                <span style={{ color: record.isBot ? 'black' : 'gray' }}>
                    {record.isBot ? '是' : '否'}
                </span>
            ),
        },
        { title: '状态', dataIndex: 'status', width: 70, align: 'center', valueEnum: { 0: { text: '禁用', status: 'error' }, 1: { text: '正常', status: 'success' } } },
        { title: '余额', dataIndex: 'balance', width: 120 },
        { title: '地址', dataIndex: 'address' },
        { title: 'IP', dataIndex: 'ip', width: 120 },
        {
            title: '阵营',
            dataIndex: 'campType',
            align: 'center',
            width: 60,
            render: (_, record: Member) => {
                const map = {
                    null: { text: '无', color: '#999' },
                    0: { text: '无', color: '#999' },
                    1: { text: '红营', color: 'red' },
                    2: { text: '蓝营', color: 'blue' },
                };

                const cfg = map[record.campType as 0 | 1 | 2];

                return (
                    <span style={{ color: cfg?.color }}>
                        {cfg?.text}
                    </span>
                )
            }
        },
        // ✅ 新增：详情按钮
        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 90,
            fixed: 'right',
            render: (_, record) => [
                <Button
                    key="detail"
                    type="link"
                    style={{ fontWeight: 600 }}
                    onClick={() => {
                        // 方式1：跳详情页（推荐）
                        history.push(`/member-management/detail/${record.id}`);
                    }}
                >
                    详情
                </Button>,
            ],
        },
    ];

    return (
        <ProTable<Member>
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await memberPage(params);
                return {
                    data: res.data.records,
                    total: res.data.total,
                    success: true,
                };
            }}
            pagination={{
                showSizeChanger: true,
            }}
            search={false} // 不要搜索栏可以关
        />
    );
};

export default MemberManagement;
