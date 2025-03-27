import { useEffect, useState } from 'react';
import { Table, Dropdown, Button, Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
import CreatePostNews from '@/components/createPostNews/CreatePostNews';
import { deleteNews, getPostListNews } from '@/store/news.slice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { TypeDataNews } from '../news/typeNews';
const { Search } = Input;

const ManagerNews = () => {
    const listNews = useSelector((state : RootState) => state.news.news)
    const [modalElement, setModalElement] = useState<HTMLElement | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState<string | undefined>(undefined)
    const [lastPage, setLastPage] = useState(1);  
    const [searchName, setSearchName] = useState('');
    const dispatch = useAppDispatch()
    console.log(listNews)

  console.log(selectedNews)
    useEffect(() => {
      const promise = dispatch(getPostListNews())
      return () => {
        promise.abort()
      }
    },[dispatch])

    const handleStatus = () => {

    }

    const handleDelete = (selectedNews : string) => {
        dispatch(deleteNews(selectedNews))
        console.log(123)
    }

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
              onClick={() => selectedNews && handleDelete(selectedNews)}
            >
              Delete
            </a>
          )
        },
        {
            label: (
              <a 
                type="button" 
                onClick={() => handleStatus}
              >
                status switch
              </a>
            ),
            key: '2'
        }
    ];

    const columns :TableProps<TypeDataNews>['columns'] = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'introduction',
        dataIndex: 'introduction',
        key: 'introduction',
        ellipsis: {
          showTitle: true,
        }
      },
      {
        title: 'slug',
        dataIndex: 'slug',
        key: 'slug',
        ellipsis: {
            showTitle: true,
        }
      },
      {
        title: 'Status',
        key: 'is_block',
        dataIndex: 'is_block',
        render: (is_block) => {
            const color = is_block === true ? 'green': 'cyan' ;
            const text = is_block === true ? 'PUBLIC' : 'PRIVATE';
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
        // render: (_, record) => (
          render: (_, record) => (
            <Dropdown
              menu={{
                items
              }}
              trigger={['click']}
              onOpenChange={(open) => open && setSelectedNews(record.documentId)}
            >
              <a style={{ color: 'black' }} onClick={(e) => e.preventDefault()}>
                <Ellipsis />
              </a>
            </Dropdown>
          )
      }
    ];

    const handleShowAddNews = () => {
      const element = document.getElementById('modal')
      console.log(element)
      if(element)
      {
          element.style.display = 'block'
      }
      console.log(123)
    }

    useEffect(() => {
      setModalElement(document.getElementById('modal'));
    }, []);
  
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

  return (
    <div>
       <div id='modal' className='modal'>
            {/* <CreatePostNews element = {document.getElementById('modal')}/> */}
            <CreatePostNews element={modalElement} />
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
            // onChange={e => setSearchName(e.target.value)}
            // onSearch={() => getCourses(true)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleShowAddNews}
          >
            Create News
          </Button>
        </div>
        <Table columns={columns} dataSource={listNews} pagination={{
          current: currentPage,
          pageSize: 3,
          total: listNews.length,
          onChange: handlePageChange,
          showSizeChanger: false
        }}/>
       
    </div>
  )
}

export default ManagerNews