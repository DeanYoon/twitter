import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { auth } from "../firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { FirebaseError } from "firebase/app";

const Button = styled.button`
  margin-top: 50px;
  border-radius: 100px;
  border: none;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  span {
    margin-left: 10px;
  }
`;

export default function GithubButton() {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider); //팝업창 뜨면서 깃헙 로그인
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        alert(error.message);
      }
    }
  };
  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faGithub} size="2x" />
      <span>Continue with Github</span>
    </Button>
  );
}
