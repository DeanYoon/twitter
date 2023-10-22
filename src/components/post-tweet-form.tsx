import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useRecoilState } from "recoil";
import { defaultEditPostData, editPostData, isEditPost } from "../atoms";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
`;
const TextArea = styled.textarea`
  height: 100px;
  border-radius: 20px;
  background-color: inherit;
  padding: 10px;
  color: white;
  width: 100%;
  resize: none;
  font-family: BlinkMacSystemFont;
  font-size: 16px;
  &::placeholder {
    font-size: 16px;
    font-family: BlinkMacSystemFont;
  }

  &:focus {
    outline: none;
    border-color: skyblue;
  }
`;
const AttachFileButton = styled.label`
  border: 1px solid skyblue;
  color: skyblue;
  text-align: center;
  padding: 10px;
  border-radius: 50px;
  margin: 20px 0px;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  color: white;
  background-color: skyblue;
  border: none;
  border-radius: 50px;
  padding: 10px;
  font-size: 20px;
  cursor: pointer;
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [editData, setEditData] = useRecoilState(editPostData);
  const [isEditState, setIsEditState] = useRecoilState(isEditPost);
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0]?.size < 1000000) {
        setFile(files[0]);
      } else {
        alert("image file size should be less than 1Mb");
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let docRef;

    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);

      if (isEditState) {
        docRef = doc(db, "tweets", editData.id);
        await updateDoc(docRef, {
          tweet,
        });
      } else {
        docRef = await addDoc(collection(db, "tweets"), {
          tweet,
          createdAt: Date.now(),
          username: user.displayName || "Anonymous",
          userId: user.uid,
        });
      }

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${docRef.id}`);
        if (editData.photo) {
          await deleteObject(locationRef);
        }
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(docRef, {
          photo: url,
        });

        setFile(null);
      }
      setTweet("");
      setEditData(defaultEditPostData);
      setIsEditState(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTweet(editData.tweet);
  }, [editData]);
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        value={tweet}
        maxLength={180}
        onChange={onChange}
        placeholder="What is happening?"
        required
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added✅" : "Add photo"}
      </AttachFileButton>
      {/* connect with file input */}
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting... " : "Post Tweet"}
      />
    </Form>
  );
}
