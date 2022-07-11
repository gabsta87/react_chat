import { useState } from "react";
import "react-chat-elements/dist/main.css";
import { writeUserToDB } from "./util";

const Subscribe = (props) => {
    const dbConnect = props.dbConnect;
    // const tableName = "Users";
    let re = new RegExp(`(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])`, 'i')
    
    const [pseudo, setPseudo] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");

    // const getUsersList = async() =>{
    //     const data =await dbConnect.getData(tableName);
    //     console.log("Subscribe:usersList = ",data);
    // }
    
    const registerInDb = () => {
        // TODO check if user/email already exists
        console.log(pseudo,mail,password);
        
        writeUserToDB(dbConnect,pseudo,mail,password);
        setPseudo("");
        setMail("");
        setPassword("");
    }

    const adaptButton = (target) => {
        let newValue = target.value;
        // TODO change item's class and manage style in CSS
        if(!newValue==="" || !newValue.match(re)){
            target.style="background-color:#ff5f0f;"
            document.querySelector("#subscribe").disabled = true;
            document.querySelector("#subscribe").style="background-color:grey;";
        }else{
            target.style="background-color:white;"
            document.querySelector("#subscribe").disabled = false;
            document.querySelector("#subscribe").style="";
        }
    }

    return(<div className="subscriber_container">
    <div className="subscribe_items">
        <input id="pseudo" placeholder="Pseudo" value={pseudo} onChange={evt => setPseudo(evt.target.value)}></input>
        <input id="mail" placeholder="email" value={mail} onChange={evt =>{
            setMail(evt.target.value);
            adaptButton(evt.target);
        }}></input>
        <input id="password" placeholder="password" type="password" value={password} onChange={evt => setPassword(evt.target.value)}></input>
        <button id="subscribe" onClick={_=>registerInDb()}>Subscribe</button>
    </div>
    </div>
    );
}

export default Subscribe;