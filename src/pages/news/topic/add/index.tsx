import { PageContainer, ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { message, Button, Card, Image } from 'antd';
import { history } from '@umijs/max';
import { addTopic } from '@/services/topic';
import { useState } from 'react';
import { request } from '@/utils/request';
import './index.less';
import { getImgUrl } from '@/utils/tools';

const TopicAdd = () => {

    const [imageList, setImageList] = useState<string[]>([]);
    const [videoCover, setVideoCover] = useState<string>();
    const [videoPath, setVideoPath] = useState<string>();

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

    const handleFinish = async (values: any) => {

        const imagePath = imageList.join('|');

        const submitData = {
            ...values,
            imagePath,
            videoCover,
            videoPath
        };

        const res = await addTopic(submitData);

        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/news/topic/list');
            return true;
        }

        return false;
    };

    return (
        <PageContainer title="新增话题新闻">

            <ProForm
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => {
                        return [
                            doms[0],
                            <Button
                                key="cancel"
                                onClick={() => history.push('/news/topic/list')}
                            >
                                取消
                            </Button>,
                            doms[1],
                        ];
                    },
                }}
            >

                {/* 标题 */}
                <Card>
                    <ProForm.Group colProps={{ span: 24 }}>
                        <ProFormText
                            name="title"
                            label="标题"
                            width="lg"
                            rules={[
                                { required: true, message: '请输入标题' },
                                { min: 1, max: 50, message: "标题长度1-50位" },
                            ]}
                        />
                    </ProForm.Group>
                </Card>


                {/* 基本信息 */}
                <Card style={{ marginTop: 10 }}>

                    <ProForm.Group colProps={{ span: 24 }}>

                        <ProFormText
                            name="type"
                            label="类型"
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
                            name="isTop"
                            label="置顶"
                            width="md"
                            rules={[{ required: true }]}
                            valueEnum={{
                                false: '否',
                                true: '是'
                            }}
                        />

                        <ProFormSelect
                            name="isHot"
                            label="热门"
                            width="md"
                            rules={[{ required: true }]}
                            valueEnum={{
                                false: '否',
                                true: '是'
                            }}
                        />

                    </ProForm.Group>

                </Card>


                {/* 图片 + 内容 */}
                <Card style={{ marginTop: 10 }}>

                    <div className="section-title">图片与内容</div>

                    <div className="detail-container">

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

                            <div className="upload-btn" onClick={handleUpload}>
                                +
                            </div>

                        </div>


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


                {/* 媒体 */}
                <Card style={{ marginTop: 10 }}>

                    <div className="detail-container">

                        {/* 封面 */}
                        <div className="detail-left">

                            <div className="media-title">封面图片</div>

                            <div className="video-box">

                                {videoCover ? (
                                    <Image
                                        src={videoCover}
                                        className="video-cover-img"
                                    />
                                ) : (
                                    <div className="video-empty">暂无封面</div>
                                )}

                                <div className="video-btn-group">

                                    <Button onClick={handleUploadVideoCover}>
                                        上传封面
                                    </Button>

                                    {videoCover && (
                                        <Button
                                            danger
                                            onClick={() => setVideoCover('')}
                                        >
                                            清除
                                        </Button>
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* 视频 */}
                        <div className="detail-right">

                            <div className="media-title">视频</div>

                            <div className="video-box">

                                {videoPath ? (
                                    <video
                                        src={videoPath}
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

                                    {videoPath && (
                                        <Button
                                            danger
                                            onClick={() => setVideoPath('')}
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

        </PageContainer>
    );
};

export default TopicAdd;