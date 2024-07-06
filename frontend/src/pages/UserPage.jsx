import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { setPosts } from "../features/postSlice.js";
import Post from "../components/Post.jsx";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const posts = useSelector((state) => state.posts.posts);
	const showToast = useShowToast();
	const dispatch = useDispatch();

	
	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				dispatch(setPosts(data.data));
			} catch (error) {
				showToast("Error", error.message, "error");
				dispatch(setPosts([]));
			} finally {
				setFetchingPosts(false);
			}
		};
		getPosts();
		
	}, [username, showToast, user, dispatch]);



	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<div>
			<UserHeader user={user} />
			{!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</div>
	);
};
export default UserPage;
