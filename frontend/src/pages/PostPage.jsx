import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Image,
	Spinner,
	Text,
} from "@chakra-ui/react";
import {  useParams } from "react-router-dom";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../hooks/useShowToast";
import useDeletePost from "../hooks/useDeletePost";
import { setPosts } from "../features/postSlice";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const posts = useSelector((state) => state.posts.posts);
	const loggedUser = useSelector((state) => state.user.user);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	
	const { pid } = useParams();
	const dispatch = useDispatch();
	const showToast = useShowToast();
	const deletePost = useDeletePost();


	const currentPost = posts.find((post) => post._id === pid);


	useEffect(() => {
		const getPosts = async () => {
			setFetchingPosts(true);
			dispatch(setPosts([]));
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				dispatch(setPosts([data.data]));
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setFetchingPosts(false);
			}
		};
		getPosts();
	}, [showToast, pid, dispatch]);

	const handleDeletePost = () => {
		deletePost(currentPost._id, true);
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;

	return (
		<>
			<Flex>
				{fetchingPosts && (
					<Flex justifyContent={"center"} my={12}>
						<Spinner size={"xl"} />
					</Flex>
				)}
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name="johndoe" />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src="/verified.png" w="4" h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text
						fontSize={"xs"}
						width={36}
						textAlign={"right"}
						color={"gray.light"}
					>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>
					{loggedUser?._id === user._id && (
						<DeleteIcon
							size={20}
							cursor={"pointer"}
							onClick={handleDeletePost}
						/>
					)}
				</Flex>
			</Flex>

			<Text my={3}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box
					borderRadius={6}
					overflow={"hidden"}
					border={"1px solid"}
					borderColor={"gray.light"}
				>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />
			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋🏻</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>
			<Divider my={4} />
			{currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={
						reply._id ===
						currentPost.replies[currentPost.replies.length - 1]._id
					}
				/>
			))}
		</>
	);
};
export default PostPage;
