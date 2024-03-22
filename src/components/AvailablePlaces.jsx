import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";


export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] =useState();

  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);
      try{
        
        const places=await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces=sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);    
          setIsFetching(false);
        });

        
      }catch(error){
        console.log("에러  : ", error);
        setError({message: error.message || 'Could not fetch places, please try again later.' });
        setIsFetching(false);
      }           
     
    }

    fetchPlaces();
  }, []);


  if(error){
    return <Error title="에러 발생됨!" message={error.message}  />
  }


  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      
      isLoading={isFetching}
      loadingText="데이터를 가져오는 중입니다...."

      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
