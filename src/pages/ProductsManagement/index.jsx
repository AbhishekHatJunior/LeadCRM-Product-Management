import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProdMngData, deleteProduct } from "../../redux/Slices/ProdMngSlice";
import { Container, Row, Col, Button, Toast, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Plus, Search, Filter, X } from 'react-bootstrap-icons';
import ProductCard from '../../components/ProductCard';
import LoadingPage from '../../components/LoadingPage';
import EmptyBox from "../../assets/images/EmptyBox.png";
import ProductFormModal from '../../components/ProductFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';


export default function ProductsManagement() {
  const dispatch = useDispatch();
  const { prodMngData, prodMngLoading } = useSelector((state) => state.prodMng)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [confirmTxt, setConfirmTxt] = useState(false);
  const [themeState, setThemeState] = useState("success")

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [minRating, setMinRating] = useState(0)
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    dispatch(getProdMngData())
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch products:', error);
        setThemeState("danger")
        setToastMessage('Using locally stored products. Could not connect to API.');
        setShowToast(true);
      });
  }, [dispatch])

  // Extract unique categories when data loads
  useEffect(() => {
    if (prodMngData && prodMngData.length > 0) {
      const uniqueCategories = [...new Set(prodMngData.map(product => product.category))];
      setCategories(uniqueCategories);
      setFilteredProducts(prodMngData);
    }
  }, [prodMngData])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (prodMngData && prodMngData.length > 0) {
      let results = [...prodMngData];

      // Search filter
      if (searchQuery) {
        results = results.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Category filter
      if (selectedCategory !== 'all') {
        results = results.filter(product =>
          product.category === selectedCategory
        );
      }

      // Price range filter
      if (priceRange.min !== '' || priceRange.max !== '') {
        results = results.filter(product => {
          const price = product.price;
          const min = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
          const max = priceRange.max === '' ? Number.MAX_SAFE_INTEGER : parseFloat(priceRange.max);
          return price >= min && price <= max;
        });
      }

      // Rating filter
      if (minRating > 0) {
        results = results.filter(product =>
          product.rating?.rate >= minRating
        );
      }

      setFilteredProducts(results);
    }
  }, [prodMngData, searchQuery, selectedCategory, priceRange, minRating])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setShowAddModal(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {

    setConfirmTxt(true);

    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id))
        .unwrap()
        .then(() => {
          setConfirmTxt(false);
          setToastMessage('Product deleted successfully!');
          setShowToast(true);
        })
        .catch(error => {
          console.error('Failed to delete product:', error);
          setConfirmTxt(false);
          setThemeState("danger")
          setToastMessage('Failed to delete product. Please try again.');
          setShowToast(true);
        });

      setShowDeleteModal(false)
      setSelectedProduct(null)
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
  }

  const hasActiveFilters = () => {
    return searchQuery !== '' || selectedCategory !== 'all' ||
      priceRange.min !== '' || priceRange.max !== '' || minRating > 0;
  }

  if (prodMngLoading && prodMngData.length === 0) {
    return (
      <LoadingPage loadingTxt={"Loading Product Details...."} />
    )
  }

  return (
    <Container fluid className="products-management">
      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        autohide
        className="custom-toast"
      >
        <Toast.Header className={`bg-${themeState}`}>
          <div className="me-auto toast-header-txt text-light">Products Management</div>
        </Toast.Header>
        <Toast.Body className={`bg-light text-${themeState} toast-body-txt`}>{toastMessage}</Toast.Body>
      </Toast>

      <div className="page-header">
        <Row className="align-items-center">
          <Col md={8}>
            <div className='d-flex flex-column gap-2'>
              <div className='page-header-txt'>Products Management</div>
              <div>Manage your product inventory with ease!</div>
            </div>
          </Col>
          <Col md={4} className="text-md-end">
            <Button className="add-product-btn text-dark" onClick={handleAddProduct}>
              <Plus className="me-1" size={20} /> Add Product
            </Button>
          </Col>
        </Row>
      </div>

      {/* Filters and Search Section */}
      <div className="filters-section">
        <Row className="align-items-center">
          <Col md={6} lg={4}>
            <InputGroup className="search-box">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-input'
              />
              {searchQuery && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  <X />
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col md={6} lg={8} className="text-end">
            <Dropdown className="d-inline-block me-2">
              <Dropdown.Toggle variant="outline-primary" className="filter-btn">
                <Filter className="me-2" /> Category
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </Dropdown.Item>
                {categories.map(category => (
                  <Dropdown.Item
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="d-inline-block me-2">
              <Dropdown.Toggle variant="outline-primary" className="filter-btn">
                <Filter className="me-2" /> Price
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3" style={{ minWidth: '250px' }}>
                <Row className="g-2">
                  <Col>
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </Col>
                </Row>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="d-inline-block me-2">
              <Dropdown.Toggle variant="outline-primary" className="filter-btn">
                <Filter className="me-2" /> Rating
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={minRating === 0}
                  onClick={() => setMinRating(0)}
                >
                  Any Rating
                </Dropdown.Item>
                <Dropdown.Item
                  active={minRating === 4}
                  onClick={() => setMinRating(4)}
                >
                  4+ Stars
                </Dropdown.Item>
                <Dropdown.Item
                  active={minRating === 3}
                  onClick={() => setMinRating(3)}
                >
                  3+ Stars
                </Dropdown.Item>
                <Dropdown.Item
                  active={minRating === 2}
                  onClick={() => setMinRating(2)}
                >
                  2+ Stars
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {hasActiveFilters() && (
              <Button
                variant="outline-danger"
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                <X className="me-1" /> Clear Filters
              </Button>
            )}
          </Col>
        </Row>

        {/* Active filters indicator */}
        {hasActiveFilters() && (
          <div className="active-filters mt-3">
            <span className="text-muted">Active filters: </span>
            {searchQuery && (
              <span className="filter-badge">Search: "{searchQuery}"</span>
            )}
            {selectedCategory !== 'all' && (
              <span className="filter-badge">Category: {selectedCategory}</span>
            )}
            {(priceRange.min !== '' || priceRange.max !== '') && (
              <span className="filter-badge">
                Price: ${priceRange.min || '0'} - ${priceRange.max || '∞'}
              </span>
            )}
            {minRating > 0 && (
              <span className="filter-badge">Min Rating: {minRating}+ stars</span>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      {filteredProducts.length > 0 && (
        <div className="results-count mb-3">
          <span className="text-muted">
            Showing {filteredProducts.length} of {prodMngData.length} products
          </span>
        </div>
      )}

      {filteredProducts && filteredProducts.length > 0 ? (
        <Row>
          {filteredProducts.map((product, index) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="product-col mb-4">
              <ProductCard
                product={product}
                onEdit={() => handleEditProduct(product)}
                onDelete={() => handleDeleteProduct(product)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-state">
          <img src={EmptyBox} alt="" />
          <h3>No Products Found</h3>
          <p>
            {hasActiveFilters()
              ? "No products match your current filters. Try adjusting your search criteria."
              : "Get started by adding your first product to the inventory."
            }
          </p>
          {hasActiveFilters() ? (
            <Button className="add-product-noData" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          ) : (
            <Button className="add-product-noData" onClick={handleAddProduct}>
              <Plus className="me-2" size={20} /> Add Your First Product
            </Button>
          )}
        </div>
      )}

      <ProductFormModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        product={null}
        isEdit={false}
        onSuccess={() => {
          setToastMessage('Product added successfully!');
          setShowToast(true);
        }}
        onError={() => {
          setToastMessage('Failed to add product. Please try again.');
          setShowToast(true);
        }}
      />

      <ProductFormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        product={selectedProduct}
        isEdit={true}
        onSuccess={() => {
          setToastMessage('Product updated successfully!');
          setShowToast(true);
        }}
        onError={() => {
          setToastMessage('Failed to update product. Please try again.');
          setShowToast(true);
        }}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct ? selectedProduct.title : ''}
        confirmTxt={confirmTxt}
      />
    </Container>
  )
}