import { useState, useEffect } from "react"; //
import {API, graphqlOperation} from "aws-amplify";

export default function useFetch(call, query, state,filters){
    const [data, setData] =  useState(state);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    // listUsers could be used f.x.
    useEffect(()=>{
      fetchData(call, query);
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [] );
    //
    async function fetchData(call, query){
      let response;
      if(!!query){
        response = await API.graphql(graphqlOperation(call, {input: query}, {limit: 400}, {filter: filters} ));
      }else{
        response = await API.graphql(graphqlOperation(call, {limit: 400}));
      }
      const data = await response.data;
      setData(data);
      setLoading(false);
      setIsLoaded(true);
    }
    return {data, loading, isLoaded, fetchData, setLoading};
}