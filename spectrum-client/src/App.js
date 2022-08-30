import React,{ useState,useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import Home from './components/Home';
import Recordings from './components/Recordings';
import './App.css';

// export const DOMAIN="http://localhost:5000"
export const DOMAIN=""

export const Tabs={
  HOME:"Home",
  RECORD:"Record",
  RECORDINGS:"Recordings",
  PROFILE:"Profile"
}
export const AuthContext=React.createContext()

function App() {
  const [activeTab,setTab]=useState(Tabs.HOME)
  const [loggedUser,setLoggedUser]=useState(()=>{
    const res=localStorage.getItem("auth")
    if(res){
      const obj=JSON.parse(res)
      return obj.user
    }
    return null
  })

  //save changes to loggedUser state
  useEffect(()=>{
    console.log("updating auth",Date.now())
    localStorage.setItem("auth",JSON.stringify({user:loggedUser}))
  },[loggedUser])

  var appDiv
  switch(activeTab){
    case Tabs.HOME:
      appDiv=(<Home setTab={setTab} activeTab={activeTab}/>)
      break
    case Tabs.RECORD:
      appDiv=(<Body/>)
      if(loggedUser)break
    case Tabs.RECORDINGS:
      appDiv=<Recordings/>
      if(loggedUser)break
    default:
      appDiv=(<Home setTab={setTab} activeTab={activeTab}/>)
  }

  const [headHeight,setHeadHeight]=useState("100px")
  useEffect(()=>{
    const css=getComputedStyle(document.querySelector("header"))
    setHeadHeight(css.height)
  },[])
  return (
    <AuthContext.Provider value={{loggedUser,setLoggedUser}}>
      <Header activeTab={activeTab} setTab={setTab} headHeight={headHeight}/>
      <div style={{height:headHeight}}></div>
      <main style={{minHeight:"85vh"}} className="flex">
        {appDiv}
      </main>
    </AuthContext.Provider>
  );
}

export default App;
