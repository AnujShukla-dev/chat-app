const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocatiopnUrl = ({ latitude, longitude })=>{
    return {
        url:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
    }
}
module.exports = { generateMessage,generateLocatiopnUrl };
