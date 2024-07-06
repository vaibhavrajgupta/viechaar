import { Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/userSlice";
import useShowToast from "../hooks/useShowToast";
import { login } from "../features/authSlice";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
	const dispatch = useDispatch();
	const showToast = useShowToast();

	const handleLogout = async () => {
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
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return (
		<Button
			position={"fixed"}
			top={"30px"}
			right={"30px"}
			size={"sm"}
			onClick={handleLogout}
		>
			<FiLogOut size={20} />
		</Button>
	);
};
export default LogoutButton;
