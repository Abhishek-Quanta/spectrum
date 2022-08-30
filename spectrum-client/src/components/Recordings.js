import { useEffect,useState,useContext } from "react"
import {DOMAIN,AuthContext} from "../App"

function Recordings(){
    const recDivs=[]
    const [recordings,setRecordings]=useState(null)
    const [video,setVideo]=useState(null)
    const {loggedUser}=useContext(AuthContext)
    
    if(!recordings)
        recDivs.push(recordDiv())
    else
        for(var rec of recordings){
            recDivs.push(recordDiv(rec,setVideo,setRecordings,loggedUser))
        }
    
    useEffect(()=>{
        async function fetchData(){
            try {
                const res=await fetch(DOMAIN+"/recordings",{
                    method:"post",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({user:loggedUser}),
                    credentials:"include"
                })
                const obj=await res.json()
                setRecordings(()=>{
                    if(obj.status)
                        return obj.data
                    return []
                })
                // console.log("recordings",obj.data,recordings)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    },[])

    return(
        <>
        {
            video?
                <div style={{
                    flex:"1",
                    display:"flex",
                    flexDirection:"column",
                    color:"#fff"
                    // alignItems:"center"
                }}>
                    <div style={{
                        backgroundColor:"var(--green)",
                        display:"flex",
                        flexDirection:"column"
                        }}>
                        <span className="back-span" onClick={()=>setVideo(null)}>{"< Back"}</span>
                        <span style={{
                            alignSelf:"center",
                            padding:"0 0 1rem 0 ",
                            cursor:"default"
                            }}>{video.title}</span>
                    </div>
                    <video style={{alignSelf:"center"}} src={`${DOMAIN}/video/${video._id}`} controls/>
                </div>:
                <div style={{flex:"1"}}>
                {
                    recordings?
                        recDivs:
                        <div style={{
                            display:"flex",
                            justifyContent:"center",
                            height:"80vh",
                        }}>
                            <img style={{width:"10vw"}} src="load.svg" alt="loading"/>
                        </div>
                }
            </div>
        }</>
    )
}

function recordDiv(doc,setVideo,setRecordings,loggedUser){
    const divStyle={
        display:"flex",
        flexDirection:"column",
        backgroundColor:"#fff",
        padding:"1.2rem 2rem",
        margin:".7rem",
        borderRadius:".5rem",
        boxShadow:"2px 2px 7px var(--shadow)",
    }
    const spanStyle={
        paddingTop:".5rem",
        fontSize:".8rem",        
    }

    // const {name}=prps
    if(!doc)
        return(
            <div style={divStyle}>
                You Have no Recordings...
            </div>
        )
    var date=doc.created_on.replace(/(?<=:..):.*/,"")
    date=date.replace(/T{1}/," ")

    return(
        <div style={divStyle}>
            <span style={{cursor:"pointer"}} onClick={()=>setVideo(doc)}>{doc.title}</span>
            <div className="flex justify-between align-center">
                <span style={spanStyle}>Created On {date}</span>
                <img className="small-icon"
                    onClick={async()=>{
                        const yes=window.confirm("Do you want to delete the recording?")
                        if(yes){
                            try {
                                const res=await fetch(DOMAIN+"/delete/"+doc._id,{
                                    method:"post",
                                    headers:{"content-type":"application/json"},
                                    body:JSON.stringify({user:loggedUser}),
                                    credentials:"include"
                                })
                                const obj=await res.json()
                                console.log(obj)
                                if(obj.status){
                                    setRecordings(prev=>
                                        prev.filter(rec=>rec._id!==doc._id)
                                    )
                                }
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }}
                    style={{alignSelf:"flex-end"}}
                    src="delete.svg"
                    alt="delete"/>
            </div>
        </div>
    )
}
export default Recordings