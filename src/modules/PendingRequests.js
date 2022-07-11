import { useEffect, useState } from "react";
import { onValue,ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

const PendingRequests = (props) => {
    // TODO put this in database
    const minSubscribersRequired = 4;

    const tableName = "Requests";
    const activitiesTableName = "Activities";
    const [requestsList,setRequestsList] = useState([]);
    const [activitiesList,setActivitiesList] = useState([]);
    useEffect(_=> getContent(),[]);
    let navigate = useNavigate();
    const requestsListener = ref(props.db,tableName);
    const activitiesListener = ref(props.db,activitiesTableName);
    const [newActivity,setNewActivity] = useState("");

    var listeners = [];
    listeners.push(requestsListener);
    listeners.push(activitiesListener);

    const getContent = () =>{
        setRequestsList([]);

        onValue(requestsListener, (snapshot) => {
            let tempReq = [];

            const object = snapshot.val();
            for (const key in object) {
                const request = object[key];
                tempReq.push({activityName: key, subscribers:request});
            }
            setRequestsList(tempReq);
        });

        onValue(activitiesListener, (snapshot) => {
            let tempAct = [];

            const obj = snapshot.val();
            for (const key in obj){
                const act = obj[key];
                tempAct.push(act);
            }
            setActivitiesList(tempAct);
        });

    }

    // Checks if the activity already has an active chat
    const activitiesListContains = (newActivity) =>{
        let index = null;
        for(const i in activitiesList){
            if(activitiesList[i].name == newActivity){
                index = i;
            }
        }
        return index;
    }

    // Checks if the activity was already requested, and if so, returns the activity index
    const pendingReqContains= (newActivity) => {
        let index = null;
        for (const key in requestsList) {
            if(requestsList[key].activityName === newActivity)
                index = key;
        }
        return index;
    }

    // Checks if the user has already requested the activity, and returns the user's index
    const containsUser = (actvityIndex,userId) => {
        let userIndex = null;
        for(const id in requestsList[actvityIndex].subscribers){
            if(requestsList[actvityIndex].subscribers[id] === userId)
                userIndex = id;
        }
        return userIndex;
    }

    const tryToCreateChat = (request) => {
        if(Object.values(request.subscribers).length+1 >= minSubscribersRequired){
            props.dbConnect.pushData(activitiesTableName,{name:request.activityName})
            props.dbConnect.setData(tableName+"/"+request.activityName,null)
        }
    }

    return(<div className="pending_requests_container">
    <div className="pending_requests">
        {props.userId !== null &&
        <div className="pending_requests_controls">
        <input type="text" className="request_area" value={newActivity} onChange={evt=>{setNewActivity(evt.target.value)}}></input>
        <button onClick={_=>{
            if(newActivity==="")
                return;

            // Check if activity already exists in Activities list (current chat already open)
            // Eventually navigate to the chat
            let activityIndex = activitiesListContains(newActivity);
            if(activityIndex){
                // Change classname of the elements
                document.querySelector("#side_link_"+activityIndex).className = "current_item";
                document.querySelector("#side_link_last").className = "side_links";

                props.setLastActivityIndex(activityIndex);

                // Going to the requested chat
                navigate("../discussion/"+activityIndex, { replace: true });
                return;
            }

            let requestIndex = pendingReqContains(newActivity);
            
            if(requestIndex === null){
                // Creating new request
                props.dbConnect.pushData(tableName+"/"+newActivity,props.userId.uid);
            }else{
                // Adding user to request
                let userIndex = containsUser(requestIndex,props.userId.uid);

                if(userIndex ===null){
                    // User is not yet registered
                    props.dbConnect.pushData(tableName+"/"+newActivity,props.userId.uid);

                    tryToCreateChat(requestsList[requestIndex]);
                }
            }
            setNewActivity("");
            
        }}>Submit</button>
        </div>
        }
        <ul>
        {requestsList.flatMap((request,i) =>
            <li key={i}><label htmlFor={"request_"+i}> {request.activityName} {Object.values(request.subscribers).length}</label>
            {props.userId !== null &&
                <input type="checkbox" id={"request_"+i} checked={
                    Object.values(request.subscribers).includes(props.userId.uid)} 
                    onChange={evt=>{
                        if(evt.target.checked){
                            props.dbConnect.pushData(tableName+"/"+requestsList[i].activityName,props.userId.uid);
                            tryToCreateChat(request);
                        }else{
                            let itemToDel = "";
                            let object = requestsList[i].subscribers;
                            for (const key in object) {
                                if(object[key] === props.userId.uid){
                                    itemToDel = key;
                                }
                            }
                            props.dbConnect.setData(tableName+"/"+requestsList[i].activityName+"/"+itemToDel,null);
                        }
                }}></input>
            }</li>
        )}
        </ul>
    </div>
    </div>);
}
export default PendingRequests;