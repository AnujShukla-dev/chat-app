const socket = io();
const messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;
//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const autoScroll = () => {
  //New Message Element
  const $newMessage = messages.lastElementChild;
  //Height of last message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight+newMessageMargin

  //visible height
  const visibleHeight = messages.offsetHeight;

  //Height of messages conatianer
  const containerHeight = messages.scrollHeight;
  //How farr have i scroll
  const scrollOffset = messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};
socket.on("welcomeMessage", (message) => {
  console.log(message);
  const htmlMessage = Mustache.render(messageTemplate, {
    messageData: message.text,
    userName: message.username,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", htmlMessage);
  autoScroll();
});
socket.on("locationMessage", (message) => {
  console.log(message);
  const htmlLocation = Mustache.render(locationMessageTemplate, {
    locationLink: message.url,
    userName: message.username,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  autoScroll();
});
//server(emit)-->client(receive) -- acknowledgement -->server
//cleint (emit) -->server(receive) --acknowledegement --> client

const msgForm = document.querySelector("#message-form");
const message = msgForm.querySelector("input");
const messageFromButton = msgForm.querySelector("button");
const locationBtn = document.querySelector("#send-location");
msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable
  messageFromButton.setAttribute("disabled", "disabled");
  console.log("form submited");
  socket.emit("messageSend", message.value, (error) => {
    messageFromButton.removeAttribute("disabled", "disabled");
    message.value = "";
    message.focus();
    if (error) {
      console.log(error);
    } else {
      console.log("the message was delivered");
    }
  });
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your Browser");
  }
  locationBtn.setAttribute("disable", "disable");
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position", position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    socket.emit(
      "sendLocation",
      { latitude: latitude, longitude: longitude },
      (acknowledegement) => {
        locationBtn.removeAttribute("disable");
        console.log(acknowledegement);
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("the message was delivered");
  }
});

socket.on("roomData", ({ room, users }) => {
  console.log(room, users);
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});
