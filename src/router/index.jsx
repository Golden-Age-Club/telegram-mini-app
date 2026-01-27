import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Landing from '../pages/Landing.jsx';
import Home from '../pages/Home.jsx';
import Game from '../pages/Game.jsx';
import GameDetails from '../pages/GameDetails.jsx';
import StartGame from '../pages/StartGame.jsx';
import Wallet from '../pages/Wallet.jsx';
import Profile from '../pages/Profile.jsx';

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
        path: 'slots',
        element: <Game />
      },
      {
        path: 'slots/:id',
        element: <GameDetails />
      },
      {
        path: 'start-game',
        element: <StartGame />
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
