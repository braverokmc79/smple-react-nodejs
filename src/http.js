export async function fetchAvailablePlaces(){
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    if(!response.ok){
        throw new Error('장소를 가져오는데 실패했습니다.');
    }

    return resData.places;
}
 

export async function fetchUserPlaces(){
    const response = await fetch('http://localhost:3000/user-places');
    const resData = await response.json();

    if(!response.ok){
        throw new Error('Failed to fetch  user places');
    }

    return resData.places;
}
 


//업데이트 처리
export async function updateUserPlaces(places){
    const response = await fetch('http://localhost:3000/user-places', {
        method:'PUT',
        body:JSON.stringify({places}),
        headers:{
            'Content-Type':'application/json'
        }
    });

    const resData=await response.json();
    if(!response.ok){
        throw new Error('데이터를 업데이트 하는데 실패했습니다..');
    }

    return resData.message;

}

