import {
    PageContainer,
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormInstance
} from '@ant-design/pro-components';
import { message, Button, Card, Image } from 'antd';
import { history } from '@umijs/max';
import { addCompany } from '@/services/company';
import { useRef, useState } from 'react';
import { request } from '@/utils/request';
import './index.less';

const CompanyAdd = () => {
    const [imageList, setImageList] = useState<string[]>([]);

    const formRef = useRef<ProFormInstance | null>(null);

    /** ===== 上传工具（通用） ===== */
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

    /** ===== 提交 ===== */
    const handleFinish = async (values: any) => {

        const submitData = {
            ...values,
            image: imageList.join("||")
        };

        const res = await addCompany(submitData);

        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/news/company/list');
            return true;
        }

        return false;
    };

    return (
        <PageContainer title="新增公司新闻">

            <ProForm
                formRef={formRef}
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => [
                        doms[0],
                        <Button key="cancel" onClick={() => history.push('/news/company/list')}>
                            取消
                        </Button>,
                        doms[1],
                    ],
                }}
            >

                {/* ===== 标题 ===== */}
                <Card>
                    <ProFormText
                        name="name"
                        label="公司名"
                        width="lg"
                        rules={[
                            { required: true },
                            { min: 1, max: 40 }
                        ]}
                    />
                </Card>

                <Card style={{ marginTop: 10 }}>

                    <ProForm.Group colProps={{ span: 24 }}>
                        <ProFormText
                            name="city"
                            label="所在城市"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="teamScale"
                            label="团队规模"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="holiday"
                            label="休假制度"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="salaryRange"
                            label="薪资范围"
                            width="sm"
                            rules={[{ required: true }]}
                        />


                        <ProFormText
                            name="leadershipCharacter"
                            label="领导性格"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="live"
                            label="居住制度"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="officeEnvironment"
                            label="办公环境"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="overtimeCompensation"
                            label="加班补偿"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="bonus"
                            label="奖金制度"
                            width="sm"
                            rules={[{ required: true }]}
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
                                name="description"
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

export default CompanyAdd;