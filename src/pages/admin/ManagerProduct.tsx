import { useEffect, useState } from 'react';
import { Table, Dropdown, Button, Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
const { Search } = Input;

interface TypeProduct {
    id:string,
    name: string,
    price: number,
    slug: string,
    introduction:string,
    status: boolean
}

const ManagerProduct = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const items = [
        {
          key: '0',
          label: (
            <a
              type="button"
              // onClick={() => navigate(`/course-manage-description/${selectedCourse}`)}
            >
              Edit
            </a>
          )
        },
        {
          key: '1',
          label: (
            <a 
              type="button" 
              // onClick={() => navigate(`/course-manage-content/${selectedCourse}`)}
            >
              Delete
            </a>
          )
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

    const data: TypeProduct[] = [
        {
          id: '1',
          name: 'John ',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
        },
        {
          id: '2',
          name: 'Jim Green',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
          
        },
        {
          id: '3',
          name: 'Joe Black',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
        },
        {
          id: '4',
          name: 'Brown',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
        },
        {
          id: '5',
          name: 'Huynh Quyn',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
        },
        {
          id: '6',
          name: 'Nhat',
          price: 20000,
          slug: 'New York No. 1 Lake Park',
          introduction: "BST JUSTPLAY - JSX với thiết kế bắt mắt và ấn tượng cùng bạn đồng hành ra sân. ? Bộ quần áo bóng đá JSX với hoa văn in trên áo lấy ý tưởng của ngọn lửa thiêng. Phối vai áo độc đáo - kết hợp phối nách tay và",
          status: false
        },
    ];

    const columns :TableProps<TypeProduct>['columns'] = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: 'slug',
          dataIndex: 'slug',
          key: 'slug',
          ellipsis: {
              showTitle: true,
          },
        },
        {
          title: 'Status',
          key: 'status',
          dataIndex: 'status',
          render: (status ) => {
            console.log(status)
            const color = status === true ? 'green': 'cyan' ;
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
    
      const handlePageChange = (page: number) => {
          setCurrentPage(page)
      }
  

  return (
    <div>
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
            // onChange={e => setSearchName(e.target.value)}
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
        <Table rowKey={"documentId"} columns={columns} dataSource={data} pagination={{
          current: currentPage,
          pageSize: 3,
          total: data.length,
          onChange: handlePageChange,
          showSizeChanger: false
        }}/>
    </div>
  )
}

export default ManagerProduct