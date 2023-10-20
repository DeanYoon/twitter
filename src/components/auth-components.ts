import styled from "styled-components";

export const Wrapper = styled.div`
  width: 50vw;
`;
export const Title = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
export const Input = styled.input`
  margin-bottom: 5px;
  border-radius: 50px;
  height: 30px;
  padding-left: 20px;
  &[type="submit"] {
    padding: 0;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
      transition: opacity 0.1s ease-in-out;
    }
  }
`;

export const Error = styled.div`
  color: tomato;
  text-align: center;
`;

export const Switcher = styled.div`
  text-align: center;
  margin-top: 30px;
  a {
    margin-left: 10px;
    color: skyblue;
  }
`;
