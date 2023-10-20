import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; //로그인한 유저 정보
  console.log(user);
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children; // 자식 컴포넌트로 보내기
}
