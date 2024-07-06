import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../features/selectedConversationSlice";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useSelector((state) => state.user.user);
	const lastMessage = conversation.lastMessage;
	const colorMode = useColorMode();
	const dispatch = useDispatch();
	const selectedConversation = useSelector((state)=> state.selectedConversation);

	const handleClick = () => {
		dispatch(
			setSelectedConversation({
				_id: conversation._id,
				userId: conversation.participants[0]._id,
				userProfilePic: conversation.participants[0].profilePic,
				username: conversation.participants[0].username,
				mock : conversation.mock
			})
		);
	};


	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"1"}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.600", "gray.dark"),
				color: "white",
			}}
			onClick={handleClick}
			borderRadius={"md"}
			bg={
				selectedConversation?._id === conversation._id
					? colorMode === "light"
						? "gray.400"
						: "gray.dark"
					: ""
			}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					<AvatarBadge boxSize="1em" bg="green.500" />
				</Avatar>
			</WrapItem>
			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight="700" display={"flex"} alignItems={"center"}>
					{user.username}
					<Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
					{currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							<BsCheck2All size={16} />
						</Box>
					) : (
						""
					)}
					{lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
				</Text>
			</Stack>
		</Flex>
	);
};
export default Conversation;
