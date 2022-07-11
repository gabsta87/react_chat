import { onValue,ref } from "firebase/database";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const Activities = (props) => {
    const tableName = "Activities"
    const db = props.db;
    const [activitiesList,setActivitiesList] = useState([]);
    useEffect(_=> getContent(),[]);
    const activitiesListener = ref(db,tableName);

    const getContent = () => {
        onValue(activitiesListener, (snapshot) => {
            let tempAct = [];
            const obj = Object.values(snapshot.val());
            obj.forEach(element => {
                tempAct.push(element);
            });
            setActivitiesList(tempAct);
        })
    }
    
    return (<>
        <ul id="activities_list">
            {activitiesList.flatMap((e,i) =>{
                return(
                    <li key={i}> <Link id={"side_link_"+i} className="side_links" onClick={evt=>{
                        if(props.lastActivityIndex >= 0){
                            evt.target.parentNode.parentNode.childNodes[props.lastActivityIndex].childNodes[1].className = "side_links";
                        }
                        props.setLastActivityIndex(i);

                        evt.target.className = "current_item";
                    }} to={"/discussion/"+i}>{e.name}</Link> </li>
                )})}
            <li> <Link id={"side_link_last"} className="side_links" onClick={evt=>{
                if(props.lastActivityIndex >= 0){
                    evt.target.parentNode.parentNode.childNodes[props.lastActivityIndex].childNodes[1].className = "side_links";
                }
                props.setLastActivityIndex(activitiesList.length);

                evt.target.className = "current_item";
            }} to={"/pendingRequests"}>Pending requests...</Link></li>
        </ul>
    </>);
}

export default Activities;