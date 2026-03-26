import { PageContainer, ProForm, ProFormText} from '@ant-design/pro-components';
import { message, Button, Card,Popconfirm } from 'antd';
import { history } from '@umijs/max';
import { deleteSystemMessage } from '@/services/systemmessage';
import './index.less';

const TopicAdd = () => {

    const handleFinish = async (values: any) => {

        const submitData = {
            ...values,
        };

        const res = await deleteSystemMessage(submitData);
        if (res?.code === 0) {
            message.success('删除成功');
            history.push('/system-message/list');
            return true;
        }
        return false;
    };

    return (
        <PageContainer title="删除公共系统消息">
            <ProForm
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => {
                        return [
                            doms[0], // 重置

                            <Button
                                key="cancel"
                                onClick={() => history.push('/system-message/list')}
                            >
                                取消
                            </Button>,

                            <Popconfirm
                                key="submitConfirm"
                                title="确认删除吗？"
                                description="删除后不可恢复"
                                okText="确认"
                                cancelText="取消"
                                onConfirm={() => {
                                    props.form?.submit(); // 👈 手动触发表单提交
                                }}
                            >
                                <Button type="primary" danger>
                                    提交
                                </Button>
                            </Popconfirm>,
                        ];
                    },
                }}
            >

                {/* 标题 */}
                <Card >
                    <ProForm.Group colProps={{ span: 24 }}>
                        <ProFormText
                            name="title"
                            label="标题"
                            width="lg"
                            rules={[
                                { required: true, message: '请输入标题' },
                                { min: 1, max: 40, message: "标题长度1-40位" },
                            ]}
                        />
                    </ProForm.Group>
                </Card>
            </ProForm>
        </PageContainer>
    );
};

export default TopicAdd;