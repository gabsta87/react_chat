import { getAuth, GoogleAuthProvider,onAuthStateChanged, signOut, signInWithPopup, signInAnonymously} from "firebase/auth";
import { useState,useEffect } from "react";
import { writeUserToDB } from "./util";
import { Link,useNavigate } from "react-router-dom";

const Login = (props) => {
    const auth = getAuth(props.app);
    const provider = new GoogleAuthProvider();
    const [buttonTxt, setButtonTxt] = useState("Login with Google");
    const [buttonTxtAn, setButtonTxtAn] = useState("Login Anonymously");
    const [userName,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const usersTableName = "Users";
    let navigate = useNavigate();
    let usersList = [];

    const getUsers = async() => {
        const dbConnect = props.dbConnect;
        const promise = dbConnect.getData(usersTableName);
    }

    useEffect(_=>
    onAuthStateChanged(auth,(user)=>{
        props.setCurrentUser(user);
        if(user){
            setButtonTxt("Logout");
        }else{
            setButtonTxt("Login with Google");
        }
    }),[]);

    const redirect = () =>{
        if(window.location.pathname.toLowerCase() === `/subscribe`)
            navigate("/home");
    }

    return(<>
    <div id="login_items">
        {props.currentUser === null && 
        <>
            <Link to="/Subscribe">Subscribe</Link>
        <div>
            <input placeholder="Username" value={userName} onChange={evt => setUsername(evt.target.value)}/>
            <input placeholder="Password" value={password} type="password" onChange={evt => setPassword(evt.target.value)}/>
        </div>
        </>
        }
        {props.currentUser !==null && <span >{props.currentUser.displayName}</span>}
        <button id="logButton" onClick={async _=>{
            if(props.currentUser){
                signOut(auth);
            }else{
                await signInWithPopup(auth, provider)
                .then(result=>{
                    // TODO avoid overriding
                    getUsers();
                    writeUserToDB(props.dbConnect,auth.currentUser.displayName,auth.currentUser.email,auth.currentUser.uid)
                    redirect();
                }
                );
            }
        }}
        >{buttonTxt}</button>

        {props.currentUser === null &&
        <button id="logAnonymousButton" onClick={async _=>{
            signInAnonymously(auth)
            .then((result) => {
                writeUserToDB(props.dbConnect,"Anonymous","No email",result.user.uid)
                redirect();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Login:anonymousLogResult error = ",error);
            });
        }}>{buttonTxtAn}</button>
        }
    </div>
    </>);
}

export default Login;