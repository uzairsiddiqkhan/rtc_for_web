const Socket =require("websocker").server
const http =require ("http")
const server = http.createServer((req,res)=> {})
server.listen(5050, () =>{
    console.log("listening on port 5050")
})

const webSocket =new webSocket ({ httpServer : server})

let user =[]

webSocket.on("request",(req)=>{
    const connection =req.accept()


    connection.on("message",(message)=>{
        const data = JSON.parse(message.utf8Data)


        switch (data.type){

  
            case "store_user" :

                if (user != null){
                    return
                }

                const newUser={
                    conn :connection,
                    userName : data.userName
                }

                user.push(newUser)
                console.log(newUser.userName)
                break

            case   "store_offer" :  

            if (user == null){
                return
            }  
            user.offer= data.offer
            break


         case "store_candidate":

            if (user == null){
                return
            } 
            if(user.store_candidate == null)
              user.candidate = []

              user.candidate.push(candidate.data)
                break

            case "send_answer" :
                if(user ==null ){
                    return
                }
                sendData({
                    type: "answer" ,
                    answer :data.answer

                }, user.conn)
                break

            case "send_candidate" :

                if(user ==null ){
                    return
                }
                sendData({
                    type:"candidate",
                    candidate :data.candidate

                }, user.conn)
                break
            case  "Join_call" :
                if(user ==null){
                    return
                }
                sendData({
                    type = "offer" ,
                    offer :user.offer
                })  

                user.candidate.array.forEach(candidate => {
                    sendData({
                        type = "candidate",
                        candidate :candidate
                    }, connection)
                });  

                break

        }

    })

    connection.on('close',(reason, description) => {
        users.forEach(user=>{
            if(user.conn =connection){
                users.splice(users.indexOf(user),1)
                return
            }
        }

        )
    }) 

    
})
function findUser(userName){
    for(let i=0; i< user.length ; i++){
        if(user[i].userName== userName){
            return user[i]
        }
    }
}

function sendData (data, conn)[
    conn.send(JSON.stringify(data))
]

