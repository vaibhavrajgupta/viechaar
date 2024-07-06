import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import {
	Avatar,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useSelector } from "react-redux";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const loggedUser = useSelector((state) => state.user.user);
	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				description: "Profile Link Copied",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text
							fontSize={{
								base: "xs",
								md: "sm",
								lg: "md",
							}}
							bg={"gray.dark"}
							color={"gray.light"}
							p={1}
							borderRadius={"full"}
						>
							viechâār.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic ? (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					) : (
						<Avatar
							name={user.name}
							src="https://bit.ly/broken-link"
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>
			<Text>{user.bio}</Text>
			{loggedUser && loggedUser?._id === user._id ? (
				<Link as={RouterLink} to="/update">
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			) : (
				<Button size={"sm"} isLoading={updating} onClick={handleFollowUnfollow}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} Followers</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"} />
					<Text color={"gray.light"}>{user.following.length} Following</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"} />
					<Link color={"gray.light"}>github.com</Link>
				</Flex>
				<Flex>
					<Box className="icon-container">
						<BsInstagram cursor={"pointer"} size={"24"} />
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO cursor={"pointer"} size={"24"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy Link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex
					flex={1}
					borderBottom={"1.5px solid white"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Viechâār</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					color={"gray.light"}
					justifyContent={"center"}
					pb={3}
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Utťařr</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};
export default UserHeader;
