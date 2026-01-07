import { Table } from 'antd';
import './index.less';

const MemberManagement: React.FC = () => {
    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '老二',
            age: 42,
            address: '西湖区湖底公园2号',
        },
    ];

    const columns = [
        {
            title: '昵称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '生日',
            dataIndex: 'birth',
            key: 'birth',
        },
        {
            title: '等级',
            dataIndex: 'level',
            key: 'level',
        },
        {
            title: '机器人',
            dataIndex: 'isBot',
            key: 'isBot',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '阵营',
            dataIndex: 'campType',
            key: 'campType',
        }
    ];


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />
        </div>);
}

export default MemberManagement;