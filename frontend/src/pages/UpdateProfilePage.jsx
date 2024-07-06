import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../hooks/useShowToast";
import useCheckAvailability from "../hooks/useCheckAvailability";
import usePreviewImg from "../hooks/usePreviewImg";
import { setUser } from "../features/userSlice";

const UpdateProfilePage = () => {
	const user = useSelector((state) => state.user.user);
	const dispatch = useDispatch();
	const [updating, setUpdating] = useState(false);
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const showToast = useShowToast();
	const checkAvailability = useCheckAvailability(
		setUsernameError,
		setEmailError
	);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const disBtn = !!usernameError || !!emailError || !inputs.name;
	const fileRef = useRef(null);

	const { handleImageChange, imgUrl } = usePreviewImg();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs((prev) => ({ ...prev, [name]: value }));
		if (name === "username" && value !== user.username) {
			checkAvailability("username", value);
			if (!usernameError) setUsernameError("");
		} else if (name === "email" && value !== user.email) {
			checkAvailability("email", value);
			if (!emailError) setEmailError("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);

		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			dispatch(setUser(data.data));
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"md"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={6}
				>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
						User Profile Edit
					</Heading>
					<FormControl>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar
									size="xl"
									boxShadow={"md"}
									src={imgUrl || user.profilePic}
								/>
							</Center>
							<Center w="full">
								<Button w="full" onClick={() => fileRef.current.click()}>
									Change Avatar
								</Button>
								<Input
									type="file"
									hidden
									ref={fileRef}
									onChange={handleImageChange}
								/>
							</Center>
						</Stack>
					</FormControl>
					<FormControl isRequired>
						<FormLabel>Full Name</FormLabel>
						<Input
							placeholder="Full Name"
							_placeholder={{ color: "gray.500" }}
							type="text"
							name="name"
							value={inputs.name}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							placeholder="Username"
							_placeholder={{ color: "gray.500" }}
							type="text"
							name="username"
							value={inputs.username}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder="your-email@example.com"
							_placeholder={{ color: "gray.500" }}
							type="email"
							name="email"
							value={inputs.email}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder="Bio"
							_placeholder={{ color: "gray.500" }}
							type="text"
							name="bio"
							value={inputs.bio}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder="Password"
							_placeholder={{ color: "gray.500" }}
							type="password"
							name="password"
							onChange={handleChange}
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "red.500",
							}}
						>
							Cancel
						</Button>
						<Button
							bg={"green.400"}
							color={"white"}
							w="full"
							_hover={{
								bg: "green.500",
							}}
							isDisabled={disBtn}
							type="submit"
							isLoading={updating}
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
};
export default UpdateProfilePage;
