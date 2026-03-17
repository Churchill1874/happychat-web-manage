import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getExposureDetail } from '@/services/exposure';
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
import { update } from '@/services/exposure';
import { getImgUrl } from '@/utils/tools';
export interface ExposureType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    title: string;
    content: string;
    isTop: string;
    image1: string;
    username1: string;
    sound1: string;

    image2: string;
    username2: string;
    sound2: string;

    image3: string;
    username3: string;
    sound3: string;

    image4: string;
    username4: string;
    sound4: string;

    image5: string;
    username5: string;
    sound5: string;

    image6: string;
    username6: string;
    sound6: string;

    viewsCount: number;
    level: string;
    address: string;
    createTime: string;
    createName?: string;
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ExposureType>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef<ProFormInstance | null>(null);


    const detailReq = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await getExposureDetail({ id });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!editMode || !data) return;

        formRef.current?.setFieldsValue({
            ...data,
            isTop: data.isTop?.toString(),
        });
    }, [editMode, data]);



    useEffect(() => {
        detailReq();
    }, [id])

    const uploadFile = async (accept: string) => {
        return new Promise<string | undefined>((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;

            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return resolve(undefined);

                const formData = new FormData();
                formData.append("file", file);

                const resp = await request<string>('/api/manage/tools/upload', {
                    method: 'POST',
                    data: formData,
                });

                resolve(resp.data);
            };

            input.click();
        });
    };

    return (
        <>
            <Card
                title="曝光详情"
                extra={
                    <Space>
                        <Button
                            onClick={() => history.push('/news/exposure/list')}
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

                        {/* ====== 基本信息 ====== */}
                        <Card>
                            <ProDescriptions<ExposureType>
                                loading={loading}
                                dataSource={data}
                                column={4}
                            >
                                {/*  <ProDescriptions.Item label="ID" dataIndex="id" /> */}
                                <ProDescriptions.Item label="标题" dataIndex="title" />

                                <ProDescriptions.Item
                                    label="是否置顶"
                                    dataIndex="isTop"
                                    valueEnum={{
                                        false: { text: '否' },
                                        true: { text: '是' },
                                    }}
                                />

                                <ProDescriptions.Item label="浏览数" dataIndex="viewsCount" />
                                <ProDescriptions.Item label="等级" dataIndex="level" />
                                <ProDescriptions.Item label="区域" dataIndex="address" />
                                <ProDescriptions.Item label="创建时间" dataIndex="createName" />
                                <ProDescriptions.Item label="创建时间" dataIndex="createTime" />

                            </ProDescriptions>
                        </Card>

                        {/* ====== 内容 ====== */}
                        <Card style={{ marginTop: 10 }} >
                            <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                {data?.content || '-'}
                            </Typography.Paragraph>
                        </Card>

                        <Card style={{ marginTop: 10 }} title="人物信息">
                            <div className="person-container">

                                {[1, 2, 3, 4, 5, 6].map((i) => {
                                    const img = data?.[`image${i}` as keyof ExposureType];
                                    const name = data?.[`username${i}` as keyof ExposureType];
                                    //const sound = data?.[`sound${i}` as keyof ExposureType];

                                    return (
                                        <div className="person-item">
                                            {img ? (
                                                <Image
                                                    src={getImgUrl(img as string)}
                                                    width={100}
                                                    height={100}
                                                    style={{ objectFit: 'cover', borderRadius: 6 }}
                                                />
                                            ) : (
                                                <div className="img-box">无图片</div>
                                            )}

                                            <div>姓名：{name || '-'}</div>
                                        </div>
                                    );
                                })}

                            </div>
                        </Card>



                    </>

                )}


                {editMode && (
                    <ProForm<ExposureType>
                        formRef={formRef}
                        onFinish={async (values) => {
                            await update({ ...values, id });
                            message.success('保存成功');
                            await detailReq();
                            setEditMode(false);
                        }}
                    >
                        {/* 标题 */}
                        <Card>
                            <ProFormText
                                name="title"
                                label="标题"
                                rules={[{ required: true }]}
                            />
                        </Card>

                        {/* 内容 */}

                        <Card style={{ marginTop: 10 }}>

                            <ProForm.Group colProps={{ span: 24 }}>
                                <ProFormSelect
                                    name="isTop"
                                    label="是否置顶"
                                    rules={[{ required: true }]}
                                    valueEnum={{
                                        false: '否',
                                        true: '是'
                                    }}
                                />

                                <ProFormSelect
                                    name="level"
                                    rules={[{ required: true }]}
                                    label="等级"
                                    valueEnum={{
                                        1: '1',
                                        2: '2',
                                        3: '3'
                                    }}
                                />

                                <ProFormText
                                    name="address"
                                    rules={[{ required: true }]}
                                    label="区域"
                                />

                                <ProFormText
                                    name="viewsCount"
                                    rules={[{ required: true }]}
                                    label="浏览数"
                                />

                            </ProForm.Group>

                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProFormTextArea
                                name="content"
                                label="内容"
                                fieldProps={{ autoSize: { minRows: 6 } }}
                            />
                        </Card>

                        {/* 六组数据 */}
                        <Card style={{ marginTop: 10 }} title="人物信息">

                            {[1, 2, 3, 4, 5, 6].map((i) => {

                                const imageKey = `image${i}`;
                                const nameKey = `username${i}`;

                                return (
                                    <div key={i} className="person-row">

                                        {/* 隐藏字段 */}
                                        <ProFormText name={imageKey} hidden />
                                        <ProFormText name={nameKey} hidden />

                                        {/* 姓名 */}
                                        <div className="person-name">
                                            <ProFormText
                                                name={nameKey}
                                                fieldProps={{ style: { width: 160 } }}
                                            />
                                        </div>

                                        {/* 图片 */}
                                        <div className="person-upload">

                                            <ProForm.Item shouldUpdate style={{ marginBottom: 0 }}>
                                                {() => {
                                                    const img = formRef.current?.getFieldValue(imageKey);
                                                    return img ? (
                                                        <div className="img-box">
                                                            <img src={getImgUrl(img)} />
                                                            <div
                                                                className="img-delete"
                                                                onClick={() => {
                                                                    formRef.current?.setFieldValue(imageKey, undefined);
                                                                }}
                                                            >
                                                                ×
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                }}
                                            </ProForm.Item>

                                            <div
                                                className="upload-btn-exposure"
                                                onClick={async () => {
                                                    const url = await uploadFile('image/*');
                                                    if (!url) return;

                                                    formRef.current?.setFieldValue(imageKey, url);
                                                }}
                                            >
                                                上传图片
                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </Card>
                    </ProForm>
                )}
            </Card>

        </>

    );
};

export default Detail;
