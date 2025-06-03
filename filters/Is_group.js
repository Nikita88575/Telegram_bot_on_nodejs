async function isGroup(msg) {
  return msg.chat.type === 'group' || msg.chat.type == 'supergroup';
}

export default isGroup;
