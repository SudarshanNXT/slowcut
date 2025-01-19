import React, { useState } from 'react'

const AddToListCard = ({ list, status, listOfLists, setListofLists }) => {
    const [flag, setFlag] = useState(status)

    const handleClick = () => {
        if(flag){
            //remove from listOfLists
            setListofLists((prevList) => prevList.filter((item) => item !== list._id));
            //update flag state
            setFlag(false)
        } else {
            //add to listOfLists
            setListofLists((prevList) => [...prevList, list._id]);
            //update flag state
            setFlag(true)
        }
    }

    return (
        <button onClick={() => handleClick()} className='border flex space-x-2'>
            <div>{list.name}</div>
            <div>{flag ? 'remove' : 'add'}</div>
        </button>
    )
}

export default AddToListCard