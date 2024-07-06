import { useCallback } from "react";
import debounce from "lodash/debounce";
import useShowToast from "./useShowToast";

const useCheckAvailability = (setUsernameError, setEmailError) => {
	const showToast = useShowToast();
	return useCallback(
		debounce(async (type, value) => {
			try {
				if (!value.trim()) {
					if (type === "username") {
						setUsernameError("Username is required.");
					} else if (type === "email") {
						setEmailError("Email is required.");
					}
					return;
				}
				const res = await fetch(
					`/api/users/check-availability?type=${type}&value=${value}`
				);

				if (res.status === 204) {
					if (type === "username") {
						setUsernameError("");
					} else if (type === "email") {
						setEmailError("");
					}
					return;
				}

				const data = await res.json();

				if (data.data) {
					if (type === "username") {
						setUsernameError("Username is already taken.");
					} else if (type === "email") {
						setEmailError("Email is already registered.");
					}
					showToast("Warning", data.message, "error");
				} else {
					if (type === "username") {
						setUsernameError("");
					} else if (type === "email") {
						setEmailError("");
					}
				}
			} catch (error) {
				showToast("Error", "Failed to check availability", "error");
			}
		}, 1000),
		[showToast, setUsernameError, setEmailError]
	);
};


export default useCheckAvailability;