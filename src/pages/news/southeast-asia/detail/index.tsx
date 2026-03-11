import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getMemberDetail, updateMember } from '@/services/member';
import {
    ProDescriptions,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormSwitch,
    ProFormTextArea,
    ProFormDatePicker,
    ProFormInstance
} from '@ant-design/pro-components';
import { Card, Typography, message, Button, Space } from 'antd';
import { calcAge } from '@/utils/date';
import './index.less';

export interface Member {
    id: string; // Long → string（后端用了 ToStringSerializer）
    name: string;
    account: string;
    password?: string; // ⚠️ 一般详情页/列表不会返回
    phone?: string;
    email?: string;
    gender: string;
    city?: string;
    /** yyyy-MM-dd */
    birth?: string;
    level: string;
    selfIntroduction?: string;
    isBot: boolean;
    status: string;
    avatarPath?: string;
    balance: string;
    tg?: string;
    address?: string;
    ip?: string;
    campType?: string;
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
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef<ProFormInstance | null>(null);

    useEffect(() => {
        if (!editMode || !data) return;

        formRef.current?.setFieldsValue({
            ...data,
            gender: data.gender?.toString(),
            status: data.status?.toString(),
            level: data.level?.toString(),
            //campType: data.campType?.toString(),
            avatarPath: data.avatarPath?.toString(),
        });

    }, [editMode, data]);

    useEffect(() => {
        if (!id) return;
        setLoading(true)
        getMemberDetail({ id })
            .then(res => { setData(res.data) })
            .finally(() => setLoading(false));
    }, [id])

    return (
        <>
            <Card
                title="用户详情"
                extra={
                    <Space>
                        <Button
                            onClick={() => history.push('/member/list')}
                        >
                            返回
                        </Button>

                        {editMode ? (
                            <Button onClick={() => setEditMode(false)}>
                                取消
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => setEditMode(true)}
                            >
                                修改
                            </Button>
                        )}
                    </Space>
                }

            >


