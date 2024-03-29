// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageList, Input, Button } from 'react-chat-elements'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { onValue,ref,off } from "firebase/database";

const Discussion = (props) => {
    const param = useParams();
    const dbConnect = props.dbConnect;
    const tableName = "Messages"
    const usersTableName = "Users"
    const [messagesList,setMessagesList] = useState([]);
    const [userMessage,setUserMessage] = useState("");

    let listeners = [];
    let usersList = [];

    const messagesListener = ref(props.db,tableName+"/"+param.discussionID+"/");
    const usersListener = ref(props.db,usersTableName);

    listeners.push(messagesListener);
    listeners.push(usersListener);

    useEffect (() => {
        setMessagesList([]);

        onValue(usersListener,(snapshot) => {
            usersList = [];
            const object = snapshot.val();
            for (const key in object) {
                const user = object[key];
                usersList.push({...user, uid: key})
            }
        });

        onValue(messagesListener,(snapshot) => {
            if(usersList.length === 0 || !snapshot.exists())
                return;

            let tempMessages = [];
            Object.values(snapshot.val()).flatMap((elem,i) =>{
                return(
                tempMessages.push({
                    id: i,
                    backgroundColor: "black",
                    // position: 'left',
                    // TODO change side for current user's messages
                    // position: (elem.userId === props.currentUser ? 'right' : 'left'),
                    type: 'text',
                    text: elem.message,
                    title: usersList.find(u => u.uid === elem.userId)?.firstname,
                    date: new Date(elem.date)
                }))
            });
            setMessagesList(tempMessages);

        });
        return () => {
            listeners.forEach(element=>{
                off(element);
            });
            listeners = [];
            // Other possibility
            off(messagesListener);
        }
    },[param.discussionID])

    const inputReference = React.createRef();

    return(<>
        <MessageList
        id="my_messages"
        className='message-list'
        lockable={true}
        toBottomHeight={'100%'}
        dataSource={messagesList}
        />
        {props.currentUser !== null &&
        <Input
        referance={inputReference}
        id="input_field"
        placeholder="Type here..."
        multiline={true}
        onChange={evt => setUserMessage(evt.target.value)}
        rightButtons={<Button color="white" onClick={evt=>{
            const data = {message:userMessage,userId:props.currentUser.uid,date:new Date().toGMTString()}
            dbConnect.pushData(tableName+"/"+param.discussionID+"/",data)
            inputReference.current.value = "";
        }} text="Send" />}
        />
    }
    </>);
}

export default Discussion;