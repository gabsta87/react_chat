
import { ref,get,push,set} from "firebase/database";

const DBConnect = (dbParam) =>{
    const db = dbParam;
    
    const getData = (tableName) => {
        let tableRef = ref(db,tableName);
        let result;
        
        const prom = get(tableRef).then((snapshot) => {
            if (snapshot.exists()) {
                result = snapshot.val();
            }
            return result;
        });
        return prom;
    }
    
    const pushData = (tableName,data) => {
        let tableRef = ref(db,tableName);
        push(tableRef,data);
    }

    const setData = (tableName,data) => {
        let tableRef = ref(db,tableName);
        set(tableRef,data);
    }

    return {getData,pushData,setData}
}

export default DBConnect;