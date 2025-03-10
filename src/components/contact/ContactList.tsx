import React, { useState, useEffect } from "react";
import { Container, ListGroup, Button, Modal } from "react-bootstrap";
import { Contact } from "../../types/types";
import AddContact from "./AddContact";
import { usePermissions } from "../../util/usePermissions";
import { useApi } from "../../util/apiUtil";

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await fetchWithAuth("/api/contacts");
      setContacts(data);
    } catch (err) {
      // Error handled elseewhere
    }
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
    setShowAddModal(false);
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      setContacts(contacts.filter((contact) => contact._id !== contactId));
    } catch (err) {
      setError("Error deleting contact");
      console.error("Error in handleDeleteContact:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Contacts</h2>
      {error && <p className="text-danger">{error}</p>}
      <ListGroup>
        {contacts.length === 0 && <p>No contacts found</p>}
        {contacts.map((contact) => (
          <ListGroup.Item
            key={contact._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h3>
                {contact.firstName} {contact.lastName}
              </h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
            </div>
            {hasPermission("MANAGE_CONTACTS") && (
              <Button
                variant="danger"
                onClick={() => handleDeleteContact(contact._id)}
              >
                Delete
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {hasPermission("MANAGE_CONTACTS") && (
        <Button
          className="mt-3"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Contact
        </Button>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddContact onContactAdded={handleAddContact} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ContactList;
