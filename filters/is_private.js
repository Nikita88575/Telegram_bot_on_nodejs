async function isPrivateChat(msg) {
  return msg.chat.type === 'private';
}

export default isPrivateChat;
