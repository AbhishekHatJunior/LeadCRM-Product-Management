import { Card, Badge } from 'react-bootstrap'
import { Pencil, Trash, Star, StarFill } from 'react-bootstrap-icons'

export default function ProductCard({ product, onEdit, onDelete }) {

  // Function to render rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarFill key={i} className="rating-stars" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="rating-stars" />);
      } else {
        stars.push(<Star key={i} className="rating-stars" />);
      }
    }

    return stars;
  };

  return (
    <Card className="product-card">
      <div className="product-image-container">
        <Card.Img
          variant="top"
          src={product.image}
          className="product-image"
        />
        <Badge className="product-badge">{product.category}</Badge>
      </div>

      <Card.Body className="product-card-body">
        <Card.Title className="product-title">{product.title}</Card.Title>
        <Card.Text className="product-description">
          {product.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center pt-2 mb-3">
          <div className="product-price">${product.price}</div>
          <div className="product-rating">
            {renderRatingStars(product.rating?.rate || 0)}
            <span className="rating-count">({product.rating?.count || 0})</span>
          </div>
        </div>

        <div className="product-actions">
          <div variant="success" className="action-btn edit-btn" onClick={onEdit}>
            <Pencil className="me-2" /> Edit
          </div>
          <div variant="danger" className="action-btn delete-btn" onClick={onDelete}>
            <Trash className="me-2" /> Delete
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}