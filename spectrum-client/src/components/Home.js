import {useState,useContext,useEffect} from 'react'
import Login from './Login'
import { AuthContext } from '../App'
import { Tabs } from '../App'
export const Auth={
    LOGIN:"Login",
    REGISTER:"Register",
    VISIT:"Visit"
}
function Home(prps){
    const [auth,setAuth]=useState(Auth.VISIT)
    const {loggedUser}=useContext(AuthContext)
    const {setTab,activeTab}=prps

    useEffect(()=>{
        if(!loggedUser&&activeTab!==Tabs.HOME)
            setAuth(Auth.LOGIN)
        else setAuth(Auth.VISIT)
    },[activeTab])

    if(auth!==Auth.VISIT)
        return(
            <div style={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                flex:".8"
                }}>
                <Login auth={auth} setAuth={setAuth}/>
            </div>
        )
    return(
        <div className="home-div">
            <div style={{flex:"2"}}>
                <p className="home-div-heading">
                    Demonstrate, Tutor or<br/>
                    Show Your Gaming Skills
                </p>
                <p style={{color:"#fff"}}>
                    Record your screen easily and share it with your friends ; )
                </p>
            </div>
            <div style={{flex:"1"}}>
                <button onClick={()=>{
                    if(loggedUser) setTab(Tabs.RECORD)
                    else setAuth(Auth.LOGIN)
                }}>Get Started</button>
            </div>
        </div>
    )
}

export default Home