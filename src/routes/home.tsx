import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import TimeLine from "../components/timeline";

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
  return (
    <Wrapper>
      <PostTweetForm />
      <TimeLine />
    </Wrapper>
  );
}
