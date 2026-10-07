const API_URL = "http://localhost:11434/api/chat";

const app = document.getElementById("app");
const landing = document.getElementById("landing");
const chat = document.getElementById("chat");
const mobileNav = document.getElementById("mobileNav");
const messages = document.getElementById("messages");
const draft = document.getElementById("draft");
const sendButton = document.getElementById("sendButton");
const composer = document.getElementById("composer");
const chatIntro = document.getElementById("chatIntro");

let conversationId = null;
let isBusy = false;
let shouldFollowStream = true;
let streamTimer = null;

function showChat() {
  landing.hidden = true;
  chat.hidden = false;
  mobileNav.hidden = true;
  draft.focus();
}

function showLanding() {
  chat.hidden = true;
  landing.hidden = false;
}

function toggleTheme() {
  app.classList.toggle("theme-light");
  app.classList.toggle("theme-dark");
}

function setBusy(value) {
  isBusy = value;
  draft.disabled = value;
  sendButton.disabled = value;
  composer.classList.toggle("is-busy", value);
  draft.placeholder = value ? "mirAi düşünüyor..." : "İçinden geçenleri yaz...";
}

function followMessages() {
  if (!shouldFollowStream) return;
  messages.scrollTop = messages.scrollHeight;
}

function addMessage(role, content) {
  chatIntro.hidden = true;
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = `<span class="message-label">${role === "user" ? "Sen" : "mirAi"}</span><p></p>`;
  item.querySelector("p").textContent = content;
  messages.appendChild(item);
  followMessages();
  return item.querySelector("p");
}

function addThinking() {
  const thinking = document.createElement("div");
  thinking.className = "thinking-state";
  thinking.innerHTML = `<span class="thinking-orb">✦</span><span>mirAi çözümlüyor</span><i></i><i></i><i></i>`;
  messages.appendChild(thinking);
  followMessages();
  return thinking;
}

function streamReply(reply) {
  const target = addMessage("assistant", "");
  const cursor = document.createElement("span");
  cursor.className = "stream-cursor";
  const chunks = reply.split(/(\s+)/).filter(Boolean);
  let index = 0;

  setBusy(true);
  streamTimer = window.setInterval(() => {
    const chunk = chunks[index++];
    if (chunk === undefined) {
      window.clearInterval(streamTimer);
      streamTimer = null;
      cursor.remove();
      setBusy(false);
      draft.focus();
      return;
    }

    target.textContent += chunk;
    target.appendChild(cursor);
    followMessages();
  }, 42);
}

async function sendMessage() {
  const content = draft.value.trim();
  if (!content || isBusy) return;

  shouldFollowStream = true;
  addMessage("user", content);
  draft.value = "";
  setBusy(true);
  const thinking = addThinking();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mirai", // ollama create komutuyla oluşturduğunuz model adı
        messages: [{ role: "user", content: content }],
        stream: false
      }),
    });

    if (!response.ok) {
        throw new Error("Ollama'ya ulaşılamadı. Arka planda çalıştığından emin ol.");
    }

    const data = await response.json();
    const botCevabi = data.message.content; 
    
    thinking.remove();
    window.setTimeout(() => streamReply(botCevabi), 260);

  } catch (error) {
    thinking.remove();
    const message = error instanceof Error ? error.message : "Yerel bağlantıda bir sorun oluştu.";
    window.setTimeout(() => streamReply(message), 260);
  }
}

document.querySelectorAll(".js-start-chat").forEach((button) => button.addEventListener("click", showChat));
document.querySelectorAll(".js-home").forEach((button) => button.addEventListener("click", showLanding));
document.getElementById("homeButton").addEventListener("click", showLanding);
document.getElementById("themeButton").addEventListener("click", toggleTheme);
document.getElementById("chatThemeButton").addEventListener("click", toggleTheme);
document.getElementById("menuButton").addEventListener("click", () => { mobileNav.hidden = !mobileNav.hidden; });
document.getElementById("closeMenuButton").addEventListener("click", () => { mobileNav.hidden = true; });
document.getElementById("newChatButton").addEventListener("click", () => {
  conversationId = null;
  messages.querySelectorAll(".message,.thinking-state").forEach((node) => node.remove());
  chatIntro.hidden = false;
  draft.value = "";
  draft.focus();
});

document.querySelectorAll("[data-starter]").forEach((button) => {
  button.addEventListener("click", () => {
    draft.value = button.dataset.starter;
    draft.focus();
  });
});

sendButton.addEventListener("click", sendMessage);
draft.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
messages.addEventListener("scroll", () => {
  shouldFollowStream = messages.scrollHeight - messages.scrollTop - messages.clientHeight < 90;
});
