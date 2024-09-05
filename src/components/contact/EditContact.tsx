import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Contact } from "../../types/types";

interface EditContactProps {
  contact: Contact;
  onContactEdited: (updatedContact: Partial<Contact>) => void;
}

const EditContact: React.FC<EditContactProps> = ({ contact, onContactEdited }) => {
  const [firstname, setContactFirstName] = useState(contact.firstName);
  const [lastname, setContactLastName] = useState(contact.lastName);
  const [email, setContactEmail] = useState(contact.email);
  const [phone, setContactPhone] = useState(contact.phone);

  useEffect(() => {
    setContactFirstName(contact.firstName);
    setContactLastName(contact.lastName);
    setContactEmail(contact.email);
    setContactPhone(contact.phone);
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContactEdited({
      _id: contact._id,
      firstname,
      lastname,
      email,
      phone
    });
  };

  return (
    <Container>
      <h2>Edit Contact</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstname}
            onChange={(e) => setContactFirstName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastname}
            onChange={(e) => setContactLastName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="number"
            value={phone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Update User</Button>
      </Form>
    </Container>
  );
};

export default EditContact;
