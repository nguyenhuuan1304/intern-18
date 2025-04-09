import { useEffect, useState } from 'react';
import { Table, Tag, Dropdown, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
import { RootState, useAppDispatch } from '@/store/store';
import { deleteUser, editStatus, getListUser, searchUser } from '@/store/user.slice';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import CreatePostNews from '@/components/createPostNews/CreatePostNews';
import AddUser from '@/components/createUser/AddUser';

// import useAxios from '../../../hooks/useAxios';
// import { render } from 'nprogress';
const { Search } = Input;

export interface TypeUser { 
    id: string,
    name: string,
    address: string,
    phone: number,
    email: string,
    blocked: boolean,
    documentId: string
}



const ManagerUser = () => {
    const listStateUser = useSelector((state : RootState) => state.user.user)
    const [selectUser, setSelectUser] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('')
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    // console.log(selectUser)
   
    useEffect(() => {
      dispatch(getListUser())
    },[dispatch])

    const handleStatus = (selectUser: string) => {
      const item = listStateUser.find((item) => item.id === selectUser)
      dispatch(editStatus({
          id: selectUser,
          body: !item?.blocked
      }))
      .unwrap()
      .then(() => {
        toast.success('edit status success')
      })
      .catch(() => {
        toast.error('edit status failed')
      })  
    }

    const handleDelete = (selectUser: string) => {
      dispatch(deleteUser(selectUser))
      .unwrap()
      .then(() => {
        toast.success('delete users success')
      })
      .catch(() => {
        toast.error('delete users failed')
      })
    }

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
            onClick={() => selectUser &&  handleDelete(selectUser)}
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
            onClick={() => selectUser &&  handleStatus(selectUser)}
          >
            Status change
          </a>
        ),
        key: '2'
      }
      
    ];

    const columns :TableProps<TypeUser>['columns'] = [
      {
        title: 'Name',
        dataIndex: 'username',
        key: 'username'
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
        key: 'blocked',
        dataIndex: 'blocked',
        render: (blocked ) => {
          const color = blocked === false ? 'green' : 'cyan';
          const text = blocked === false ? 'PUBLIC' : 'PRIVATE';
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
          render: (_,record) => (
          <Dropdown
            menu={{
              items
            }}
            trigger={['click']}
            onOpenChange={(open) => open && setSelectUser(record.id)}
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

   const getUserSearch = () => {
      dispatch(searchUser(searchName))
      setSearchName('')
   }

   const handleShowUser = () => {
    const element = document.getElementById('modal')
    if(element) {
      element.style.display='block'
    }
   }

    return (
      <>
        <div id='modal' className='modal'>
            {/* <CreatePostNews element = {document.getElementById('modal')}/> */}
            <AddUser element = {document.getElementById('modal')} />
        </div>
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
            value={searchName}
            // value={}
            onChange={e => setSearchName(e.target.value)}
            onSearch={() => getUserSearch()}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleShowUser()}
          >
            New User
          </Button>
        </div>
        <Table columns={columns} dataSource={listStateUser.map(user=> ({ ...user, key: user.id }))} pagination={{
          current: currentPage,
          pageSize: 3,
          total: listStateUser.length,
          onChange: handlePageChange,
          showSizeChanger: false
        }}/>
      </>
    );
}

export default ManagerUser