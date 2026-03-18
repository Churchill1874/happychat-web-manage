import {
    PageContainer,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormInstance
} from '@ant-design/pro-components';
import { message, Button, Card, Image } from 'antd';
import { history } from '@umijs/max';
import { addExposure } from '@/services/exposure';
import { useRef, useState } from 'react';
import { request } from '@/utils/request';
import './index.less';

const ExposureAdd = () => {

    const formRef = useRef<ProFormInstance | null>(null);

    /** ===== 上传工具（通用） ===== */
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

    /** ===== 提交 ===== */
    const handleFinish = async (values: any) => {

        const submitData = {
            ...values,
            isTop: Number(values.isTop),
        };

        const res = await addExposure(submitData);

        if (res?.code === 0) {
            message.success('新增成功');
            history.push('/news/exposure/list');
            return true;
        }

        return false;
    };

    return (
        <PageContainer title="新增曝光新闻">

            <ProForm
                formRef={formRef}
                onFinish={handleFinish}
                submitter={{
                    render: (props, doms) => [
                        doms[0],
                        <Button key="cancel" onClick={() => history.push('/news/exposure/list')}>
                            取消
                        </Button>,
                        doms[1],
                    ],
                }}
            >

                {/* ===== 标题 ===== */}
                <Card>
                    <ProFormText
                        name="title"
                        label="标题"
                        width="lg"
                        rules={[
                            { required: true },
                            { min: 1, max: 30 }
                        ]}
                    />

                </Card>

                <Card style={{ marginTop: 10 }}>

                    <ProForm.Group colProps={{ span: 24 }}>

                        <ProFormSelect
                            name="isTop"
                            label="是否置顶"
                            width="sm"
                            valueEnum={{
                                0: '否',
                                1: '是'
                            }}
                            rules={[{ required: true }]}
                        />

                        <ProFormSelect
                            name="level"
                            label="等级"
                            width="sm"
                            rules={[{ required: true }]}
                            valueEnum={{
                                1: '一级',
                                2: '二级',
                                3: '三级',
                            }}
                        />

                        <ProFormText
                            name="address"
                            label="区域"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                        <ProFormText
                            name="viewsCount"
                            label="浏览数量"
                            width="sm"
                            rules={[{ required: true }]}
                        />

                    </ProForm.Group>

                </Card>

                {/* ===== 内容 ===== */}
                <Card style={{ marginTop: 10 }}>
                    <ProFormTextArea
                        name="content"
                        label="内容"
                        fieldProps={{ autoSize: { minRows: 6 } }}
                    />
                </Card>

                {/* ===== 六组人物 ===== */}
                <Card style={{ marginTop: 10 }} title="人物信息">

                    {[1, 2, 3, 4, 5, 6].map((i) => {

                        const imageKey = `image${i}`;
                        const soundKey = `sound${i}`;
                        const nameKey = `username${i}`;

                        return (
                            <div key={i} className="person-row">

                                {/* 姓名 */}
                                <div className="person-col">

                                    <div className="upload-title">姓名{i}</div>

                                    <ProFormText
                                        name={nameKey}
                                        width="sm"
                                        fieldProps={{
                                            style: { width: 160 }   // ⭐️ 关键
                                        }}
                                    />

                                </div>

                                {/* 图片 */}
                                <div className="person-col">
                                    <div className="upload-block">

                                        {/* ✅ 注册字段 */}
                                        <ProFormText name={imageKey} hidden />

                                        {/* 预览 */}
                                        <ProForm.Item shouldUpdate style={{ marginBottom: 0 }}>
                                            {() => {
                                                const img = formRef.current?.getFieldValue(imageKey);
                                                return img ? (
                                                    <div className="img-box">
                                                        <img src={img} />

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

                                {/* 语音 */}
                                {/*                                 <div className="person-col">
                                    <div className="upload-block">

                                        <ProForm.Item shouldUpdate style={{ marginBottom: 0 }}>
                                            {() => {
                                                const sound = formRef.current?.getFieldValue(soundKey);
                                                return sound ? (
                                                    <div className="audio-box">
                                                        <audio controls src={sound} />

                                                        <div
                                                            className="img-delete"
                                                            onClick={() => {
                                                                formRef.current?.setFieldValue(soundKey, undefined);
                                                            }}
                                                        >
                                                            ×
                                                        </div>
                                                    </div>
                                                ) : null;
                                            }}
                                        </ProForm.Item>

                                        <div
                                            className="upload-btn"
                                            onClick={async () => {
                                                const url = await uploadFile('audio/*');
                                                if (!url) return;

                                                formRef.current?.setFieldValue(soundKey, url);
                                            }}
                                        >
                                            上传语音
                                        </div>

                                    </div>
                                </div> */}

                            </div>
                        );
                    })}

                </Card>

            </ProForm>

        </PageContainer>
    );
};

export default ExposureAdd;