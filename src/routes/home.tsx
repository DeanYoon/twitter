import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import TimeLine from "../components/timeline";
import { useEffect } from "react";
import { auth, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export default function Home() {
  useEffect(() => {
    const user = auth.currentUser;
    const getSocialProfileImg = async () => {
      if (user?.photoURL) {
        const response = await fetch(user?.photoURL);
        const imageBlob = await response.blob();
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        await uploadBytes(locationRef, imageBlob);
        await updateProfile(user, {
          photoURL: user?.photoURL,
        });
      }
    };
    user?.photoURL && getSocialProfileImg();
  }, []);
  return (
    <Wrapper>
      <PostTweetForm />
      <TimeLine />
    </Wrapper>
  );
}
