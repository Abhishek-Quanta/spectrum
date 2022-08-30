import { useState,useEffect,useContext } from 'react'
import {Auth} from './Home'
import { AuthContext,DOMAIN } from '../App'
const loginStyle={
    flex:".4",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"space-between",
    minHeight:"50vh",
    backgroundColor:"#fff",
    borderRadius:"1rem",
    padding:"2rem 0",
    boxShadow:"4px 7px 18px var(--shadow)"
}
function Login(prps){
    const {auth,setAuth}=prps
    //fetch to login
    const [loading,setLoading]=useState(false)
    const [userCred,setUserCred]=useState({})
    const [errorMsg,setErrorMsg]=useState({})
    //context value to set auth information
    const {loggedUser,setLoggedUser}=useContext(AuthContext)

    useEffect(()=>{
        if(!loading)
            return
        async function fetchData(){
            try {
                if(auth===Auth.REGISTER){
                    if(userCred.pass!==userCred.confirmPass){
                        setErrorMsg({confirmPass:"Enter Same Password"})
                        setLoading(false)
                        return
                    }
                    else if(userCred.pass.length<8){
                        setErrorMsg({pass:"Minimum length of Password is 8"})
                        setLoading(false)
                        return
                    }
                    const res=await fetch(DOMAIN+"/users/register",{
                        headers:{"Content-Type":"application/json"},
                        method:"post",
                        body:JSON.stringify(userCred)
                    })
                    const data=await res.json()
                    if(data.status){
                        setErrorMsg({success:"Account Created!!"})
                    }
                    else if(data.msg==="emailExists"){
                        setErrorMsg({email:"Email Account already Exists"})
                    }
                    else setErrorMsg({confirmPass:data.msg})
                }
                else{
                    if(userCred.pass.length<8){
                        setErrorMsg({pass:"Minimum length of Password is 8"})
                        setLoading(false)
                        return
                    }
                    const res=await fetch(DOMAIN+"/users/login",{
                        method:"post",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify(userCred),
                        credentials:"include"
                    })
                    const data=await res.json()
                    if(data.status){
                        setErrorMsg({success:"Login Successful!!"})
                        console.log('logg',loggedUser)
                        setLoggedUser(data.user)
                    }
                    else if(data.msg==="noUser"){
                        setErrorMsg({email:"No User with this email"})
                    }
                    else if(data.msg==="incorrect"){
                        setErrorMsg({pass:"Incorrect Password"})
                    }
                    else setErrorMsg({pass:data.msg})
                }
                setLoading(false)
            } catch (error) {
                setErrorMsg({pass:"something went wrong"})
            }
        }
        fetchData()
        console.log(userCred)
    },[loading])
    return(
        <form style={loginStyle}
            onSubmit={e=>{
                e.preventDefault()
                setErrorMsg({})
                setLoading(true)
            }}>
            <span style={{
                fontSize:"1.3rem",
                fontVariantCaps:"all-small-caps",
                paddingBottom:".8rem"
                }}>{auth}</span>
            <div className="flex-col" style={{width:"80%"}}>
                {
                    auth===Auth.REGISTER &&
                    <>
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" required onChange={e=>setUserCred(prev=>{
                        return {...prev,name:e.target.value}
                    })}
                    style={{marginBottom:"1rem"}}></input>
                    </>
                }
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" required onChange={e=>setUserCred(prev=>{
                    return {...prev,email:e.target.value}
                })}></input>
                <span className="error-span">{errorMsg.email||false}</span>
                <label htmlFor="pass">Password</label>
                <input id="pass" type="password" name="pass" required onChange={e=>setUserCred(prev=>{
                    return {...prev,pass:e.target.value}
                })}></input>
                <span className="error-span">{errorMsg.pass||false}</span>
                {
                    auth===Auth.REGISTER &&
                    <>
                    <label htmlFor="confirmPass">Confirm Password</label>
                    <input id="confirmPass" type="password" name="confirmPass" required onChange={e=>setUserCred(prev=>{
                        return {...prev,confirmPass:e.target.value}
                    })}></input>
                    <span className="error-span">{errorMsg.confirmPass||false}</span>
                    </>
                }
                <span className="msg-span">{errorMsg.success||false}</span>
                {
                    auth===Auth.REGISTER?
                        <span className="link-span"
                            onClick={()=>{setAuth(Auth.LOGIN)}}
                        >Already Have Account?</span>:
                        <div style={{
                            display:"flex",
                            justifyContent:"space-between",
                            }}>
                            <span className="link-span">Forgot Password?</span>
                            <span className="link-span" onClick={()=>{setAuth(Auth.REGISTER)}}>Create an Account</span>
                        </div>
                }
            </div>
            {loading?
                <button>
                    <img style={{width:"3rem"}} alt="loading" src="load.svg"/>
                </button>
                :<button type="submit" style={{paddingLeft:"2rem",paddingRight:"2rem"}}
                    >{auth}</button>
            }
        </form>
    )
}

export default Login