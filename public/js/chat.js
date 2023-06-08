const socket  =io()
socket.on('welcomeMessage',(message)=>{
    console.log(message)
})
// document.querySelector(`#increment`).addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })

 const msgForm = document.querySelector('form')
 msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.querySelector("input");
   console.log('form submited');
   socket.emit('messageSend',message.value)
  });
  