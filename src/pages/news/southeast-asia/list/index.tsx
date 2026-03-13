import { ProTable } from '@ant-design/pro-components';
import { southeastAsiaPage } from '@/services/southeast-asia';
import type { ProColumns } from '@ant-design/pro-components';
import { calcAge } from '@/utils/date';
import './index.less'
import { Button } from 'antd';
import { history } from '@umijs/max';
import { SoutheastAsia } from '../detail';

const MemberManagement: React.FC = () => {
    const columns: ProColumns<SoutheastAsia>[] = [
        {
            title: '序号',
            align: 'center',
            valueType: 'indexBorder', // 或 index
            width: 40,
            search: false
        },
        { title: '标题', dataIndex: 'title',align: 'center',  width: 250 },
        { title: '来源', dataIndex: 'source', width: 70, align: 'center', search: false },
        {
            title: '置顶',
            width: 50,
            dataIndex: 'isTop',
            align: 'center',
            valueEnum: {
                false: { text: '否' },
                true: { text: '是' },
            },
            search: {
                transform: (value) => ({
                    isTop: value
                })
            },
            render: (_, record: SoutheastAsia) => (
                <span style={{ color: record.isTop ? '#610593' : 'gray' }}>
                    {record.isTop ? '是' : '否'}
                </span>
            ),
        },

        {
            title: '热门',
            width: 50,
            dataIndex: 'isHot',
            align: 'center',
            valueEnum: {
                false: { text: '否' },
                true: { text: '是' },
            },
            search: {
                transform: (value) => ({
                    isHot: value
                })
            },
            render: (_, record: SoutheastAsia) => (
                <span style={{ color: record.isHot ? '#610593' : 'gray' }}>
                    {record.isHot ? '是' : '否'}
                </span>
            ),
        },

        { title: '区域', dataIndex: 'area', width: 70, align: 'center', search: false },
        { title: '评论数量', dataIndex: 'commentsCount', align: 'center', width: 50, search: false },
        { title: '浏览次数', dataIndex: 'viewCount', align: 'center', width: 50, search: false },
        {
            title: '状态', dataIndex: 'status', width: 50, align: 'center',
            valueEnum: {
                false: { text: '不显示', status: 'error' },
                true: { text: '显示', status: 'success' }
            },
        },

        { title: '创建人', dataIndex: 'createName', width: 50,align: 'center',  search: false },
        { title: '创建时间', dataIndex: 'createTime', width: 120, align: 'center', search: false },

        {
            title: '操作',
            align: 'center',
            valueType: 'option',
            width: 40,
            fixed: 'right',
            render: (_, record) => [
                <Button
                    key="detail"
                    type="link"
                    style={{ fontWeight: 600 }}
                    onClick={() => {
                        // 方式1：跳详情页（推荐）
                        history.push(`/news/southeast-asia/detail/${record.id}`);
                    }}
                >
                    详情
                </Button>,
            ],
        },
    ];

    return (
        <ProTable<SoutheastAsia>
            rowKey="id"
            columns={columns}
            request={async (params) => {
                const res = await southeastAsiaPage(params);
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
                                history.push('/news/southeast-asia/add')
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
