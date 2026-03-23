import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getNewsDetail, update } from '@/services/news';
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
export interface NewsType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    title: string;
    content: string;
    filterContent: string;
    contentImagePath: string;
    country: string;
    source: string;
    category: string;
    viewCount: string;
    likesCount: string;
    commentsCount: string;
    newsStatus: string;
    url: string;
    photoPath: string;
    createTime: string;
    createName?: string;
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<NewsType>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef<ProFormInstance | null>(null);
    const images = data?.contentImagePath?.split('||').filter(Boolean) || [];
    console.log(images)
    const [imageList, setImageList] = useState<string[]>([]);
    const [photoPath, setPhotoPath] = useState<string>(); // ✅ 新增


    const detailReq = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await getNewsDetail({ id });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        if (!editMode || !data) return;

        formRef.current?.setFieldsValue({
            ...data,
            newsStatus: data.newsStatus?.toString(),
            category: data.category?.toString()
        });

    }, [editMode, data]);

    useEffect(() => {
        detailReq();
    }, [id])


    useEffect(() => {
        if (data?.contentImagePath) {
            setImageList(data.contentImagePath.split('||').filter(Boolean));
        }

        if (data?.photoPath) {
            setPhotoPath(data.photoPath);
        }
    }, [data]);

    const handleUploadCover = async () => {

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

            setPhotoPath(resp.data);
            message.success("封面上传成功");
        };

        input.click();
    };

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
                title="国内新闻详情"
                extra={
                    <Space>
                        <Button
                            onClick={() => history.push('/news/news/list')}
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
                            <ProDescriptions<NewsType>
                                loading={loading}
                                dataSource={data}
                                column={8}
                            >
                                <ProDescriptions.Item label="ID" dataIndex="id" />
                                <ProDescriptions.Item label="标题" dataIndex="title" style={{ fontWeight: "bold" }} />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProDescriptions<NewsType>
                                loading={loading}
                                dataSource={data}
                                column={5}
                            >
                                <ProDescriptions.Item label="来源" dataIndex="source" />
                                <ProDescriptions.Item label="评论数量" dataIndex="commentsCount" />
                                <ProDescriptions.Item label="浏览次数" dataIndex="viewCount" />
                                <ProDescriptions.Item label="点赞数量" dataIndex="likesCount" />
                                <ProDescriptions.Item
                                    label="类型"
                                    dataIndex="category"
                                    valueEnum={{
                                        1: { text: '新闻' },
                                        2: { text: '体育' },
                                        3: { text: '娱乐' },
                                        4: { text: '军事' },
                                        5: { text: '科技' },
                                        6: { text: '人情' },
                                        7: { text: '网友' }
                                    }}
                                />
                                <ProDescriptions.Item
                                    label="新闻状态"
                                    dataIndex="newsStatus"
                                    valueEnum={{
                                        1: { text: '普通' },
                                        2: { text: '置顶' },
                                        3: { text: '热门' }
                                    }}
                                />
                                <ProDescriptions.Item label="创建人" dataIndex="createName" />
                                <ProDescriptions.Item label="创建时间" dataIndex="createTime" />
                                <ProDescriptions.Item label="修改人" dataIndex="updateName" />
                                <ProDescriptions.Item label="修改时间" dataIndex="updateTime" />

                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProDescriptions<NewsType>
                                loading={loading}
                                dataSource={data}
                                column={5}
                            >

                                <ProDescriptions.Item label="源地址" dataIndex="url" />

                            </ProDescriptions>

                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <div>
                                <span style={{ fontWeight: 500 }}>封面图片：</span>
                            </div>

                            <div style={{ marginTop: 10 }}>
                                {data?.photoPath ? (
                                    <Image
                                        src={getImgUrl(data.photoPath)}
                                        width={200}
                                    />
                                ) : (
                                    <span>暂无封面</span>
                                )}
                            </div>
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
                                        {data?.filterContent || '-'}
                                    </Typography.Paragraph>
                                </div>

                            </div>
                        </Card>


                    </>

                )}


                {editMode && (
                    <ProForm<NewsType>
                        formRef={formRef}
                        submitter={{
                            searchConfig: {
                                submitText: '保存',
                            },
                        }}
                        onFinish={async (values) => {
                            if (!id) {
                                message.error('参数错误,缺少东南亚ID');
                                return;
                            }


                            const submitData = {
                                ...values,
                                id,
                                contentImagePath: imageList.join('||'), // 顺便帮你修正（你之前写错了）
                                photoPath, // ✅ 新增
                            };

                            console.log(submitData);

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

                            <ProForm.Group colProps={{ span: 4 }}>

                                <ProFormText
                                    name="source"
                                    label="来源"
                                    width="md"
                                />



                                <ProFormText
                                    name="viewCount"
                                    label="浏览次数"
                                    width="md"
                                />

                                <ProFormSelect
                                    name="newsStatus"
                                    label="新闻状态"
                                    width="md"
                                    valueEnum={{
                                        1: '普通',
                                        2: '置顶',
                                        3: '热门'
                                    }}
                                />

                                <ProFormSelect
                                    name="category"
                                    label="类型"
                                    width="md"
                                    valueEnum={{
                                        1: { text: '新闻' },
                                        2: { text: '体育' },
                                        3: { text: '娱乐' },
                                        4: { text: '军事' },
                                        5: { text: '科技' },
                                        6: { text: '人情' },
                                        7: { text: '网友' }
                                    }}
                                />

                                <ProFormText
                                    name="url"
                                    label="源地址"
                                    width="md"
                                />

                            </ProForm.Group>

                        </Card>

                        <Card style={{ marginTop: 10 }}>

                            <div className="detail-container">

                                {/* 左侧：封面 */}
                                <div className="detail-left">

                                    <div style={{ fontWeight: 500, marginBottom: 10 }}>
                                        封面图片
                                    </div>

                                    <div>
                                        {(photoPath ?? data?.photoPath) ? (
                                            <Image
                                                src={getImgUrl(photoPath ?? data?.photoPath)}
                                                style={{ width: 200 }}
                                            />
                                        ) : (
                                            <div>暂无封面</div>
                                        )}

                                        <div style={{ marginTop: 10 }}>

                                            <Button onClick={handleUploadCover}>
                                                上传封面
                                            </Button>

                                            {(photoPath ?? data?.photoPath) && (
                                                <Button
                                                    danger
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => {
                                                        setPhotoPath('');
                                                    }}
                                                >
                                                    清除
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                        name="filterContent"
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
