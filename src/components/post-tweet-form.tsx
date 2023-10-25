import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
export const TextArea = styled.textarea`
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
export const AttachFileButton = styled.label`
  border: 1px solid skyblue;
  color: skyblue;
  text-align: center;
  padding: 10px;
  border-radius: 50px;
  margin: 20px 0px;
  cursor: pointer;
`;
export const AttachFileInput = styled.input`
  display: none;
`;
export const SubmitBtn = styled.input`
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
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, watch, reset } = useForm();

  const files = watch("file");
  useEffect(() => {
    if (files && files.length === 1) {
      if (files[0]?.size < 2 * 1024 * 1024) {
        setFile(files[0]);
      } else {
        alert("image file size should be less than 1Mb");
      }
    }
  }, [files]);

  const onSubmit = async (data: any) => {
    const { tweet, file } = data;

    let docRef;
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      {
        docRef = await addDoc(collection(db, "tweets"), {
          tweet,
          createdAt: Date.now(),
          username: user.displayName || "Anonymous",
          userId: user.uid,
        });
      }

      if (file[0]) {
        const locationRef = ref(storage, `tweets/${user.uid}/${docRef.id}`);

        const result = await uploadBytes(locationRef, file[0]);
        const url = await getDownloadURL(result.ref);

        await updateDoc(docRef, {
          photo: url,
        });
      }

      setFile(null);
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        maxLength={180}
        {...register("tweet")}
        placeholder="What is happening?"
        required
      />
      <AttachFileButton htmlFor="image">
        {file ? "Photo Added✅" : "Add photo"}
      </AttachFileButton>
      {/* connect with file input */}
      <AttachFileInput
        {...register("file")}
        type="file"
        id="image"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting... " : "Post Tweet"}
      />
    </Form>
  );
}
