import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getTopicDetail, update } from '@/services/topic';
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

export interface TopicType {
    id: string; // Long → string（后端用了 ToStringSerializer）
    type: string;
    content: string;
    imagePath: string;
    viewCount: string;
    commentsCount: string;
    isTop: string;
    isHot: string;
    videoPath: string;
    videoCover: string;
    status: string;
    title: string;
    createTime: string;
    createName?: string;
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<TopicType>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const formRef = useRef<ProFormInstance | null>(null);
    const images = data?.imagePath?.split('|').filter(Boolean) || [];
    const [imageList, setImageList] = useState<string[]>([]);
    const [videoCover, setVideoCover] = useState<string>();
    const [videoPath, setVideoPath] = useState<string>();

    const showVideoCover = videoCover || data?.videoCover;
    const showVideoPath = videoPath || data?.videoPath;

    const detailReq = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await getTopicDetail({ id });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        if (!editMode || !data) return;

        formRef.current?.setFieldsValue({
            ...data,
            status: data.status?.toString(),
            isTop: data.isTop?.toString(),
            isHot: data.isHot?.toString()
        });

    }, [editMode, data]);

    useEffect(() => {
        detailReq();
    }, [id])

    useEffect(() => {
        if (data?.imagePath) {
            setImageList(data.imagePath.split('|').filter(Boolean));
        }
    }, [data]);

    const handleUploadVideo = async () => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.onchange = async () => {

            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const resp = await request<string>('/api/manage/tools/upload', {
                method: 'POST',
                data: formData,
            });

            setVideoPath(resp.data);

            message.success("视频上传成功");
        };

        input.click();
    };


    const handleUploadVideoCover = async () => {

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

            setVideoCover(resp.data);

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
                title="话题详情"
                extra={
                    <Space>
                        <Button
                            onClick={() => history.push('/news/topic/list')}
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
                            <ProDescriptions<TopicType>
                                loading={loading}
                                dataSource={data}
                                column={16}
                            >
                                <ProDescriptions.Item label="ID" dataIndex="id" />
                                <ProDescriptions.Item label="标题" dataIndex="title" style={{ fontWeight: "bold" }} />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProDescriptions<TopicType>
                                loading={loading}
                                dataSource={data}
                                column={5}
                            >
                                <ProDescriptions.Item label="类型" dataIndex="type" />
                                <ProDescriptions.Item label="评论数量" dataIndex="commentsCount" />
                                <ProDescriptions.Item label="浏览次数" dataIndex="viewCount" />
                                <ProDescriptions.Item
                                    label="状态"
                                    dataIndex="status"
                                    valueEnum={{
                                        false: { text: '不显示', status: 'Error' },
                                        true: { text: '显示', status: 'Success' },
                                    }}
                                />

                                <ProDescriptions.Item
                                    label="置顶"
                                    dataIndex="isTop"
                                    valueEnum={{
                                        false: { text: '否', status: 'Error' },
                                        true: { text: '是', status: 'Success' },
                                    }}
                                />
                                <ProDescriptions.Item
                                    label="热门"
                                    dataIndex="isHot"
                                    valueEnum={{
                                        false: { text: '否', status: 'Error' },
                                        true: { text: '是', status: 'Success' },
                                    }}
                                />

                                <ProDescriptions.Item label="创建人" dataIndex="createName" />
                                <ProDescriptions.Item label="创建时间" dataIndex="createTime" />
                            </ProDescriptions>
                        </Card>



                        <Card style={{ marginTop: 10 }}>

                            <div className="section-title">图片与内容</div>

                            <div className="detail-container">
                                <div className="detail-left">
                                    {images.length > 0 ? (
                                        images.map((img, index) => (
                                            <div key={index} className="detail-img">
                                                <Image
                                                    style={{ padding: '10px 70px' }}
                                                    src={getImgUrl(img)}
                                                    alt='' />
                                            </div>
                                        ))
                                    ) : (
                                        '无图片'
                                    )}
                                </div>

                                <div className="detail-right">
                                    <Typography.Paragraph
                                        style={{ whiteSpace: 'pre-wrap', marginBottom: 0, padding: 0 }}
                                    >
                                        {data?.content || '-'}
                                    </Typography.Paragraph>
                                </div>

                            </div>
                        </Card>

                        <Card style={{ marginTop: 10 }}>

                            <div className="detail-container">

                                {/* 左侧封面 */}
                                <div className="detail-left">

                                    <div className="media-title">封面图片</div>


                                    {data?.videoCover ? (
                                        <Image
                                            src={data.videoCover}
                                            style={{ width: 300 }}
                                        />
                                    ) : (
                                        '暂无封面'
                                    )}

                                </div>

                                {/* 右侧视频 */}
                                <div className="detail-right">

                                    <div className="media-title">视频</div>

                                    {data?.videoPath ? (
                                        <video
                                            src={data.videoPath}
                                            controls
                                            style={{ width: "100%", maxWidth: 300 }}
                                        />
                                    ) : (
                                        '暂无视频'
                                    )}

                                </div>

                            </div>

                        </Card>



                    </>

                )}


                {editMode && (
                    <ProForm<TopicType>
                        formRef={formRef}
                        submitter={{
                            searchConfig: {
                                submitText: '保存',
                            },
                        }}
                        onFinish={async (values) => {
                            if (!id) {
                                message.error('参数错误,缺少话题ID');
                                return;
                            }

                            const imagePath = imageList.join('|');

                            const submitData = {
                                ...values,
                                id,
                                imagePath,
                                videoCover: videoCover ?? data?.videoCover,
                                videoPath: videoPath ?? data?.videoPath
                            };

                            console.log(submitData);

                            await update(submitData);

                            message.success('保存成功');

                            await detailReq();

                            setEditMode(false);
                        }}
                    >

                        <Card >
                            <ProForm.Group colProps={{ span: 24 }}>
                                <ProFormText
                                    name="title"
                                    label="标题"
                                    width="lg"
                                    rules={[
                                        { required: true, message: '请输入标题' },
                                        { min: 1, max: 30, message: "标题长度1-30位" },
                                    ]}
                                />
                            </ProForm.Group>
                        </Card>


                        {/* 基本信息 */}
                        <Card style={{ marginTop: 10 }}>

                            <ProForm.Group colProps={{ span: 4 }}>

                                <ProFormText
                                    name="type"
                                    label="类型"
                                    width="md"
                                />

                                <ProFormText
                                    name="viewCount"
                                    label="浏览次数"
                                    width="md"
                                />

                                <ProFormSelect
                                    name="status"
                                    label="状态"
                                    width="md"
                                    valueEnum={{
                                        false: '不显示',
                                        true: '显示'
                                    }}
                                />

                                <ProFormSelect
                                    name="isTop"
                                    label="置顶"
                                    width="md"
                                    valueEnum={{
                                        false: '否',
                                        true: '是'
                                    }}
                                />

                                <ProFormSelect
                                    name="isHot"
                                    label="热门"
                                    width="md"
                                    valueEnum={{
                                        false: '否',
                                        true: '是'
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
                                        name="content"
                                        fieldProps={{
                                            autoSize: { minRows: 10 },
                                        }}
                                    />
                                </div>

                            </div>
                        </Card>

                        <Card style={{ marginTop: 10 }}>

                            <div className="detail-container">

                                {/* 左侧：封面 */}
                                <div className="detail-left">

                                    <div className="media-title">封面图片</div>

                                    <div className="video-box">

                                        {showVideoCover ? (
                                            <Image
                                                src={showVideoCover}
                                                className="video-cover-img"
                                            />
                                        ) : (
                                            <div className="video-empty">暂无封面</div>
                                        )}

                                        <div className="video-btn-group">

                                            <Button onClick={handleUploadVideoCover}>
                                                上传封面
                                            </Button>

                                            {showVideoCover && (
                                                <Button
                                                    danger
                                                    onClick={() => {
                                                        setVideoCover('');
                                                        setData(prev => ({
                                                            ...prev!,
                                                            videoCover: ''
                                                        }));
                                                    }}
                                                >
                                                    清除
                                                </Button>
                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* 右侧：视频 */}
                                <div className="detail-right">

                                    <div className="media-title">视频</div>

                                    <div className="video-box">

                                        {showVideoPath ? (
                                            <video
                                                src={showVideoPath}
                                                controls
                                                className="video-player"
                                            />
                                        ) : (
                                            <div className="video-empty">暂无视频</div>
                                        )}

                                        <div className="video-btn-group">

                                            <Button onClick={handleUploadVideo}>
                                                上传视频
                                            </Button>

                                            {showVideoPath && (
                                                <Button
                                                    danger
                                                    onClick={() => {
                                                        setVideoPath('');
                                                        setData(prev => ({
                                                            ...prev!,
                                                            videoPath: ''
                                                        }));
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

                    </ProForm>
                )}
            </Card>

        </>

    );
};

export default Detail;
