import {  useState,  useEffect } from "react";

export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData]=useState(initialValue);


  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
       // console.log("data",data);
        setFetchedData(data);        
      } catch (error) {
        setError({ message: error.message || "데이터를 가져오는데 실패했습니다." });        
      }
      setIsFetching(false);
    }

    
    fetchData();
  }, [fetchFn]);


  return{
    isFetching,
    fetchedData,
    setFetchedData,
    error
  }

}
