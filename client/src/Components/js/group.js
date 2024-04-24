/* /client/Components/js/group.js */

import React, { useState } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import '../css/group.css';

const Group = ({ show, onHide, onSubmit }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("image", image);
    const groupData = {
      name: formData.get("groupName"),
      adminName: formData.get("adminName"),
      image: formData.get("image"),
    };
    onSubmit(groupData);
  };

  return (
    <Modal show={show} onHide={onHide} className="group-modal">
      <Modal.Header closeButton className="group-header">
        <Modal.Title>Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="groupName">
            <Form.Label className="form-label">Group Name</Form.Label>
            <Form.Control type="text" name="groupName" required />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label className="form-label">Group Image</Form.Label>
            <Form.Control type="file" name="image" onChange={handleImageChange} accept="image/*" />
          </Form.Group>
          {image && (
            <div className="image-preview">
              <Image src={URL.createObjectURL(image)} alt="Group Image" fluid />
            </div>
          )}
          <Form.Group controlId="adminName">
            <Form.Label className="form-label">Admin Name</Form.Label>
            <Form.Control type="text" name="adminName" required />
          </Form.Group>
          <Form.Group controlId="members">
            <Form.Label className="form-label">Add Members</Form.Label>
            <Form.Control type="text" name="members" required />
          </Form.Group>
          <Button variant="primary" type="submit" className="grp-btn">
            Create Group
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Group;