class ApiResponse {
	constructor(statusCode, data, message = null) {
		this.statusCode = statusCode;
		this.data = data;
		this.message = message || (statusCode < 400 ? "Success" : "Error");
		this.success = statusCode < 400;
	}
}

export { ApiResponse };
