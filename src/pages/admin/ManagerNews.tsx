import { useEffect, useState } from 'react';
import { Table, Dropdown, Button, Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
import CreatePostNews from '@/components/createPostNews/CreatePostNews';
import { deleteNews, getPostListNews, searchNews, startEditingNews } from '@/store/news.slice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { TypeDataNews } from '../news/typeNews';
import { api } from '@/hooks/useAxios';
import { toast } from "react-toastify";

const { Search } = Input;

const ManagerNews = () => {
    const listNews = useSelector((state : RootState) => state.news.news)
    const [modalElement, setModalElement] = useState<HTMLElement | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState<string | undefined>(undefined);
    const [checkId, setCheckId] = useState(0)
    const [lastPage, setLastPage] = useState(1);  
    const [searchName, setSearchName] = useState('');
    const dispatch = useAppDispatch()

    useEffect(() => {
      const promise = dispatch(getPostListNews())
      return () => {
        promise.abort()
      }
    },[dispatch])

    const handleStatus = async (id : string) => {
      const item = listNews.find(item => item.documentId === id)
      const listImg = item?.img.map(item => item.id)
      console.log(listImg)
      const formattedPost = {
        data: {
          img : listImg,
          is_block  :!item?.is_block
        }
      } 
      try {
        const res = await api.put(`news/${id}`,formattedPost)
        if(res.status === 200) {
          toast.success('edit status success')
        } 
      } catch (error) {
        toast.error('edit status fail')
        console.log(error)
      }
    }

    const handleDelete = (selectedNews : string) => {
        dispatch(deleteNews(selectedNews))
        console.log(selectedNews)
    }

    const items = [
        {
          key: '0',
          label: (
            <button
              type="button"
              onClick={() =>selectedNews && handleShowAddNews(selectedNews)}
            >
              Edit
            </button>
          )
        },
        {
          key: '1',
          label: (
            <button 
              type="button" 
              onClick={() => selectedNews && handleDelete(selectedNews)}
            >
              Delete
            </button>
          )
        },
        {
            label: (
              <button
                type="button" 
                onClick={() => selectedNews && handleStatus(selectedNews)}
              >
                status switch
              </button>
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
        },
        responsive: ['md'] 

      },
      {
        title: 'slug',
        dataIndex: 'slug',
        key: 'slug',
        ellipsis: {
            showTitle: true,
        },
        responsive: ['md'] 
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

    const handleShowAddNews = (selectedNews : string) => {
      const element = document.getElementById('modal')
      console.log(selectedNews)
      if(element)
      {
          element.style.display = 'block'
          setCheckId(pre => pre + 1)
          if(selectedNews) {
            dispatch(startEditingNews(selectedNews))
          } else {
            dispatch(startEditingNews(''))
          }
      }
    }

    useEffect(() => {
      setModalElement(document.getElementById('modal'));
    }, []);
  
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSearchNews = () => {
      dispatch(searchNews(searchName))
      setSearchName('')
    }
    
  return (
    <div>
        <div id='modal' className='modal'>
            {/* <CreatePostNews element = {document.getElementById('modal')}/> */}
            <CreatePostNews element={modalElement} checkId = {checkId} />
        </div>
         <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <Search
            style={{ width: '200px',marginRight: '10px'}}
            placeholder="Search by class name"
            enterButton="Search"
            size="middle"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            onSearch={() => handleSearchNews()}
          />
          <Button
            type="primary"  
            icon={<PlusOutlined />}
            onClick={() => handleShowAddNews('')}
            style={{ width: '100px' }}
          >
            Add News
          </Button>
        </div>
        <Table rowKey={"id"} columns={columns} dataSource={listNews} pagination={{
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