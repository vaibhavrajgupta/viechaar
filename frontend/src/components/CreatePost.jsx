import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addPosts } from "../features/postSlice.js";

const MAX_CHAR = 500;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const imageRef = useRef(null);
	const user = useSelector((state) => state.user.user);
	const [loading, setLoading] = useState(false);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const showToast = useShowToast();
	const { username } = useParams();

	const dispatch = useDispatch();

	const handleTextChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};
	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					img: imgUrl,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			if (username === user.username) {
				dispatch(addPosts(data.data));
			}
			showToast("Success", "Post created successfully", "success");
			onClose();
			setPostText("");
			setImgUrl("");
		} catch (error) {
			console.log(error);
			
			showToast("Error", error.message || error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position={"fixed"}
				bottom={10}
				right={5}
				bg={useColorModeValue("gray.300", "gray.dark")}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
			>
				<AddIcon />
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder="Post content goes here.."
								value={postText}
								onChange={handleTextChange}
								resize="none"
								sx={{
									"&::-webkit-scrollbar": {
										width: "0px",
										height: "0px",
									},
									"&::-webkit-scrollbar-thumb": {
										background: "transparent",
									},
									"&::-webkit-scrollbar-track": {
										background: "transparent",
									},
									"&:focus": {
										boxShadow: "none !important", // Remove the default focus box-shadow
										outline: "none !important", // Remove the outline
									},
								}}
							/>
							<Text
								fontSize="xs"
								fontWeight="bold"
								textAlign={"right"}
								m={"1"}
								color={"gray.500"}
							>
								{remainingChar}/{MAX_CHAR}
							</Text>
							<Input
								type="file"
								hidden
								ref={imageRef}
								onChange={handleImageChange}
							/>
							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>
						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt="Selected img" />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
export default CreatePost;
