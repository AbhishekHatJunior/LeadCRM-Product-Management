import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { postProdMngForm, updateProduct } from "../redux/Slices/ProdMngSlice"


export default function ProductFormModal({ show, onHide, product, isEdit, onSuccess, onError }) {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: ''
    })
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [subTxt, setSubTxt] = useState(false);
    const [editTxt, setEditTxt] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                price: product.price.toString(),
                description: product.description,
                category: product.category,
                image: product.image
            })
        } else {
            setFormData({
                title: '',
                price: '',
                description: '',
                category: '',
                image: ''
            })
        }
        setErrors({})
        setSubmitted(false)
    }, [product, show])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0)
            newErrors.price = 'Valid price is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.category.trim()) newErrors.category = 'Category is required'
        if (!formData.image.trim()) newErrors.image = 'Image URL is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true);

        if (isEdit) {
            setEditTxt(true)
        }
        else {
            setSubTxt(true);
        }

        if (validateForm()) {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price),
                id: isEdit ? product.id : Date.now()
            }

            if (isEdit) {
                dispatch(updateProduct(submissionData))
                    .unwrap()
                    .then(() => {
                        onSuccess && onSuccess();
                        setEditTxt(false)
                    })
                    .catch(error => {
                        console.error('Failed to update product:', error);
                        onError && onError();
                        setEditTxt(false)
                    });
            } else {
                dispatch(postProdMngForm(submissionData))
                    .unwrap()
                    .then(() => {
                        onSuccess && onSuccess();
                        setSubTxt(false);
                    })
                    .catch(error => {
                        console.error('Failed to add product:', error);
                        onError && onError();
                        setSubTxt(false)
                    });
            }

            onHide()
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Edit Product' : 'Add New Product'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className='add-product-body'>
                    <Row>
                        <Col xs={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    isInvalid={submitted && errors.title}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.title}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    isInvalid={submitted && errors.price}
                                    placeholder='In Dollars ($)'
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.price}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    isInvalid={submitted && errors.category}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.category}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>


                        <Col xs={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    isInvalid={submitted && errors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.description}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    isInvalid={submitted && errors.image}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.image}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEdit ? (editTxt ? "Saving Product..." : "Update Product") : (subTxt ? "Saving Product..." : "Add Product")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}