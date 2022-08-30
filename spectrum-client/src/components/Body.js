import {useState,useEffect,useContext} from 'react'
import { DOMAIN,AuthContext } from '../App'
const Record={
    START:"Start",
    STOP:"Stop"
}
function Body(){
    const [record,setRecord]=useState(Record.START)
    const [vidUrl,setVidUrl]=useState("")
    const [vidName,setVidName]=useState("Spectrum")
    const [downloadBut,setDownloadBut]=useState(false)
    const {loggedUser}=useContext(AuthContext)

    var mediaRecorder=null
    var chunks=[]
    function toggleRec(){
        if(record===Record.START){
            setRecord(Record.STOP)
            setDownloadBut(false)
        }
        else mediaRecorder?.stop() || setRecord(Record.START)
    }
    function onDownload(){
        const a=document.createElement('a')
        document.body.appendChild(a)
        a.style.display="none"
        a.href=vidUrl
        a.download=`${vidName}${Date.now()}`
        a.click()
        a.remove()
    }
    const displayMediaOpts={
        video:true,
        audio:true
    }
    useEffect(()=>{
        console.log('vidname',vidName)
        if(record===Record.STOP){
            startRec()
        }
    },[record])
    async function startRec(){
        try {
            const stream=await navigator.mediaDevices.getDisplayMedia(displayMediaOpts)
            mediaRecorder=new MediaRecorder(stream)
            mediaRecorder.ondataavailable=e=>{
                chunks.push(e.data)
            }
            mediaRecorder.onstart=()=>{
                console.log("recorder started")
            }
            mediaRecorder.onstop=async()=>{
                console.log("recorder stopped")
                const tracks=stream.getTracks()
                tracks.forEach(track=>track.stop())
                const blob=new Blob(chunks,{type:"video/mp4"})
                const url=URL.createObjectURL(blob)
                //set name
                var name=prompt("Enter Name of Recording")
                if(!name)
                    name=vidName
                
                try {
                    const formData=new FormData()
                    formData.append("file",blob,name+".mp4")
                    var res=await fetch(DOMAIN+"/record",{
                        method:"post",
                        body:formData,
                        credentials:"include"
                    })
                    var data=await res.json()
                    console.log(data)
                    if(data.status){
                        res=await fetch(DOMAIN+"/record/save",{
                            method:"post",
                            headers:{"content-type":"application/json"},
                            body:JSON.stringify({name,user:loggedUser}),
                            credentials:"include"
                        })
                        data=await res.json()
                        console.log(data)
                    }
                    setVidUrl(url)
                    setRecord(Record.START)
                    setDownloadBut(true)
                    setVidName(name)
                } catch (error) {
                    console.error(error)
                }
            }
            mediaRecorder.start()
        } catch (error) {
            console.log(error)
        }
    }

    return(
            <div className="home-div">
                <img style={{width:"70%"}} src="camcord.png" alt="illustration"/>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <button id="record" style={record==="Stop"?{backgroundColor:"red"}:{}} onClick={toggleRec}>{record} Recording</button>
                    {
                        downloadBut && <button onClick={onDownload}>Download</button>
                    }
                </div>
            </div>
    )
}

export default Body