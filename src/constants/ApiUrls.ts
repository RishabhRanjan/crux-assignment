const baseUrl = process.env.REACT_APP_API_URL;

const ApiEndpoint = {
  ask: `${baseUrl}/ask`,
  editTitle: `${baseUrl}/edit-title`,
  newChat: `${baseUrl}/new-chat`,
  feedback: `${baseUrl}/feedback`,
  getHistory: `${baseUrl}/history`,
  deleteChat: `${baseUrl}/delete-chat`,
  getChats: `${baseUrl}/chats`,
};

export default ApiEndpoint;
