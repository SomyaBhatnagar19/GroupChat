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
import { getAllNewMembersToAdd, getAllNewAdminsToAdd, addNewMembersToTheGroup } from "../store/groupStore";
import { toggleMembersSelection, toggleAdminSelection } from "../store/groupStore";
import { AiOutlinePlus } from "react-icons/ai";

const AddMembersToGroup = ({show, handleClose}) => {
  const groupId = JSON.parse(localStorage.getItem("group")).id;

//   const [show, setShow] = useState(true);

  const dispatch = useDispatch();

  const allNewMembers = useSelector(
    (state) => state.groupStoreCreation.allNewMembers
  );

  const allNewAdmins = useSelector(
    (state) => state.groupStoreCreation.allNewAdmins
  )

  const selectedMembers = useSelector(
    (state) => state.groupStoreCreation.selectedMembers
  );

  const selectedAdmins = useSelector(
    (state) => state.groupStoreCreation.selectedAdmins
  );


    console.log("All New Admins: ", allNewAdmins);
  // const allNewAdmins = useSelector((state)=>state.groupStoreCreation.allNewAdmins);

  useEffect(() => {
    dispatch(getAllNewMembersToAdd());

    dispatch(getAllNewAdminsToAdd());
  }, []);


  //  const deselectAdmin = useSelector((state)=>state.userGroupCreation.deselectAdmin);

//   const handleClose = () => {
//     // dispatch(clearGroupCreation());
//     setShow(!show);
//   };

  const handleMemberCheckboxChange = (userId) => {
    dispatch(toggleMembersSelection(userId));
  };

  const handleAdminRadioChange = (userId) => {
    dispatch(toggleAdminSelection(userId));
  };

  const addToGroupHandler = () => {

      const newMembersData = {
          admins : selectedAdmins,
          members : selectedMembers,
          groupId : groupId,

      }
      console.log('Data to modify: ', newMembersData);
      handleClose();
      dispatch(addNewMembersToTheGroup(newMembersData));
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title className="add-user-title mb-2">
            Add Users To Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <div className="m-1 select-admins-title mb-2">
              Select New Admins
            </div>
            <ListGroup className="select-admin-list">
                    {allNewAdmins.map((user)=>(
                        <ListGroupItem key={user.id}>
                        <Stack direction="horizontal">
                        <div className="me-auto">{user.name}</div>
                        <Form className="ms-auto">
                        <Form.Check
                key={user.id}
                type="checkbox"
                name="adminId"
                value={user.id}
                checked={selectedAdmins.includes(user.id)}
                onChange={() => handleAdminRadioChange(user.id)}
              />
                        </Form>
                        </Stack>
                        </ListGroupItem>
                    ))}
                </ListGroup>
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
                        onChange={() => handleMemberCheckboxChange(user.id)}
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
                    <div>Add Modifications To Group</div>
                    </Stack>
                    </Button></Modal.Footer>
      </Modal>
    </div>
  );
};
export default AddMembersToGroup;
