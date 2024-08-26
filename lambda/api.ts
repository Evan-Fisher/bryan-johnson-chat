exports.handler = async (event: any) => {
  console.log("HTTP Method:", event.httpMethod);
  console.log("Path:", event.path);

  switch (event.path) {
    case "/hello":
      if (event.httpMethod === "GET") {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Hello World!" }),
        };
      }
      break;
    // Add more cases for other routes and methods
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
      };
  }
  return;
};
