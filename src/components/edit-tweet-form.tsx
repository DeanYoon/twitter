import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import {
  AttachFileButton,
  AttachFileInput,
  Form,
  SubmitBtn,
  TextArea,
} from "./post-tweet-form";

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
      docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet,
      });

      if (file[0]) {
        const locationRef = ref(storage, `tweets/${user.uid}/${docRef.id}`);
        if (photo) {
          await deleteObject(locationRef);
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
