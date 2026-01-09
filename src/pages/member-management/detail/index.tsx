import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';
import { getMemberDetail } from '@/services/member';
import { ProDescriptions } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import { calcAge } from '@/utils/date';
import './index.less';

export interface Member {
    id: string; // Long → string（后端用了 ToStringSerializer）
    name: string;
    account: string;
    password?: string; // ⚠️ 一般详情页/列表不会返回
    phone?: string;
    email?: string;
    gender: number;
    city?: string;
    /** yyyy-MM-dd */
    birth?: string;
    level: number;
    selfIntroduction?: string;
    isBot: boolean;
    status: number;
    avatarPath?: string;
    balance: string;
    tg?: string;
    address?: string;
    ip?: string;
    campType?: number;
    /** yyyy-MM-dd HH:mm:ss */
    createTime: string;
    createName?: string;
    updateTime: string;
    updateName?: string;
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Member>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        getMemberDetail({ id })
            .then(res => { setData(res.data) })
            .finally(() => setLoading(false));
    }, [id])

    return (
        <>
            <Card title="用户详情">
                <ProDescriptions<Member>
                    loading={loading}
                    dataSource={data}
                    column={5}
                >
                    <ProDescriptions.Item label="昵称" dataIndex="name" />
                    <ProDescriptions.Item label="账号" dataIndex="account" />
                    <ProDescriptions.Item
                        label="性别"
                        dataIndex="gender"
                        valueEnum={{
                            1: { text: '男' },
                            0: { text: '女' },
                        }}
                    />
                    <ProDescriptions.Item
                        label="年龄"
                        render={() => calcAge(data?.birth)}
                    />
                    <ProDescriptions.Item label="等级" dataIndex="level" />
                    <ProDescriptions.Item label="邮箱" dataIndex="email" />
                    <ProDescriptions.Item label="手机" dataIndex="phone" />

                    <ProDescriptions.Item label="电报账号" dataIndex="tg" />
                    <ProDescriptions.Item label="城市" dataIndex="city" />
                    <ProDescriptions.Item
                        label="机器人"
                        render={() => (data?.isBot ? '是' : '否')}
                    />
                    <ProDescriptions.Item
                        label="状态"
                        dataIndex="status"
                        valueEnum={{
                            0: { text: '禁用', status: 'Error' },
                            1: { text: '正常', status: 'Success' },
                        }}
                    />
                    <ProDescriptions.Item label="余额" dataIndex="balance" />
                    <ProDescriptions.Item label="地址" dataIndex="address" />
                    <ProDescriptions.Item label="IP" dataIndex="ip" />
                    <ProDescriptions.Item label="修改人" dataIndex="updateName" />
                    <ProDescriptions.Item label="修改时间" dataIndex="updateTime" />
                    <ProDescriptions.Item label="创建时间" dataIndex="createTime" />
                </ProDescriptions>
            </Card>

            <Card title="自我介绍" style={{ marginTop: 10 }}>
                <ProDescriptions<Member>
                    loading={loading}
                    dataSource={data}
                    column={1}
                >

                    <ProDescriptions.Item label="">
                        <Typography.Paragraph
                            style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
                            ellipsis={{ rows: 4, expandable: true, symbol: '展开' }} // ✅ 4行
                        >
                            {data?.selfIntroduction || '-'}
                        </Typography.Paragraph>
                    </ProDescriptions.Item>

                </ProDescriptions>
            </Card>
        </>

    );
};

export default Detail;
