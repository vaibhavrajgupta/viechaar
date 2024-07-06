/* eslint-disable no-unused-vars */
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { setPosts } from "../features/postSlice";

const HomePage = () => {
	const loggedUser = useSelector((state) => state.user.user);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(true);
	const posts = useSelector((state)=>state.posts.posts);
	const dispatch = useDispatch();

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			dispatch(setPosts([]));
			try {
				const res = await fetch(`/api/posts/feed`);
				const data = await res.json();
				dispatch(setPosts(data.data));
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);


	return (
		<>
			<Flex gap="10" alignItems={"flex-start"}>
				<Box flex={70}>
					{!loading && posts.length === 0 && (
						<h1>Follow some users to see the feed</h1>
					)}
					{loading && (
						<Flex justify="center">
							<Spinner size="xl" />
						</Flex>
					)}
					{posts.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</Box>
			</Flex>
		</>
	);
};
export default HomePage;
