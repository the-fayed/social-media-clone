class ApiError extends Error {
  statuscode: number;
  status: string;
  constructor(message: string, statuscode: number) {
    super(message);
    this.statuscode = statuscode;
    this.status = `${statuscode}`.startsWith("4") ? "Fail" : "Error";
  }
}

export default ApiError;