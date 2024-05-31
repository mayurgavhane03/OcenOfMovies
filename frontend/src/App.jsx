import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './Components/MainPage';
import MovieDetail from './Components/MovieDetail';
import MovieForm from './Components/MovieForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
   
  },
  {
    path: 'Admin',
    element: <MovieForm />,
  },
  {
    path: '/movie/:id',
    element :  <MovieDetail />
  }
]);

const App = () => {
  return (
    <div  className='h-full bg-gray-900'>
    <RouterProvider router={router} />
    </div>
  );
};

export default App;
