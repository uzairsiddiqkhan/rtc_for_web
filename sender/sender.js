const webSocket =new webSocket("ws://127.0.0.1:8080")

let userName
let local_stream
let peerConn

webSocket.onmessage= (event) => {

    handSignalingData(JSON.parse(event.data))
}
function handSignalingData (data){
    switch(data.type){ 
        case "answer" :peerConn.setRemoteDescription(data.answer)
        break

        case "candidate" : peerConn.addIceCandidate(data.candidate)

    }
}

function sendUserName(){

    userName = document.getElementById("userName_input").value
    sendDate({
        type: "store_user"
    })
}
function storeData(data){
    data.userName =userName
    websocket.send =(JSON.stringify(data))

}

function startCall(){

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
                        type : "store_candidate",
                        candidate : e.candidate
                    })
            })

            createAndSendOffer()
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
function createAndSendOffer(){
    peerConn.createOffer((offer=>{
        sendData({

            type: "store_offer",
            offer : offer
        })

        peerConn.setLocalDescription(offer)
       
    },
    (error) => {
        console.log(error)
    }
        ))
}

let isAudio =true 
function muteAudio(){
    isAudio = !isAudio

    local_stream.getAudioTracks()[0].enabled =isAudio
}


