const  users = [];

//addUser, removeUser, getUser, getUserInRooms

const addUser = ({id, username, room})=>{
//Clean the data
username = username.trim().toLowerCase();
room = room.trim().toLowerCase();

//validate the data 
    if(!username || !room){
        return {
            error:{
                error:'Username and room are required!'
            }
        }
    }
    //check for existing users
    const existingUser = users.find((user)=>{
        return user.room ==room && user.username === username
    })
    if(existingUser){
        return {
            error:{
                error:'Username is in use!'
            }
        }
    }
    const user ={id,username,room}
    users.push(user)
    return {user}

}
const removeUser = (id)=>{
     const index = users.findIndex((user)=>{
        return user.id === id
     })
     if(index !== -1){
        return users.splice(index,1)[0]
     }
}

const  getUser = (id)=>{
    const user =  users.find((user)=>{
        return user.id === id
    })
    return user;
}
const getUsersInRoom = (roomName)=>{
 return  users.filter((user)=> user.room == roomName)
}

module.exports ={addUser, removeUser, getUser, getUsersInRoom}