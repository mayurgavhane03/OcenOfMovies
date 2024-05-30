import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './Components/MainPage';
import MovieForm from './Components/MovieForm ';
import MovieDetail from './Components/MovieDetail';

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
    <RouterProvider router={router} />
  );
};

export default App;
