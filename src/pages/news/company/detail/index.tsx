import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getCompanyDetail, update } from '@/services/company';
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
import { Card, Typography, message, Button, Space, Image } from 'antd';
import './index.less';
import { request } from '@/utils/request';
import { getImgUrl } from '@/utils/tools';
export interface CompanyType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    name: string;
    city: string;
    image: string;
    description: string;
    teamScale: string;
    holiday: string;
    salaryRange: string;
    leadershipCharacter: string;
    live: string;
    officeEnvironment: string;
    overtimeCompensation: string;
    bonus: string;
    createTime: string;
    createName?: string;
    updateTime: string;
    updateName: string;
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<CompanyType>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef<ProFormInstance | null>(null);
    const images = data?.image?.split('||').filter(Boolean) || [];
    console.log(images)
    const [imageList, setImageList] = useState<string[]>([]);


    const detailReq = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await getCompanyDetail({ id });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        if (!editMode || !data) return;

        formRef.current?.setFieldsValue({
            ...data,
        });

    }, [editMode, data]);

    useEffect(() => {
        detailReq();
    }, [id])


    useEffect(() => {
        if (data?.image) {
            setImageList(data.image.split('||'));
        }
    }, [data]);


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

    return (
        <>
            <Card
                title="公司详情"
                extra={
                    <Space>
                        <Button
                            onClick={() => history.push('/news/company/list')}
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

                        <Card >
                            <ProDescriptions<CompanyType>
                                loading={loading}
                                dataSource={data}
                                column={8}
                            >
                                <ProDescriptions.Item label="ID" dataIndex="id" />
                                <ProDescriptions.Item label="名字" dataIndex="name" style={{ fontWeight: "bold" }} />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProDescriptions<CompanyType>
                                loading={loading}
                                dataSource={data}
                                column={5}
                            >
                                <ProDescriptions.Item label="所在城市" dataIndex="city" />
                                <ProDescriptions.Item label="团队规模" dataIndex="teamScale" />
                                <ProDescriptions.Item label="休假制度" dataIndex="holiday" />
                                <ProDescriptions.Item label="薪资范围" dataIndex="salaryRange" />
                                <ProDescriptions.Item label="领导特点" dataIndex="leadershipCharacter" />
                                <ProDescriptions.Item label="居住制度" dataIndex="live" />
                                <ProDescriptions.Item label="办公环境" dataIndex="officeEnvironment" />
                                <ProDescriptions.Item label="加班补偿" dataIndex="overtimeCompensation" />
                                <ProDescriptions.Item label="奖金制度" dataIndex="bonus" />
                                <ProDescriptions.Item label="创建人" dataIndex="createName" />
                                <ProDescriptions.Item label="创建时间" dataIndex="createTime" />
                                <ProDescriptions.Item label="修改人" dataIndex="updateName" />
                                <ProDescriptions.Item label="修改时间" dataIndex="updateTime" />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <div className="detail-container">

                                <div className="detail-left">
                                    {images.length > 0 ? (
                                        images.map((img, index) => (
                                            <div key={index} className="detail-img">
                                                <Image
                                                    src={getImgUrl(img)}
                                                    alt='' />
                                            </div>))
                                    ) : (
                                        '无图片'
                                    )}
                                </div>

                                <div className="detail-right">
                                    <Typography.Paragraph
                                        style={{ whiteSpace: 'pre-wrap', marginBottom: 0, padding: 0 }}
                                    >
                                        {data?.description || '-'}
                                    </Typography.Paragraph>
                                </div>

                            </div>
                        </Card>
                    </>

                )}


                {editMode && (
                    <ProForm<CompanyType>
                        formRef={formRef}
                        submitter={{
                            searchConfig: {
                                submitText: '保存',
                            },
                        }}
                        onFinish={async (values) => {
                            if (!id) {
                                message.error('参数错误,缺少g公司ID');
                                return;
                            }


                            const submitData = {
                                ...values,
                                id,
                                image: imageList.join('||'),
                            };

                            await update(submitData);
                            message.success('保存成功');
                            await detailReq();

                            setEditMode(false);
                        }}
                    >
                        {/* 标题 */}
                        <Card >
                            <ProForm.Group colProps={{ span: 24 }}>
                                <ProFormText
                                    name="name"
                                    label="名字"
                                    width="lg"
                                    rules={[
                                        { required: true, message: '请输入名字' },
                                        { min: 1, max: 40, message: "标题长度1-40位" },
                                    ]}
                                />
                            </ProForm.Group>
                        </Card>


                        {/* 基本信息 */}
                        <Card style={{ marginTop: 10 }}>

                            <ProForm.Group colProps={{ span: 4 }}>

                                <ProFormText
                                    name="city"
                                    label="城市"
                                    width="md"
                                />

                                <ProFormText
                                    name="teamScale"
                                    label="团队规模"
                                    width="md"
                                />

                                <ProFormText
                                    name="holiday"
                                    label="休假制度"
                                    width="md"
                                />

                                <ProFormText
                                    name="salarRange"
                                    label="薪资范围"
                                    width="md"
                                />

                                <ProFormText
                                    name="leadershipCharacter"
                                    label="领导性格"
                                    width="md"
                                />

                                <ProFormText
                                    name="live"
                                    label="居住"
                                    width="md"
                                />


                                <ProFormText
                                    name="officeEnvironment"
                                    label="办公环境"
                                    width="md"
                                />


                                <ProFormText
                                    name="overtimeCompensation"
                                    label="加班补偿"
                                    width="md"
                                />


                                <ProFormText
                                    name="bonus"
                                    label="奖金制度"
                                    width="md"
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

                                            <Image src={getImgUrl(img)} style={{ padding: 10 }} />

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
                )}
            </Card>

        </>

    );
};

export default Detail;
