import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormTextArea, ProFormSwitch, ProDescriptions } from '@ant-design/pro-components';
import { message,Button } from 'antd';
import { history } from '@umijs/max';
import { addMember } from '@/services/member';

const MemberAdd = () => {
    const handleFinish = async (values: any) => {
        const res = await addMember(values);
        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/member/list');
            return true;
        }
        return false;
    };

    return (
        <PageContainer title="新增玩家">
            <ProForm
                grid
                colProps={{ span: 6 }}
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => {
                        return [
                            doms[0], // 重置按钮
                            <Button
                                key="cancel"
                                onClick={() => history.push('/member/list')}
                            >
                                取消
                            </Button>,
                            doms[1], // 提交按钮
                        ];
                    },
                }}
            >
                {/* 昵称 */}
                <ProFormText
                    width="md"
                    name="name"
                    label="昵称"
                    rules={[
                        { required: true, message: '请输入昵称' },
                        { min: 1, max: 15, message: '昵称长度 1-15 位' },
                    ]}
                />

                {/* 账号 */}
                <ProFormText
                    width="md"
                    name="account"
                    label="账号"
                    rules={[
                        { required: true, message: '请输入账号' },
                        { min: 4, max: 20, message: '账号长度 4-20 位' },
                        {
                            pattern: /^[A-Za-z0-9-]+$/,
                            message: '账号只能包含英文、数字和 -',
                        },
                    ]}
                />

                {/* 密码 */}
                <ProFormText.Password
                    width="md"
                    name="password"
                    label="密码"
                    rules={[
                        { required: true, message: '请输入密码' },
                        { min: 8, max: 20, message: '密码长度 8-20 位' },
                    ]}
                />

                {/* 手机 */}
                <ProFormText
                    width="md"
                    name="phone"
                    label="手机号"
                />

                {/* 邮箱 */}
                <ProFormText
                    width="md"
                    name="email"
                    label="邮箱"
                    rules={[{ type: 'email', message: '邮箱格式不正确' }]}
                />

                {/* 邮箱 */}
                <ProFormText
                    width="md"
                    name="tg"
                    label="电报"
                />

                {/* 城市 */}
                <ProFormText
                    width="md"
                    name="city"
                    label="城市"
                />

                {/* 生日 */}
                <ProFormDatePicker
                    width="md"
                    name="birth"
                    label="生日"
                    fieldProps={{ style: { width: '80%' } }}
                    rules={[
                        { required: true, message: '请输入生日' }
                    ]}
                />

                {/* 头像 */}
                <ProFormSelect
                    width="md"
                    name="avatarPath"
                    label="头像"
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
                        value: String(i),
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <img
                                    src={require(`@/assets/avatars/${i}.jpg`)}
                                    style={{ width: 30, height: 30, borderRadius: '20%' }}
                                />
                                头像{i}
                            </div>
                        )
                    }))}
                />


                {/* 性别 */}
                <ProFormSelect
                    width="md"
                    name="gender"
                    label="性别"
                    valueEnum={{
                        1: '男',
                        0: '女',
                    }}
                />

                {/* 等级 */}
                <ProFormSelect
                    width="md"
                    name="level"
                    label="等级"
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
                    }}
                />


                {/* 是否机器人 */}
                <ProFormSwitch
                    name="isBot"
                    label="是否机器人"
                    initialValue={true}
                    colProps={{ span: 24 }} // ✅ 单独一行
                />

                {/* 自我介绍（独占一行） */}
                <ProFormTextArea
                    name="selfIntroduction"
                    label="自我介绍"
                    colProps={{ span: 24 }} // ✅ 单独一行
                    fieldProps={{ rows: 4 }}
                />
            </ProForm>
        </PageContainer>
    );
};

export default MemberAdd;