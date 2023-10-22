import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useSetRecoilState } from "recoil";
import { editPostData, isEditPost } from "../atoms";

const Wrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 20px;
`;
const Column = styled.div``;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;
const Username = styled.span`
  margin-bottom: 10px;
`;
const Payload = styled.p``;

const Button = styled.button`
  background-color: tomato;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const setEditPostData = useSetRecoilState(editPostData);
  const setIsEdit = useSetRecoilState(isEditPost);
  const user = auth.currentUser;
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
    setEditPostData({ username, photo, tweet, userId, id });
    setIsEdit(true);
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <>
            <Button onClick={onDelete}>DELETE</Button>
            <Button onClick={onEdit}>EDIT</Button>
          </>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
