const webSocket =new webSocket("ws//:127.0.0.1:8080")

let userName
let local_stream
let peerConn

webSocket.onmessage= (event) => {

    handSignalingData(JSON.parse(event.offer))
    createAndSendAnswer()
}

function createAndSendAnswer(){

    peerConn.createAnswer((answer)=>{
        peerConn.setLocalDescription(answer)
        sendData({
            type : answer,
            answer : answer
        })
    }, 
     error =>{
        error.log(error)
     }

    
    )
}

function handSignalingData (data){
    switch(data.type){ 
        case "offer" :peerConn.setRemoteDescription(data.answer)
        break

        case "candidate" : peerConn.addIceCandidate(data.candidate)

    }
}


function storeData(data){
    data.userName =userName
    websocket.send =(JSON.stringify(data))

}

function JoinCall(){
    userName = document.getElementById("userName_input").value

    document.getElementById("video-call-div").style.display ="inline"

    navigator.getUserMedia({
       

        // video : true,

        video :{
            frameRate : 24, 
            width : {
                min : 480 , ideal: 780 , max : 1280
            } ,

            aspectRatio :1.3333 } ,

            audio : true  },

           (stream)=>{

            local_stream = stream 
            document.getElementById("local-video").srcObject =local_stream

            let configuration ={
                iceServers :[
                      {   "urls" : [
                       "stun.l.google.com:19302",
                      "stun1.l.google.com:19302",
                      "stun2.l.google.com:19302" ,
                      "stun3.l.google.com:19302",
                      "stun4.l.google.com:19302"
                      
                      ] }
                ]
            }

            peerConn =new RTCPeerConnection(configuration)
            peerConn.addStream(local_stream)

            peerConn.onaddstream = (e) => {
                    document.getElementById("remote-video").srcObject =e.stream
            }

            peerConn.onicecandidate =  ((e) =>{
                    if (e.candidate ==null)
                    return

                    sendData ({
                        type : "send_candidate",
                        candidate : e.candidate
                    })
            })

            sendData({
                type : "JoinCall"

            })

          
        },

        (error)=>{
            console.log(error)
        }

       
      
    )
} 


let isVideo =true
function muteVideo(){
    isVideo = !isVideo

    local_stream.getAudioTracks()[0].enabled =isVideo
}


let isAudio =true 
function muteAudio(){
    isAudio = !isAudio

    local_stream.getAudioTracks()[0].enabled =isAudio
}


