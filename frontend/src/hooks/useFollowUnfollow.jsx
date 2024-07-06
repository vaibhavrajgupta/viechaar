import { useState } from "react";
import useShowToast from "./useShowToast";
import { useSelector } from "react-redux";

const useFollowUnfollow = (user) => {
	const loggedUser = useSelector((state) => state.user.user);
	
	const [following, setFollowing] = useState(
		user.followers.includes(loggedUser?._id)
	);
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
		if (!loggedUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (updating) return;
		setUpdating(true);

		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			if (following) {
				showToast("Success", `Unfollowed ${user.name} `);
				user.followers.pop();
			} else {
				showToast("Success", `Followed ${user.name}`);
				user.followers.push(loggedUser?._id);
			}
			setFollowing(!following);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnfollow, updating, following };
};
export default useFollowUnfollow;
