/* /client/Components/js/group.js */

import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {toggleMembersSelection, toggleAdminSelection, setGroupName, createGroup } from '../store/groupStore';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../store/userStore";

import '../css/group.css';

const Group = ({ show, onHide }) => {

  const [showGroupModal, setShowGroupModal] = useState(false);

  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.userCreation.allUsers);
  const selectedMembers = useSelector((state) => state.groupStoreCreation.selectedMembers);
  const selectedAdmins = useSelector((state) => state.groupStoreCreation.selectedAdmins);
  const groupName = useSelector((state) => state.groupStoreCreation.groupName);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleMemberCheckboxChange = (userId) => {
    dispatch(toggleMembersSelection(userId));
  };

  const handleAdminRadioChange = (userId) => {
    dispatch(toggleAdminSelection(userId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const groupData = {
      groupName: groupName,
      admins: selectedAdmins,
      members: selectedMembers
    } 
    dispatch(createGroup(groupData));
    onHide();
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
            <Form.Control type="text" onChange={(e) => dispatch(setGroupName(e.target.value))} required />
          </Form.Group>
          <Form.Group controlId="adminId">
            <Form.Label className="form-label">Admin</Form.Label>
            {allUsers.map((user) => (
              <Form.Check
                key={user.id}
                type="radio"
                label={user.name}
                name="adminId"
                value={user.id}
                checked={selectedAdmins.includes(user.id)}
                onChange={() => handleAdminRadioChange(user.id)}
              />
            ))}
          </Form.Group>
          <Form.Group controlId="memberIds">
            <Form.Label className="form-label">Members</Form.Label>
            {allUsers.map((user) => (
              <Form.Check
                key={user.id}
                type="checkbox"
                label={user.name}
                value={user.id}
                checked={selectedMembers.includes(user.id)}
                onChange={() => handleMemberCheckboxChange(user.id)}
              />
            ))}
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