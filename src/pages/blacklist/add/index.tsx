import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { message,Button } from 'antd';
import { history } from '@umijs/max';
import { addBlacklist } from '@/services/blacklist';

const BlacklistAdd = () => {
    const handleFinish = async (values: any) => {
        const res = await addBlacklist(values);
        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/blacklist/list');
            return true;
        }
        return false;
    };

    return (
        <PageContainer title="新增黑名单">
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
                                onClick={() => history.push('/blacklist/list')}
                            >
                                取消
                            </Button>,
                            doms[1], // 提交按钮
                        ];
                    },
                }}
            >
                <ProFormText
                    width="md"
                    name="ip"
                    label="ip地址"
                />

                <ProFormText
                    width="md"
                    name="phone"
                    label="手机号"
                />

                <ProFormText
                    width="md"
                    name="device"
                    label="终端编码"
                />

                <ProFormText
                    width="md"
                    name="remarks"
                    label="备注"
                />

            </ProForm>
        </PageContainer>
    );
};

export default BlacklistAdd;