import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
`;
const TextArea = styled.textarea`
  height: 100px;
  border-radius: 20px;
  background-color: inherit;
  padding: 10px;
  color: white;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  &:focus {
    outline: none;
    border-color: skyblue;
  }
`;
const AttachFileButton = styled.label`
  border: 1px solid skyblue;
  color: skyblue;
  text-align: center;
  padding: 10px;
  border-radius: 50px;
  margin: 20px 0px;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
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
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(tweet, file);
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        value={tweet}
        maxLength={1000}
        onChange={onChange}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added✅" : "Add photo"}
      </AttachFileButton>
      {/* connect with file input */}
      <AttachFileInput
        onChange={onFileChange}
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
