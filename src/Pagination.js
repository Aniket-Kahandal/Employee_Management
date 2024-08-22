import React from 'react';

export default function Pagination({ postsPerPage, totalPosts, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className='Page navigation example'>
    <ul className='pagination pagination-sm  justify-content-center'>
      {pageNumbers.map(number => (
        <>
       
        <li key={number} className='page-item'>
          <a onClick={(e) =>{ 
            e.preventDefault()
            paginate(number);
            }} href='1' className='page-link'>
            {number}
          </a>
        </li>
        </>
      ))}
    </ul>
    </nav>
  );
}
