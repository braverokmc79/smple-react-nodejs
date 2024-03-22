import { useRef, useState, useCallback, useEffect } from "react";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();
  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(false)
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] =useState(false);


  // 방문하고 싶습니다 ... fetch visit  list
  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true);
      try{      
        const places=await fetchUserPlaces(); 
        setUserPlaces(places);  
        setIsFetching(false);   
      }catch(error){
        console.log("에러  : ", error);
        setError({message: error.message || 'Failed to fetch user places.' });
        setIsFetching(false);
      }           
     
    }
    fetchPlaces();
  }, []);



  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try{
      await updateUserPlaces([selectedPlace, ...userPlaces]);      
    }catch(error){
      //에러시 기존 장소
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message:error.message || 'Failed to update places.'
      })
    }
    
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try{
      await updateUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      )
    }catch(error){
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message:error.message || 'Failed to delete places.'
        })
    }
    setModalIsOpen(false);
  }, [userPlaces]);



  function handleError(){
    setErrorUpdatingPlaces(null);
  }


  return (
    <>
      <Modal open={errorUpdatingPlaces}   onClose={handleError} >
        <Error 
          title="에러 발생됨!"
          message={errorUpdatingPlaces.message}
          onConfirm={handleError}
        />
      </Modal>
      


      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>

     
        {error && <Error  title='에러 발생!'   message={error.message}    /> }
        {!error&& <Places
          title="방문하고 싶습니다 ..."
          fallbackText="아래에서 방문하고 싶은 장소를 선택하세요."         
          isLoading={isFetching}
          loadingText="장소를 가져오는 중..."

          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}


        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
