/* eslint-disable no-unused-vars */
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import useDeletePost from "../hooks/useDeletePost";

const Post = ({ post, postedBy }) => {
	const loggedUser = useSelector((state) => state.user.user);
	const posts = useSelector((state) => state.posts.posts);
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const navigate = useNavigate();
	const deletePost = useDeletePost();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data.data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};
		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		e.preventDefault();
		deletePost(post._id);
	};

	if (!user) return null;

	return (
		<Link to={`/${user.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size="md"
						name={user?.name}
						src={user?.profilePic}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/${user.username}`);
						}}
					/>
					<Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size="xs"
								name="JohnDoe"
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>
						)}
						{post.replies[1] && (
							<Avatar
								size="xs"
								name="JohnDoe"
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>
						)}
						{post.replies[2] && (
							<Avatar
								size="xs"
								name="JohnDoe"
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
								fontSize={"sm"}
								fontWeight={"bold"}
							>
								{user?.username}
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text
								fontSize={"xs"}
								width={36}
								textAlign={"right"}
								color={"gray.light"}
							>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
							{loggedUser?._id === user._id && (
								<DeleteIcon size={20} onClick={handleDeletePost} />
							)}
						</Flex>
					</Flex>
					<Text fontSize="sm">{post.text}</Text>
					{post.img && (
						<Box
							borderRadius={6}
							overflow={"hidden"}
							border={"1px solid "}
							borderColor={"gray.light"}
						>
							<Image src={post.img} w={"full"} />
						</Box>
					)}

					<Flex gap={3} my={1}>
						<Actions post={post} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};
export default Post;
