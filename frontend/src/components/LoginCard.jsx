import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useDispatch } from "react-redux";
import { signup } from "../features/authSlice";
import useShowToast from "../hooks/useShowToast";
import { setUser } from "../features/userSlice";

const LoginCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const showToast = useShowToast();
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			// console.log(data.data);
			dispatch(setUser(data.data));
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	const isButtonDisabled = !inputs.username.trim() || !inputs.password.trim();

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"}>
				<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
					<Stack align={"center"}>
						<Heading fontSize={"4xl"} textAlign={"center"}>
							Login
						</Heading>
					</Stack>
					<Box
						rounded={"lg"}
						bg={useColorModeValue("white", "gray.dark")}
						boxShadow={"lg"}
						p={8}
						w={{
							base: "full",
							sm: "400px",
						}}
					>
						<Stack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Username</FormLabel>
								<Input
									type="text"
									value={inputs.username}
									onChange={(e) =>
										setInputs((inputs) => ({
											...inputs,
											username: e.target.value,
										}))
									}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Password</FormLabel>
								<InputGroup>
									<Input
										value={inputs.password}
										type={showPassword ? "text" : "password"}
										onChange={(e) =>
											setInputs((inputs) => ({
												...inputs,
												password: e.target.value,
											}))
										}
									/>
									<InputRightElement h={"full"}>
										<Button
											variant={"ghost"}
											onClick={() =>
												setShowPassword((showPassword) => !showPassword)
											}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<Stack spacing={10} pt={2}>
								<Button
									loadingText="Logging In"
									size="lg"
									bg={useColorModeValue("gray.600", "gray.700")}
									color={"white"}
									_hover={{
										bg: useColorModeValue("gray.700", "gray.800"),
									}}
									// onClick={handleLogin}
									type="submit"
									isLoading={loading}
									isDisabled={isButtonDisabled}
								>
									Login
								</Button>
							</Stack>
							<Stack pt={6}>
								<Text align={"center"}>
									Don&apos;t have an account ?{" "}
									<Link color={"blue.400"} onClick={() => dispatch(signup())}>
										Sign Up
									</Link>
								</Text>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Flex>
		</form>
	);
};

export default LoginCard;
