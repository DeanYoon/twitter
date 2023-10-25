import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  width: 500px;
`;
const Form = styled.form`
  color: white;
  font-size: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const AvatarUpload = styled.label`
  border-radius: 100%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: skyblue;
  position: relative;
  cursor: pointer;
  svg {
    width: 70px;
    height: 70px;
  }
`;
const AvatarUploadIcon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  top: 10;
  width: 150px;
  height: 150px;
  background-color: #00000050;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 100px;
`;
const AvatarInput = styled.input`
  display: none;
`;
const NameInput = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;
const Name = styled.input`
  text-align: center;
  font-size: 30px;
  border: none;
  outline: none;
  border-radius: 100px;
`;

const SaveBtn = styled.button`
  height: 100%;
  border-radius: 100px;
  border: none;
  height: 30px;
  margin-top: 20px;
  cursor: pointer;
`;

const Tweets = styled.div`
  width: 100%;
  margin-top: 50px;
`;

export default function Profile() {
  const { register, handleSubmit, watch } = useForm();
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);

  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [username, setUsername] = useState(user?.displayName ?? "Anonymous"); // Add username state

  const avatarFile = watch("avatar");
  useEffect(() => {
    if (avatarFile) {
      const file = avatarFile[0];
      if (file) {
        setAvatar(URL.createObjectURL(file));
      }
    }
  }, [avatarFile]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid),
        orderBy("createdAt")
      );

      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); // 타임라인을 보고 있지 않을때는 구독취소
    };
  }, []);

  const onSubmit = async (data: any) => {
    const ok = confirm("Do you want to save it?");
    if (!ok) return;
    const { avatar: files, username } = data;
    let avatarUrl = "";
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      avatarUrl = await getDownloadURL(result.ref);
    }

    if (user.displayName !== username) {
      const tweetQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid)
      );
      const snapshot = await getDocs(tweetQuery);
      snapshot.forEach(async (tweet) => {
        console.log(tweet);
        await updateDoc(tweet.ref, { username });
      });
    }
    await updateProfile(user, {
      photoURL: avatarUrl ? avatarUrl : avatar,
      displayName: username,
    });
  };
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
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
          <AvatarUploadIcon>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
          </AvatarUploadIcon>
        </AvatarUpload>
        <AvatarInput
          {...register("avatar")}
          id="avatar"
          type="file"
          accept="image/*"
        />
        <NameInput>
          <Name
            {...register("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Handle changes to the username
          />
          <SaveBtn type="submit">SAVE</SaveBtn>
        </NameInput>
      </Form>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
