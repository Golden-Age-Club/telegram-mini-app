import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import Game from '../pages/Game';
import Wallet from '../pages/Wallet';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'game',
        element: <Game />
      },
      {
        path: 'wallet',
        element: <Wallet />
      },
      {
        path: 'wallet/deposit',
        element: <Wallet />
      },
      {
        path: 'wallet/withdraw',
        element: <Wallet />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]);

export default router;
