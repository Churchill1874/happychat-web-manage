import { useParams, history } from '@umijs/max';
import { useEffect, useState, useRef } from 'react';
import { getCompanyDetail, update, addEvent, updateEvent, deleteEvent } from '@/services/company';

import {
    ProDescriptions,
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormDatePicker,
    ProFormInstance
} from '@ant-design/pro-components';

import { Card, Typography, message, Button, Space, Timeline, Image } from 'antd';
import './index.less';
import { request } from '@/utils/request';
import { getImgUrl } from '@/utils/tools';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

export interface EventType {
    id: string;
    companyId: string;
    image: string;
    description: string;
    createTime: string;
    eventDate: string;
}

export interface CompanyType {
    id: string;
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
    companyEventList: EventType[];
}

const Detail = () => {
    const { id } = useParams<{ id: string }>();

    const [data, setData] = useState<CompanyType>();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [eventMode, setEventMode] = useState(false);

    const [imageList, setImageList] = useState<string[]>([]);
    const [newEvent, setNewEvent] = useState<any | null>(null);

    /** ⭐ 新增：事件编辑缓存 */
    const [eventEditMap, setEventEditMap] = useState<Record<string, any>>({});

    const formRef = useRef<ProFormInstance | null>(null);

    const images = data?.image?.split('||').filter(Boolean) || [];

    const detailReq = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getCompanyDetail({ id });
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detailReq();
    }, [id]);

    useEffect(() => {
        if (data?.image) {
            setImageList(data.image.split('||'));
        }
    }, [data]);

    useEffect(() => {
        if (!editMode || !data) return;
        formRef.current?.setFieldsValue({ ...data });
    }, [editMode, data]);

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
                        <Button onClick={() => history.push('/news/company/list')}>
                            返回
                        </Button>

                        {editMode ? (
                            <Button onClick={() => setEditMode(false)}>取消</Button>
                        ) : (
                            <Button type="primary" onClick={() => setEditMode(true)}>
                                修改
                            </Button>
                        )}
                    </Space>
                }
            >

                {/* ================= 展示 ================= */}
                {!editMode && !eventMode && (
                    <>
                        <Card>
                            <ProDescriptions dataSource={data} column={8}>
                                <ProDescriptions.Item label="ID" dataIndex="id" />
                                <ProDescriptions.Item label="名字" dataIndex="name" />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <ProDescriptions dataSource={data} column={5}>
                                <ProDescriptions.Item label="城市" dataIndex="city" />
                                <ProDescriptions.Item label="规模" dataIndex="teamScale" />
                                <ProDescriptions.Item label="薪资" dataIndex="salaryRange" />
                                <ProDescriptions.Item label="领导" dataIndex="leadershipCharacter" />
                                <ProDescriptions.Item label="加班" dataIndex="overtimeCompensation" />
                                <ProDescriptions.Item label="办公环境" dataIndex="officeEnvironment" />
                                <ProDescriptions.Item label="奖金" dataIndex="bonus" />
                                <ProDescriptions.Item label="住宿" dataIndex="live" />
                                <ProDescriptions.Item label="休假" dataIndex="holiday" />
                            </ProDescriptions>
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <div className="detail-container">
                                <div className="detail-left">
                                    {images.map((img, i) => (
                                        <Image key={i} src={getImgUrl(img)} />
                                    ))}
                                </div>

                                <div className="detail-right">
                                    <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                        {data?.description}
                                    </Typography.Paragraph>
                                </div>
                            </div>
                        </Card>

                        {/* ✅ 事件入口 */}
                        <Card
                            style={{ marginTop: 10 }}
                            title="事件信息"
                            extra={
                                <Button
                                    type="primary"
                                    onClick={() => setEventMode(true)}>
                                    事件
                                </Button>
                            }
                        >
                            <Timeline>
                                {data?.companyEventList?.map((item) => (
                                    <Timeline.Item key={item.id}>
                                        <div>{item.eventDate}</div>
                                        <div>{item.description}</div>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </>
                )}

                {/* ================= 编辑 ================= */}
                {editMode && (
                    <ProForm
                        formRef={formRef}
                        onFinish={async (values) => {
                            await update({
                                ...values,
                                id,
                                image: imageList.join('||'),
                            });
                            message.success('保存成功');
                            setEditMode(false);
                            detailReq();
                        }}
                    >
                        <Card style={{ marginTop: 10 }}>
                            <ProFormText name="name" label="名字" />
                            <ProFormText name="city" label="城市" />
                            <ProFormText name="teamScale" label="规模" />
                            <ProFormText name="salaryRange" label="薪资" />
                            <ProFormText name="leadershipCharacter" label="领导风格" />
                            <ProFormText name="overtimeCompensation" label="加班补偿" />
                            <ProFormText name="officeEnvironment" label="办公环境" />
                            <ProFormText name="bonus" label="奖金" />
                            <ProFormText name="live" label="住宿" />
                            <ProFormText name="holiday" label="休假" />
                        </Card>

                        <Card style={{ marginTop: 10 }}>
                            <div className="detail-container">
                                <div className="detail-left">
                                    {imageList.map((img, i) => (
                                        <div key={i} style={{ position: 'relative', width: 'calc(50% - 10px)' }}>
                                            <Image src={getImgUrl(img)} style={{ width: '100%', borderRadius: 6 }} />
                                            <span
                                                className="img-delete"
                                                style={{ top: -6, right: -6 }}
                                                onClick={() => setImageList(prev => prev.filter((_, idx) => idx !== i))}
                                            >
                                                ×
                                            </span>
                                        </div>
                                    ))}
                                    <div className="upload-btn" onClick={handleUpload}>+</div>
                                </div>

                                <div className="detail-right">
                                    <ProFormTextArea name="description" label="公司描述" fieldProps={{ rows: 15 }} />
                                </div>
                            </div>
                        </Card>
                    </ProForm>
                )}


                {/* ================= ⭐ 事件管理 ================= */}
                {eventMode && (
                    <Card
                        title="事件管理"
                        style={{ marginTop: 10 }}
                        extra={
                            <Button
                                type="primary"
                                onClick={() => setEventMode(false)}>
                                返回
                            </Button>
                        }
                    >
                        <Button
                            type="primary"
                            style={{ marginBottom: 16 }}
                            onClick={() => setNewEvent({ eventDate: '', description: '' })}
                        >
                            新增事件
                        </Button>

                        {/* 新增 */}
                        {newEvent && (
                            <Card size="small" style={{ marginBottom: 12 }}>
                                <ProFormDatePicker
                                    fieldProps={{
                                        onChange: (d: any) => {
                                            setNewEvent({ ...newEvent, eventDate: d?.format('YYYY-MM-DD') });
                                        }
                                    }}
                                />
                                <ProFormTextArea
                                    fieldProps={{
                                        onChange: (e) => {
                                            setNewEvent({ ...newEvent, description: e.target.value });
                                        }
                                    }}
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            await addEvent({ ...newEvent, companyId: id });
                                            message.success('新增成功');
                                            setNewEvent(null);
                                            detailReq();
                                        }}
                                    >
                                        保存
                                    </Button>

                                    <Button onClick={() => setNewEvent(null)}>
                                        取消
                                    </Button>
                                </Space>
                            </Card>
                        )}

                        {/* 列表 */}
                        {data?.companyEventList?.map((item) => (
                            <Card key={item.id} size="small" style={{ marginBottom: 12 }}>
                                <ProFormDatePicker
                                    fieldProps={{
                                        value: dayjs(eventEditMap[item.id]?.eventDate || item.eventDate),
                                        onChange: (d: any) => {
                                            setEventEditMap(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                    ...prev[item.id],
                                                    eventDate: d?.format('YYYY-MM-DD')
                                                }
                                            }));
                                        }
                                    }}
                                />

                                <ProFormTextArea
                                    fieldProps={{
                                        value: eventEditMap[item.id]?.description || item.description,
                                        onChange: (e) => {
                                            setEventEditMap(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                    ...prev[item.id],
                                                    description: e.target.value
                                                }
                                            }));
                                        }
                                    }}
                                />

                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            await updateEvent({
                                                ...item,
                                                ...eventEditMap[item.id]
                                            });
                                            message.success('修改成功');
                                            detailReq();
                                        }}
                                    >
                                        保存
                                    </Button>

                                    <Button
                                        danger
                                        onClick={async () => {
                                            if (!confirm('确定删除？')) return;
                                            await deleteEvent({ id: item.id });
                                            message.success('删除成功');
                                            detailReq();
                                        }}
                                    >
                                        删除
                                    </Button>
                                </Space>
                            </Card>
                        ))}
                    </Card>
                )}
            </Card>
        </>
    );
};

export default Detail;