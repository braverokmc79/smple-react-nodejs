import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";



async function fetchSortedPlaces(){
  const places=await fetchAvailablePlaces();
  return new Promise((resolve) =>{
    navigator.geolocation.getCurrentPosition((position)=>{
      const sortedPlaces=sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
      resolve(sortedPlaces);
    });
  });
}


export default function AvailablePlaces({ onSelectPlace }) {

  const {isFetching, 
         error,
         fetchedData:availablePlaces}= useFetch(fetchSortedPlaces, []);

  if(error){
    return <Error title="에러 발생됨!" message={error.message}  />
  }

  return (
    <Places
      title="여행지 선택"
      places={availablePlaces}      
      isLoading={isFetching}
      loadingText="데이터를 가져오는 중입니다...."
      fallbackText="여행지를 선택할수 없습니다."
      onSelectPlace={onSelectPlace}
    />
  );



}
