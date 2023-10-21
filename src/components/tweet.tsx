import styled from "styled-components";
import { ITweet } from "./timeline";

const Wrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.4);
  height: 150px;
  display: flex;
  justify-content: space-between;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 20px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;
const Username = styled.span`
  margin-bottom: 10px;
`;
const Payload = styled.p``;

export default function Tweet({ username, photo, tweet }: ITweet) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
