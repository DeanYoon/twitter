import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";

import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 20px;
  font-size: 16px;
`;
const Column = styled.div``;
const Row = styled.div`
  width: 100%;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  svg,
  img {
    width: 50px;
    height: 50px;

    border-radius: 100px;
    margin-right: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const UserImg = styled.img``;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;
const Username = styled.span`
  margin-bottom: 10px;
`;
const Payload = styled.p``;
const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 10px;
`;
const Button = styled.div`
  margin-right: 10px;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid white;
  cursor: pointer;
`;
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isEdit, setIsEdit] = useState(false);
  const user = auth.currentUser;
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const onDelete = async () => {
    const ok = confirm("You wanna delete it?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

  const onEdit = async () => {
    setIsEdit(true);
  };

  const getOwnerProfilePhoto = async () => {
    try {
      const photoRef = ref(storage, `avatars/${userId}`);
      const photoUrl = await getDownloadURL(photoRef);
      setOwnerPhoto(photoUrl);
    } catch (e) {}
  };

  useEffect(() => {
    getOwnerProfilePhoto();
  });

  return (
    <Wrapper>
      <Row>
        <UserRow>
          <UserInfo>
            {ownerPhoto ? (
              <UserImg src={ownerPhoto} />
            ) : (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}

            <Username>{username}</Username>
          </UserInfo>
          {user?.uid === userId ? (
            <ButtonWrapper>
              <Button onClick={onDelete}>DELETE</Button>
              <Button onClick={onEdit}>EDIT</Button>
            </ButtonWrapper>
          ) : null}
        </UserRow>
      </Row>
      {isEdit ? (
        <EditTweetForm
          photo={photo}
          editTweet={tweet}
          setIsEdit={setIsEdit}
          id={id}
        />
      ) : (
        <Column>
          <Payload>{tweet}</Payload>
          {photo ? <Photo src={photo} /> : null}
        </Column>
      )}
    </Wrapper>
  );
}
