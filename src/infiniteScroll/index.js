// import React, {useState, useEffect} from 'react'
// import axios from 'axios'

// function InfiniteScroll() {
//   const [data, setData] = useState([])
//   const [page, setPage] = useState(1)

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/photo-gallery/${page}`,
//       )
//       console.log(response?.data?.nodes,'responseresponseresponse')
//       setData([...data, ...response?.data?.nodes])
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [page])

//   const handleScroll = () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop ===
//       document.documentElement.offsetHeight
//     ) {
//       setPage(page + 1)
//     }
//   }

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll)
//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

// console.log(data, 'datadata');

//   return (
//     <div style={{background:'#ccc' , padding:'15px' , overflowY:'scroll' ,scrollbarWidth: 'none', width:'500px', height:'550px'}}>
//       {data.map((d) => {

//         const unixTimestamp = d.node.last_update; 
//         const date = new Date(unixTimestamp * 1000);
        
//         const options = {
//           year: 'numeric',
//           month: 'short',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: true,
//           timeZoneName: 'short',
        
//         };
//         const formattedDate = date.toLocaleDateString('en-US', options);

//         return (
//           <>
//           <div style={{display:'flex' , justifyContent:'center' , gap:'1.5rem' , margin:'15px 0'}}>
//             <div style={{width:'200px'}}>
//             <img className='' style={{width:'100%' , height:'120px' , borderRadius:'16px'}} src={d.node.field_photo_image_section}/>
//             </div>
//             <div style={{textAlign:'left'}}>
//             <p className='truncate-text' style={{ 

//               fontWeight:'600',
//               marginBottom:'10px'
            
//             }}>{d.node.title} </p>


//             <p style={{color:'#727272' , fontWeight:'400' , margin:'0'}}>{formattedDate} </p>
//             </div>
//           </div>
          
//           </>
//           )
//       })}
//     </div>
//   )
// }
// export default InfiniteScroll

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function InfiniteScroll() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();


  const fetchData = async (pageNumber) => {
    console.log(pageNumber, ';pageNumberpageNumber');
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/photo-gallery/${pageNumber}`);
      setData((prevData) => [...prevData, ...response?.data?.nodes]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(currentPage);
    // Initialize the IntersectionObserver
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });
  }, [currentPage]);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      setCurrentPage(currentPage + 1);
    }

  };

  useEffect(() => {
    if (data.length > 0) {
      observer.current.observe(document.getElementById('last-item'));
    }
    return () => {
      if (data.length > 0) {
        observer.current.unobserve(document.getElementById('last-item'));
      }
    };
  }, [data]);

  return (
    <div className='box-infinity'  style={{ background: '#fff', borderRadius:'8px', boxShadow:'rgb(0 0 0 / 37%) 0px 0px 3px 0px', padding: '15px', overflowY: 'scroll', width: '500px', height: '550px' }}>
      {data.map((d, index) => {
        const unixTimestamp = d.node.last_update; 
                const date = new Date(unixTimestamp * 1000);
                
                const options = {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZoneName: 'short',
                
                };
                const formattedDate = date.toLocaleDateString('en-US', options);

                return(
        <div key={index} style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '15px 0' }}>
          <div style={{ width: '200px' }}>
            <img className='' style={{ width: '100%', height: '120px', borderRadius: '16px' }} src={d.node.field_photo_image_section} alt={d.node.title} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p className='truncate-text' style={{
              fontWeight: '600',
              marginBottom: '10px'
            }}>{d.node.title}</p>
            <p style={{ color: '#727272', fontWeight: '400', margin: '0' }}>{formattedDate} </p>
          </div>
        </div>
  )})}
      <div id="last-item" style={{ fontSize:'18px' , display:'flex' , justifyContent:'center' }}>{loading ?       <div className="dots-8"></div>
      : ' No More Data' }</div>


    </div>
  );
}

export default InfiniteScroll;

