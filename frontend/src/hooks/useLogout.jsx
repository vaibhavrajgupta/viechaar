import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/userSlice";
import { login } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
	const showToast = useToast();
    const dispatch = useDispatch();
	const navigate = useNavigate();
	const logout = async() => {
		try {
            const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
            const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
            dispatch(clearUser());
			dispatch(login());
			navigate("/auth");
		} catch (error) {
            showToast("Error", error, "error");
        }
	};

	return logout;
};
export default useLogout;
