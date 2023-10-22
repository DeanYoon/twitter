import { atom } from "recoil";

export interface IEditPost {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
}

export const defaultEditPostData: IEditPost = {
  id: "",
  photo: "",
  tweet: "",
  userId: "",
  username: "",
};

export const editPostData = atom<IEditPost>({
  key: "editPostData",
  default: defaultEditPostData,
});

export const isEditPost = atom({
  key: "isEditPost",
  default: false,
});
