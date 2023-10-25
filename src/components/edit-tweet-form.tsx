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

export type EditTweetFormProps = {
  photo: string | undefined;
  editTweet: string;
  setIsEdit: (value: boolean) => void; // Assuming setIsEdit is a function
  id: string;
};
export default function EditTweetForm({
  photo,
  editTweet,
  setIsEdit,
  id,
}: EditTweetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, watch } = useForm();
  const [tweet, setTweet] = useState(editTweet);
  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { files } = e.target;
  //   if (files && files.length === 1) {
  //     if (files[0]?.size < 10 * 1024 * 1024) {
  //       setFile(files[0]);
  //     } else {
  //       alert("image file size should be less than 1Mb");
  //     }
  //   }
  // };

  const onFileChange = watch("file");
  useEffect(() => {
    if (onFileChange) {
      setFile(onFileChange[0]);
      // console.log(onFileChange[0]);
    }
  }, [onFileChange]);

  const onSubmit = async (data: any) => {
    const { tweet, file } = data;
    let docRef;
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setIsLoading(true);
      docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet,
      });

      if (file[0]) {
        const locationRef = ref(storage, `tweets/${user.uid}/${docRef.id}`);
        if (photo) {
          const response = await deleteObject(locationRef);
          console.log(response);
        }
        const result = await uploadBytes(locationRef, file[0]);
        const url = await getDownloadURL(result.ref);

        await updateDoc(docRef, {
          photo: url,
        });

        setFile(null);
      }
      setIsEdit(false);
      setTweet("");
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        value={tweet}
        maxLength={180}
        {...register("tweet")}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What is happening?"
        required
      />
      <AttachFileButton htmlFor="file">
        {file || photo ? "Photo Added✅" : "Add photo"}
      </AttachFileButton>

      <AttachFileInput
        {...register("file")}
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
