const socket = io();
const messages = document.querySelector('#messages') 

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
socket.on("welcomeMessage", (message) => {
  console.log(message);
  const htmlMessage = Mustache.render(messageTemplate,{
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
    });
   messages.insertAdjacentHTML('beforeend', htmlMessage)

});
socket.on("locationMessage", (message) => {
    console.log(message.url);
    const htmlLocation = Mustache.render(locationMessageTemplate,{
        locationLink:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',htmlLocation)
  
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
  messageFromButton.setAttribute('disabled','disabled')
  console.log("form submited");
  socket.emit("messageSend", message.value, (error) => {
    messageFromButton.removeAttribute('disabled','disabled')
    message.value ='';
    message.focus()
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
  locationBtn.setAttribute('disable','disable');
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position", position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    socket.emit("sendLocation", { latitude: latitude, longitude: longitude },(acknowledegement)=>{
        locationBtn.removeAttribute('disable')
        console.log(acknowledegement);
    });
  });
});
