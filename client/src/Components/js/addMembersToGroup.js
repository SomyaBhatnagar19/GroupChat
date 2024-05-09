import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListGroup,
  Form,
  Stack,
  ListGroupItem,
  Modal,
  Button,
} from "react-bootstrap";
import { getAllNewMembersToAdd, addNewMembersToTheGroup } from "../store/groupStore";
import { toggleMembersSelection} from "../store/groupStore";
import { AiOutlinePlus } from "react-icons/ai";

const AddMembersToGroup = () => {
  const groupId = JSON.parse(localStorage.getItem("group")).id;

  const [show, setShow] = useState(true);

  const dispatch = useDispatch();

  const allNewMembers = useSelector(
    (state) => state.groupStoreCreation.allNewMembers
  );


  const selectedMembers = useSelector(
    (state) => state.groupStoreCreation.selectedMembers
  );

  const handleClose = () => {
    setShow(!show);
  }
  
  useEffect(() => {
    dispatch(getAllNewMembersToAdd());
  }, []);




  const addToGroupHandler = () => {

      const newMembersData = {
          members : selectedMembers,
          groupId : groupId,

      }
      console.log('Data to modify: ', newMembersData);
      dispatch(addNewMembersToTheGroup(newMembersData));
      setShow(!show);
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="add-user-title mb-2">
            Add Member To Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <div className="mb-2 mt-2 select-members-title">
              Select New Members
            </div>
            <ListGroup className="select-admin-list mb-2">
              {allNewMembers.map((user) => (
                <ListGroupItem key={user.id}>
                  <Stack direction="horizontal">
                    <div className="me-auto">{user.name}</div>
                    <Form.Group controlId="memberIds">
                      <Form.Check
                        key={user.id}
                        type="checkbox"
                        value={user.id}
                        checked={selectedMembers.includes(user.id)}
                        onChange={() =>   dispatch(toggleMembersSelection(user.id))}
                      />
                    </Form.Group>
                  </Stack>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
                    <Button onClick={addToGroupHandler} className="add-members-btn">
                    <Stack direction="horizontal" gap={1}>
                        <AiOutlinePlus/>
                    <div>Add Member To Group</div>
                    </Stack>
                    </Button></Modal.Footer>
      </Modal>
    </div>
  );
};
export default AddMembersToGroup;
