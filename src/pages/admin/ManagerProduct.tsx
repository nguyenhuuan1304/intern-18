import { useEffect, useState } from 'react';
import { Table, Dropdown, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Ellipsis } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchProducts, deleteProductByDocumentId, addFullProduct, updateFullProduct } from '@/store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, InputNumber, Upload } from 'antd';

const { Search } = Input;

interface TypeProduct {
  id: string,
  documentId: string,
  name: string,
  price: number,
  slug: string,
  introduction: string,
  status: boolean
}

const ManagerProduct = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const [fileList, setFileList] = useState<any[]>([]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editFileList, setEditFileList] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (documentId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      console.log("Deleting product with documentId:", documentId);
      try {
        // First, attempt to delete the product
        await dispatch(deleteProductByDocumentId(documentId)).unwrap();
        console.log("Successfully deleted product with documentId:", documentId);

        // After deleting, refetch the products to reflect the change in the UI
        dispatch(fetchProducts());
      } catch (error) {
        console.error("Xóa không thành công:", error);
      }
    }
  };

  const data: TypeProduct[] = products.map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    price: item.prices,
    slug: item.slug,
    introduction: item.product_detail?.description || '',
    status: item.product_detail?.productStatus === 'public',
    categoryName: item.name_category?.name || 'N/A',
    salePercent: item.product_sale?.percent_discount || 0,
    mainImages: item.Image,
    colorList: item.product_images?.map((imgItem: any) => imgItem.color) || [],
    product_images: item.product_images || [],
    inventory: item.inventory,
  }));

  const columns: TableProps<TypeProduct>['columns'] = [
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
      title: 'Image',
      key: 'image',
      dataIndex: 'Image',
      render: (_: any, product: any) => {
        const mainImageUrl = product.mainImages?.length ? product.mainImages[0].url : "";
        return mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-full"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        );
      }
    },
    {
      title: 'Sale (%)',
      key: 'salePercent',
      dataIndex: 'salePercent',
    },
    {
      title: 'Images',
      key: 'images',
      dataIndex: 'product_images',
      render: (images: any[]) => {
        const flatImages =
          images?.flatMap((imageObj) =>
            imageObj.img?.map((imgObj: any) => imgObj.url).filter(Boolean)
          ) || [];

        return (
          <div className="flex items-center">
            {flatImages.map((url, index) => (
              <img
                key={index}
                src={url}
                className={`w-10 h-10 object-cover rounded-full border-2 border-white ${index !== 0 ? '-ml-4' : ''
                  }`}
                alt={`Image ${index}`}
              />
            ))}
          </div>
        );
      }
    },
    {
      title: 'Sizes',
      key: 'inventory',
      dataIndex: 'inventory',
      render: (inventoryList: any[]) => {
        if (!Array.isArray(inventoryList) || inventoryList.length === 0) {
          return <span className="text-gray-400">No inventory</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            {inventoryList.map((inventory) => (
              <div
                key={inventory.id}
                className={`flex justify-between w-full ${inventory.quantity === 0 ? "text-gray-400" : ""}`}
              >
                <span>{inventory.size}</span>
                <span>{inventory.quantity}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'edit', label: 'Edit' },
              { key: 'delete', label: 'Delete' },
              { key: 'status', label: 'Status change' },
            ],
            onClick: async ({ key }) => {
              if (key === "edit") {
                editForm.setFieldsValue({
                  name: record.name,
                  slug: record.slug,
                  prices: record.price,
                });
                setEditingProductId(record.documentId);
                setEditFileList([]);
                setIsEditModalVisible(true);
              }

              if (key === 'delete') {
                await handleDeleteProduct(record.documentId);
              }
            }
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Ellipsis />
          </a>
        </Dropdown>
      )
    }

  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddProduct = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        console.warn('Vui lòng chọn ảnh sản phẩm');
        return;
      }

      const imageFile = fileList[0]?.originFileObj;

      const newProduct = {
        name: values.name,
        prices: values.prices,
        slug: values.slug,
        description: values.description,
        name_category: values.name_category,
        product_images: values.product_images,
        product_detail: values.product_detail,
        product_sale: values.product_sale,
        ratings: values.ratings,
        carts: values.carts,
        inventories: values.inventories,
        imageFiles: imageFile ? [imageFile] : [],
      };

      await dispatch(addFullProduct({ ...newProduct, imageFiles: imageFile ? [imageFile] : [] })).unwrap();

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error('Thêm sản phẩm thất bại:', err);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const values = await editForm.validateFields();
  
      const imageFile = fileList[0]?.originFileObj;
  
      await dispatch(updateFullProduct({
        documentId: editingProductId!.toString(),
        name: values.name,
        slug: values.slug,
        prices: values.prices,
        imageFiles: imageFile ? [imageFile] : undefined,
        description: values.description,
        name_category: values.name_category,
        product_images: values.product_images,
        product_detail: values.product_detail,
        product_sale: values.product_sale,
        ratings: values.ratings,
        carts: values.carts,
        inventories: values.inventories,
      })).unwrap();
  
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditFileList([]);
      setEditingProductId(null);
      dispatch(fetchProducts());
    } catch (error) {
      console.error("Cập nhật thất bại", error);
    }
  };
  
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
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
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
      }} />
      <Modal
        title="Thêm sản phẩm mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddProduct}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ảnh sản phẩm" required>
            <Upload
              accept="image/*"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <button> Chọn ảnh</button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cập nhật sản phẩm"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateProduct}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="prices" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ảnh sản phẩm">
            <Upload
              accept="image/*"
              beforeUpload={() => false}
              fileList={editFileList}
              onChange={({ fileList }) => setEditFileList(fileList)}
            >
              <button>Chọn ảnh</button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

    </div>

  )
}

export default ManagerProduct