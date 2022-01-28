import { Table, Space } from 'antd';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
const { useRouter } = require('next/router')

type Props = {
  data: {
    key: number,
    id: number,
    text: string,
    completed: boolean,
    createdAt: string,
    color: string
  }[]
}

const ToDoList: React.FC<Props> = ({ data }) => {
  const router = useRouter()

  const columns = [
    {
      title: '',
      dataIndex: 'completed',
      key: 'completed',
      render(id: boolean, record: { key: number; id: number; text: string; completed: boolean; createdAt: string; color: string; }) {
        if (record.completed) {
          return <FontAwesomeIcon icon={faCheck}/>
        }
      },
      width: 50
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render(id: { id: number }) {
        return {
          children: (
            <Space size="middle">
             {/* generate dynamic links for the edit */}
             <Link href={{
               pathname: `todos/${id.id}/info`,
              //  query: { id: id.id }
              }} >
              
               <a>Edit</a>
             </Link>
           </Space>
          )
        }
      }
    }
  ];
  
  return (
    <div>
      <Table dataSource={data} columns={columns} ></Table>
    </div>
  );
}

export default ToDoList;