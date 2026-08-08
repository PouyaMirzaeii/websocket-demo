const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Establish WebSocket connection
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

ws.onopen = () => {
  // Update status UI with GREEN CHECK
  statusIndicator.classList.remove('offline');
  statusIndicator.classList.add('online');
  statusText.textContent = 'Connected';

  messageInput.disabled = false;
  sendBtn.disabled = false;
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  appendMessage(data.text, data.type);
};

ws.onclose = () => {
  statusIndicator.classList.remove('online');
  statusIndicator.classList.add('offline');
  statusText.textContent = 'Disconnected';

  messageInput.disabled = true;
  sendBtn.disabled = true;
};

function sendMessage() {
  const text = messageInput.value.trim();
  if (text && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ text }));
    messageInput.value = '';
  }
}

function appendMessage(text, type) {
  const msgEl = document.createElement('div');
  msgEl.classList.add('msg', type);
  msgEl.textContent = text;
  messagesContainer.appendChild(msgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