                {!editMode && (
                    <>
                        <Card>
                            <ProDescriptions<Member>
                                loading={loading}
                                dataSource={data}
                                column={5}
                            >
                                <ProDescriptions.Item label="账号" dataIndex="account" />
                                <ProDescriptions.Item label="昵称" dataIndex="name" />

                                <ProDescriptions.Item label="头像">
                                    {data?.avatarPath ? (
                                        <img
                                            src={`/avatars/${data.avatarPath}.jpg`}
                                            style={{ width: 35, height: 35, borderRadius: '20%' }}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </ProDescriptions.Item>

                                <ProDescriptions.Item
                                    label="性别"
                                    dataIndex="gender"
                                    valueEnum={{
                                        1: { text: '男' },
                                        0: { text: '女' },
                                    }}
                                />
                                <ProDescriptions.Item label="等级" dataIndex="level" />
                                <ProDescriptions.Item
                                    label="年龄"
                                    render={() => calcAge(data?.birth)}
                                />

                                <ProDescriptions.Item label="邮箱" dataIndex="email" />
                                <ProDescriptions.Item label="手机" dataIndex="phone" />

                                <ProDescriptions.Item label="电报账号" dataIndex="tg" />
                                <ProDescriptions.Item label="城市" dataIndex="city" />
                                <ProDescriptions.Item
                                    label="机器人"
                                    render={() => (data?.isBot ? '是' : '否')}
                                />

                                <ProDescriptions.Item label="ip地址" dataIndex="address" />
                                <ProDescriptions.Item label="IP" dataIndex="ip" />
                                <ProDescriptions.Item
                                    label="状态"
                                    dataIndex="status"
                                    valueEnum={{
                                        0: { text: '禁用', status: 'Error' },
                                        1: { text: '正常', status: 'Success' },
                                    }}
                                />
                                {/*                                 <ProDescriptions.Item
                                    label="阵营"
                                    dataIndex="campType"
                                    valueEnum={{
                                        0: { text: '无', color: 'black' },
                                        1: { text: '红营', color: 'red' },
                                        2: { text: '蓝营', color: 'blue' }
                                    }}
                                /> */}
                                <ProDescriptions.Item label="余额" dataIndex="balance" />

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

                )}


                {editMode && (
                    <Card>
                        <ProForm<Member>
                            formRef={formRef}
                            grid
                            colProps={{ span: 6 }}
                            onFinish={async (values) => {

                                if (!id) {
                                    message.error('参数错误,缺少用户ID');
                                    return;
                                }

                                await updateMember({ ...values, id }); // ✅ 包含 id
                                setEditMode(false);
                                getMemberDetail({ id }).then(res => setData(res.data));
                            }}
                        >

                            <ProFormText
                                name="account"
                                label="账号"
                                rules={[
                                    { required: true, message: '请输入账号' },
                                    { min: 4, max: 20, message: "账号6-20位" },
                                    {
                                        pattern: /^[A-Za-z0-9-]+$/,
                                        message: '账号只能包含英文、数字和 -',
                                    },
                                ]}
                                width="md"
                                disabled={true}
                            />


                            <ProFormText
                                name="name"
                                label="昵称"
                                rules={[{
                                    required: true,
                                    message: '请输入昵称'
                                }]}
                                width="md"
                            />

                            <ProFormSelect
                                name="avatarPath"
                                label="头像"
                                width="md"
                                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
                                    value: String(i),
                                    label: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img
                                                src={`/avatars/${i}.jpg`}
                                                style={{ width: 35, height: 35, borderRadius: '20%' }}
                                            />
                                            头像{i}
                                        </div>
                                    )
                                }))}
                            />

                            <ProFormSelect
                                name="gender"
                                label="性别"
                                valueEnum={{
                                    1: '男',
                                    0: '女',
                                }}
                                width="md"
                            />

                            <ProFormSelect
                                label="等级"
                                name="level"
                                width="md"
                                valueEnum={{
                                    0: '0级',
                                    1: '1级',
                                    2: '2级',
                                    3: '3级',
                                    4: '4级',
                                    5: '5级',
                                    6: '6级',
                                    7: '7级',
                                    8: '8级',
                                    9: '9级',
                                    10: '10级',
                                    11: '11级',
                                }} />


                            <ProFormDatePicker
                                name="birth"
                                label="生日"
                                rules={[{ required: true }]}
                                width="md"
                            />

                            <ProFormText
                                name="email"
                                label="邮箱"
                                width="md"
                            />

                            <ProFormText
                                name="phone"
                                label="手机"
                                width="md"
                            />

                            <ProFormText
                                name="tg"
                                label="电报"
                                width="md"
                            />

                            <ProFormText
                                name="city"
                                label="城市"
                                width="md"
                            />


                            <ProFormText
                                name="address"
                                label="ip地址"
                                width="md"
                                disabled={true}
                            />

                            <ProFormText
                                name="ip"
                                label="ip"
                                width="md"
                                disabled={true}
                            />


                            <ProFormSelect
                                name="status"
                                label="状态"
                                width="md"
                                valueEnum={{
                                    0: '禁用',
                                    1: '正常'
                                }}
                            />



                            {/*                             <ProFormSelect
                                label="阵营"
                                name="campType"
                                width="md"
                                options={[
                                    { label: '无', value: '0' },
                                    { label: '红营', value: '1' },
                                    { label: '蓝营', value: '2' },
                                ]}

                            /> */}

                            <ProFormText label="余额" name="balance" width="md" />

                            <ProFormSwitch
                                name="isBot"
                                label="是否机器人"
                                width="md"
                                fieldProps={{
                                    checkedChildren: '是',
                                    unCheckedChildren: '否',
                                }}

                            />



                            <ProFormTextArea
                                name="selfIntroduction"
                                label="自我介绍"
                                colProps={{ span: 24 }}
                                fieldProps={{ rows: 4 }}
                            />
                        </ProForm>
                    </Card>
                )}
            </Card>

        </>

    );
};

export default Detail;
