/* eslint-disable no-unused-vars */
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import { useSelector } from "react-redux";
const AuthPage = () => {
	const val = useSelector((state) => state.auth.value);
	return <>{val === true ? <LoginCard /> : <SignupCard />}</>;
};
export default AuthPage;
