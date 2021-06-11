const socket = io("http://localhost:8000", { transports: ["websocket"] });
const form = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messageContainer = document.querySelector(".container");
const user = document.getElementById("user");
const audio = new Audio("ting.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position !== "right") audio.play();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  messageInput.value = "";
  append(`<b>You: </b> ${message}`, "right");
  socket.emit("send", message);
});
const name = prompt("Enter name you want to join as");
// console.log(name);
user.innerHTML = `Welcome <b>${name}</b>`;
socket.emit("new-user-joined", name);
socket.on("user-joined", (name) => {
  append(`<i>${name}</i> joined the chat`, "center");
  //   console.log(user);
});
socket.on("receive", (data) => {
  append(`<b>${data.name}: </b> ${data.message}`, "left");
});
socket.on("left", (name) => {
  append(`<i>${name}</i> left the chat`, "center");
});
