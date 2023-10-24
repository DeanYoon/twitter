import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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

export default function GoogleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); //팝업창 뜨면서 구글 로그인
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faGoogle} size="2x" />
      <span>Continue with Google</span>
    </Button>
  );
}
