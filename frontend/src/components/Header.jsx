import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { setAuthScreen } from "../features/authScreenSlice";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useSelector((state) => state.user.user);
	const dispatch = useDispatch();
	const logout = useLogout();

	return (
		<Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={12}>
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{/* {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => dispatch(setAuthScreen("login"))}>
					Login
				</Link>
			)} */}
			<Image
				cursor={"pointer"}
				alt="logo"
				w={6}
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/>
			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"sm"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{/* {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => dispatch(setAuthScreen("signup"))}>
					Sign up
				</Link>
			)} */}
		</Flex>
	);
};
export default Header;
