import { SearchIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Input,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import {
	addConversation,
	setConversations,
} from "../features/conversationsSlice.js";
import { setSelectedConversation } from "../features/selectedConversationSlice.js";

const ChatPage = () => {
	const showToast = useShowToast();
	const dispatch = useDispatch();
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchingUser, setSearchingUser] = useState(false);
	const [searchText, setSearchText] = useState("");
	const conversations = useSelector((state) => state.conversations);
	const selectedConversation = useSelector(
		(state) => state.selectedConversation
	);
	const currentUser = useSelector((state) => state.user.user);

	

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				dispatch(setConversations(data.data));
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};
		getConversations();
	}, [showToast, dispatch]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser.data._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) =>
					conversation.participants[0]._id === searchedUser.data._id
			);

			if (conversationAlreadyExists) {
				dispatch(
					setSelectedConversation({
						_id: conversationAlreadyExists._id,
						userId: searchedUser.data._id,
						username: searchedUser.data.username,
						userProfilePic: searchedUser.data.profilePic,
					})
				);
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser.data._id,
						username: searchedUser.data.username,
						profilePic: searchedUser.data.profilePic,
					},
				],
			};
			dispatch(addConversation(mockConversation)); // Updated to use dispatch

			console.log(conversations);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "950px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				<Flex
					flex={30}
					gap={2}
					flexDirection={"column"}
					maxW={{ sm: "250px", md: "full" }}
					mx={"auto"}
				>
					<Text
						fontWeight={700}
						color={useColorModeValue("gray.600", "gray.400")}
					>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input
								placeholder="Search for a user"
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Button
								onClick={handleConversationSearch}
								isLoading={searchingUser}
								size={"sm"}
							>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex
								key={i}
								gap={4}
								alignItems={"center"}
								p={"1"}
								borderRadius={"md"}
							>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								// isOnline={onlineUsers.includes(
								// 	conversation.participants[0]._id
								// )}
								conversation={conversation}
							/>
						))}
				</Flex>
				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}
				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};
export default ChatPage;
