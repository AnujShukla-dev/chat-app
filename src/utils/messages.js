const generateMessage = (username,text) => {
    console.log(username)
  return {
    text:text,
    createdAt: new Date().getTime(),
    username:username
  };
};

const generateLocatiopnUrl = (usernanme, { latitude, longitude })=>{
    return {
        url:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
        usernanme:usernanme
    }
}
module.exports = { generateMessage,generateLocatiopnUrl };
