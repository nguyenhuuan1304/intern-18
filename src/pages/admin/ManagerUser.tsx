import { useEffect, useState } from 'react';
import { Table, Tag, Dropdown, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
// import useAxios from '../../../hooks/useAxios';
// import { render } from 'nprogress';
const { Search } = Input;

interface TypeAdmin { 
    id: string,
    name: string,
    address: string,
    phone: number,
    email: string,
    status: boolean
}

const ManagerUser = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);  
    const [searchName, setSearchName] = useState('');
    // const { api } = useAxios();
    const navigate = useNavigate();
    
    const items = [
      {
        label: (
          <a
            type="button"
            // onClick={() => navigate(`/course-manage-description/${selectedCourse}`)}
          >
            Edit
          </a>
        ),
        key: '0'
      },
      {
        label: (
          <a 
            type="button" 
            // onClick={() => navigate(`/course-manage-content/${selectedCourse}`)}
          >
            Delete
          </a>
        ),
        key: '1'
      },
      {
        label: (
          <a 
            type="button" 
            // onClick={() => navigate(`/course-manage-content/${selectedCourse}`)}
          >
            Status change
          </a>
        ),
        key: '2'
      }
      
    ];

    const data: TypeAdmin[] = [
        {
          id: '1',
          name: 'John ',
          address: 'New York No. 1 Lake Park',
          phone: 21123123312,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
        {
          id: '2',
          name: 'Jim Green',
          address: 'London No. 1 Lake Park',
          phone: 21113272312,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
        {
          id: '3',
          name: 'Joe Black',
          address: 'Sydney No. 1 Lake Park',
          phone: 21221391231,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
        {
          id: '4',
          name: 'Brown',
          address: 'New York No. 1 Lake Park',
          phone: 21123123312,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
        {
          id: '5',
          name: 'Huynh Quyn',
          address: 'New York No. 1 Lake Park',
          phone: 21123123312,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
        {
          id: '6',
          name: 'Nhat',
          address: 'New York No. 1 Lake Park',
          phone: 21123123312,
          email: 'huynhquyn@gmail.com',
          status: true,
        },
    ];
  
    const columns :TableProps<TypeAdmin>['columns'] = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ellipsis: {
          showTitle: true,
        },
        
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: 'Email',
        key: 'email',
        dataIndex: 'email',
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status ) => {
          const color = status === true ? 'green' : 'cyan';
          const text = status === true ? 'PUBLIC' : 'PRIVATE';
          return (
            <Tag color={color}>
              {text}
            </Tag>
          )
        }
      },
      
      {
        title: 'Action',
        key: 'action',
          render: () => (
          <Dropdown
            menu={{
              items
            }}
            trigger={['click']}
            // onClick={() => setSelectedCourse(record.id)}
          >
            <a style={{ color: 'black' }} onClick={(e) => e.preventDefault()}>
              <Ellipsis  />
            </a>
          </Dropdown>
        )
      }
    ];
  
   const handlePageChange = (page:number) => {
      setCurrentPage(page)
   }
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <Search
            style={{ width: '300px' }}
            placeholder="Search by class name"
            enterButton="Search"
            size="middle"
            onChange={e => setSearchName(e.target.value)}
            // onSearch={() => getCourses(true)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin')}
          >
            New Course
          </Button>
        </div>
        <Table columns={columns} dataSource={data} pagination={{
          current: currentPage,
          pageSize: 3,
          total: data.length,
          onChange: handlePageChange,
          showSizeChanger: false
        }}/>
      </>
    );
}

export default ManagerUser