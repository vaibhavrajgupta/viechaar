import { useDispatch, useSelector } from "react-redux";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";
import { setPosts } from "../features/postSlice";

const useDeletePost = () => {
	const posts = useSelector((state) => state.posts.posts);
	const loggedUser = useSelector((state) => state.user.user);
	const navigate = useNavigate();
	const showToast = useShowToast();
	const dispatch = useDispatch();

	const deletePost = async (postId, redirect = false) => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;
			const res = await fetch(`/api/posts/${postId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");

			dispatch(setPosts(posts.filter((p) => p._id !== postId)));

			if (redirect) {
				navigate(`/${loggedUser.username}`);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return deletePost;
};
export default useDeletePost;
