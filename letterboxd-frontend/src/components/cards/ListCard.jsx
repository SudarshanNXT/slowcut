import React from 'react'
import { Link } from 'react-router-dom';
import { MdImageNotSupported } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const ListCard = ({ list, home = false }) => {
    return (
        <div className='flex flex-col space-y-2'>
            <div className='relative group h-[105px] w-[100px]'>
                {list.list_items.map((list_item, inner_index) => (
                    list_item ? (
                        list_item.movie.image ? (
                            <img key={inner_index}
                                src={`https://image.tmdb.org/t/p/w500/${list_item.movie.image}`}
                                alt={list_item.movie.title}
                                className="absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] rounded-md transition-transform duration-300"
                                style={{
                                    left: `${inner_index * 40}px`,
                                    zIndex: list.list_items.length - inner_index,
                                }}
                            />
                        ) : (
                            <div key={inner_index} 
                                className={`absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-800 border text-gray-300 flex items-center justify-center font-semibold text-center rounded-md`}
                                style={{
                                    left: `${inner_index * 40}px`,
                                    zIndex: list.list_items.length - inner_index,
                                }}
                                >
                                <MdImageNotSupported size={40}/>
                            </div> 
                        )
                    ) : (
                        <div key={inner_index} 
                            className={`absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-900 border text-gray-300 flex items-center justify-center font-semibold text-center rounded-md`}
                            style={{
                                left: `${inner_index * 40}px`,
                                zIndex: list.list_items.length - inner_index,
                            }}
                            >
                            {/* <MdImageNotSupported size={40}/> */}
                        </div>
                    )
                ))}
            </div>
            
            <div className='space-y-2'>
                <Link to={`/list/${list._id}`} className='font-bold text-white hover:text-blue-500'>{list.name}</Link>
                {home ? (
                    <Link to={`/${list.creator}`} className='flex items-center gap-x-1 text-gray-300 hover:text-gray-100'><FaUserCircle size={18}/><span>{list.creator}</span></Link>
                ) : (
                    <div className='text-gray-400 font-normal'>{list.list_items_length !== 1 ? `${list.list_items_length} films` : '1 film'}</div>
                )}
            </div>
        </div>
    )
}

export default ListCard