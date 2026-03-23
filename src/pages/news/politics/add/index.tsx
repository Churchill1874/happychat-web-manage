import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { message, Button, Card, Image } from 'antd';
import { history } from '@umijs/max';
import { addPolitics } from '@/services/politics';
import { useState } from 'react';
import { request } from '@/utils/request';
import './index.less';

const TopicAdd = () => {
    const [imageList, setImageList] = useState<string[]>([]);

    const handleUpload = async () => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const resp = await request<string>('/api/manage/tools/upload', {
                method: 'POST',
                data: formData,
            });

            setImageList(prev => [...prev, resp.data]);
        };

        input.click();
    };

    const handleFinish = async (values: any) => {
        const imagePath = imageList.join('||');

        const submitData = {
            ...values,
            imagePath,
        };

        const res = await addPolitics(submitData);
        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/news/politics/list');
            return true;
        }
        return false;
    };

    return (
        <PageContainer title="新增东南亚新闻">
            <ProForm
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => {
                        return [
                            doms[0], // 重置按钮
                            <Button
                                key="cancel"
                                onClick={() => history.push('/news/politics/list')}
                            >
                                取消
                            </Button>,
                            doms[1], // 提交按钮
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


                {/* 基本信息 */}
                <Card style={{ marginTop: 10 }}>

                    <ProForm.Group colProps={{ span: 24 }}>

                        <ProFormText
                            name="source"
                            label="来源"
                            width="md"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="country"
                            label="国家"
                            width="md"
                            rules={[{ required: true }]}

                        />

                        <ProFormText
                            name="viewCount"
                            label="浏览次数"
                            width="md"
                            rules={[{ required: true }]}

                        />

                        <ProFormSelect
                            name="newsStatus"
                            label="新闻状态"
                            width="md"
                            rules={[{ required: true }]}

                            valueEnum={{
                                1: '普通',
                                2: '置顶',
                                3: '热门'
                            }}
                        />



                    </ProForm.Group>

                </Card>

                {/* 图片 + 内容 */}
                <Card style={{ marginTop: 10 }}>
                    <div className="detail-container">

                        {/* 左侧图片上传 */}
                        <div className="detail-left">

                            {imageList.map((img, index) => (
                                <div key={index} className="detail-img">
                                    <Image src={img} />
                                    <div
                                        className="img-delete"
                                        onClick={() => {
                                            setImageList(prev => prev.filter((_, i) => i !== index));
                                        }}
                                    >
                                        ×
                                    </div>
                                </div>

                            ))}


                            {/* 上传按钮 */}
                            <div className="upload-btn" onClick={handleUpload}>
                                +
                            </div>

                        </div>

                        {/* 右侧内容 */}
                        <div className="detail-right">
                            <ProFormTextArea
                                name="content"
                                fieldProps={{
                                    autoSize: { minRows: 10 },
                                }}
                            />
                        </div>

                    </div>
                </Card>
            </ProForm>
        </PageContainer>
    );
};

export default TopicAdd;