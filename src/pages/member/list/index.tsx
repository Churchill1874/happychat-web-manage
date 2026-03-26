import { ProTable } from '@ant-design/pro-components';
import { memberPage, deleteById } from '@/services/member';
import type { ProColumns } from '@ant-design/pro-components';
import { calcAge } from '@/utils/date';
import './index.less'
import { Button, App, message } from 'antd';
import { history } from '@umijs/max';
import { Member } from '../detail';
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from 'react';

const MemberManagement: React.FC = () => {
    const { modal } = App.useApp();
    const actionRef = useRef<ActionType | undefined>(undefined);

    const columns: ProColumns<Member>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
        { title: '昵称', dataIndex: 'name', width: 160 },
        { title: '账号', dataIndex: 'account', width: 130 },
        {
            title: '性别', dataIndex: 'gender', align: 'center',
            valueEnum: { 1: { text: '男' }, 0: { text: '女' } }, width: 40, search: false
        },
        { title: '年龄', dataIndex: 'birth', width: 50, align: 'center', render: (_, record: Member) => calcAge(record.birth), search: false },
        //{ title: '等级', dataIndex: 'level', width: 50, align: 'center', search: false },
        { title: '地区', dataIndex: 'city', width: 90, search: false , align: 'center'},
        {
            title: '机器人',
            width: 50,
            dataIndex: 'isBot',
            align: 'center',
            valueEnum: {
                false: { text: '否' },
                true: { text: '是' },
            },
            search: {
                transform: (value) => ({
                    isBot: value
                })
            },
            render: (_, record: Member) => (
                <span style={{ color: record.isBot ? '#610593' : 'gray' }}>
                    {record.isBot ? '是' : '否'}
                </span>
            ),
        },

        {
            title: '状态', dataIndex: 'status', width: 50, align: 'center',
            valueEnum: {
                0: { text: '禁用', status: 'error' },
                1: { text: '正常', status: 'success' }
            },
        },

        { title: '余额', dataIndex: 'balance', align: 'center', width: 80, search: false },
        {
            title: '头像', align: 'center', width: 40, search: false, render: (_, record) => (
                <img
                    src={`/avatars/${record.avatarPath}.jpg`}
                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                />
            )
        },
        { title: '注册时间', dataIndex: 'createTime', width: 100, search: false, align: 'center' },
        /*         {
                    title: '阵营',
                    dataIndex: 'campType',
                    align: 'center',
                    width: 60,
                    valueEnum: { 0: { text: "无" }, 1: { text: "红营" }, 2: { text: "蓝营" } },
                    render: (_, record: Member) => {
                        const map = {
                            null: { text: '无', color: '#999' },
                            0: { text: '无', color: '#999' },
                            1: { text: '红营', color: 'red' },
                            2: { text: '蓝营', color: 'blue' },
                        };
        
                        const cfg = map[record.campType as '0' | '1' | '2'];
        
                        return (
                            <span style={{ color: cfg?.color }}>
                                {cfg?.text}
                            </span>
                        )
                    }
                }, */
        // ✅ 新增：详情按钮
        {
            title: '操作',
            align: 'center',
            //valueType: 'option',
            width: 70,
            fixed: 'right',
            render: (_, record) => [
                <a
                    key="detail"
                    type="link"
                    style={{ fontWeight: 600 }}
                    onClick={() => {
                        // 方式1：跳详情页（推荐）
                        history.push(`/member/detail/${record.id}`);
                    }}
                >
                    详情
                </a>,
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
            ],
        },
    ];

    return (
        <ProTable<Member>
            rowKey="id"
            actionRef={actionRef}
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
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                                // 新增逻辑
                                console.log('点击新增');
                                history.push('/member/add')
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

export default MemberManagement;
