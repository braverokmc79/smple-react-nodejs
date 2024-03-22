import { useRef, useState, useCallback, useEffect } from "react";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchAvailablePlaces, fetchUserPlaces, updateUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";
import {useFetch} from "./hooks/useFetch";


function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(false)  
  const [modalIsOpen, setModalIsOpen] = useState(false);



  // 방문하고 싶습니다 ... fetch visit  list
  const { isFetching, error ,fetchedData:userPlaces,
    setFetchedData:setUserPlaces
  }= useFetch(fetchUserPlaces, []);



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
      <Modal open={errorUpdatingPlaces}   
        onClose={handleError} 
        
        >
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
        <h1>Place Picker</h1>
        <p>
        방문하고 싶은 장소나 방문했던 장소에 대한 개인 컬렉션을 만드세요.
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
