import { Tabs,AuthContext,DOMAIN } from '../App'
import { useContext, useEffect, useState } from 'react'
const logo="/logo.svg"

function Header(prps){
    const navList=Object.values(Tabs)
    const {activeTab,setTab,headHeight}=prps
    const [profile,setProfile]=useState(false)
    const {loggedUser}=useContext(AuthContext)

    const navDivs=navList.map(name=>{
        if(name===Tabs.PROFILE)
            return <span onClick={()=>{
                if(!loggedUser)
                    return setTab(name)
                setProfile(prev=>!prev)
            }}>{name}</span>
        if(activeTab===name)
            return <span style={{color:"var(--green)"}}>{name}</span>
        return(
            <span onClick={()=>setTab(name)}>{name}</span>
        )
    })
    return(
        <div>
            <header>
                <div style={{flex:"1",display:"flex",color:"#fff",cursor:"pointer"}}
                    onClick={()=>setTab(Tabs.HOME)}
                >
                    <img className="app-icon" src={logo} alt="logo"/>
                    <h1>Spectrum</h1>
                </div>
                <nav>{navDivs}</nav>
            </header>
            {
                profile && <Popup setProfile={setProfile} headHeight={headHeight}/>
            }
        </div>
    )
}

function Popup(prps){
    const [hovStyl,setStyle]=useState({})
    const [loading,setLoading]=useState(false)
    const [errorMsg,setErrorMsg]=useState({})
    const {setLoggedUser}=useContext(AuthContext)
    const {setProfile,headHeight}=prps
    const divStyl={
        // backgroundColor:"var(--green)",
        color:"var(--green)",
        cursor:"pointer"
    }
    console.log("headHeight",headHeight)
    useEffect(()=>{
        if(!loading)
            return
        async function fetchData(){
            try {
                const res=await fetch(DOMAIN+"/users/logout",{
                    method:"get",
                    credentials:"include"
                })
                const data=await res.json()
                if(data.status){
                    setErrorMsg({logout:"Successfully Logged out!!"})
                    setProfile(false)
                    setLoggedUser(null)
                }
                else{
                    console.log(data)
                    setErrorMsg({logout:data.msg})
                }
            } catch (error) {
                
            }
        }
        fetchData()
    },[loading])

    return(
        <div style={{
            backgroundColor:"#fff",top:headHeight,
            position:"absolute",right:"2rem",padding:".8rem",
            boxShadow:"0px 0px 9px var(--shadow)"
            }} className="flex-col align-center" onMouseLeave={()=>setStyle({})}>
            <div style={hovStyl.edit||{}} onMouseOver={()=>{
                setStyle({edit:divStyl})
            }}>Edit Profile</div>
            <hr style={{width:"95%"}}/>
            <div style={hovStyl.del||{}} onMouseOver={()=>{
                setStyle({del:divStyl})
            }}>Delete Account</div>
            <hr style={{width:"95%"}}/>
            <div style={hovStyl.log||{}}
            onClick={()=>{
                setLoading(true)
            }}
            onMouseOver={()=>{
                setStyle({log:divStyl})
            }}>
                {
                    errorMsg.logout?<span style={{color:"red"}}>{errorMsg.logout}</span>:(
                        loading?
                        <img style={{width:"3rem",filter:"invert(1)"}} alt="loading" src="load.svg"/>:
                        <>Logout</>
                    )
                }
            </div>
        </div>
    )
}

export default Header