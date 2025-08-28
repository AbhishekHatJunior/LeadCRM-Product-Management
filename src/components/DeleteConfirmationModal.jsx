import { Modal, Button } from 'react-bootstrap'
import { ExclamationTriangle } from 'react-bootstrap-icons'

export default function DeleteConfirmationModal({ show, onHide, onConfirm, confirmTxt, productName }) {

  return (
    <Modal show={show} onHide={onHide} centered className="confirmation-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <ExclamationTriangle className="me-2" size={24} />
          Confirm Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the product:</p>
        <h5 className="text-danger">"{productName}"</h5>
        <p className="text-muted mt-2">This action cannot be undone and the product will be permanently removed from your inventory.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" className="confirm-btn" onClick={onConfirm}>
          {confirmTxt ? "Deleting Product..." : "Delete Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}