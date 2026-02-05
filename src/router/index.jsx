import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Landing from '../pages/Landing.jsx';
import Home from '../pages/Home.jsx';
import Game from '../pages/Game.jsx';
import GameDetails from '../pages/GameDetails.jsx';
import StartGame from '../pages/StartGame.jsx';
import Wallet from '../pages/Wallet.jsx';
import Profile from '../pages/Profile.jsx';
import BetHistory from '../pages/BetHistory.jsx';
import Activity from '../pages/Activity.jsx';

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
      },
      {
        path: 'bet-history',
        element: <BetHistory />
      },
      {
        path: 'transactions',
        element: <Activity />
      },
      {
        path: 'transactions/:tab',
        element: <Activity />
      },
      {
        path: 'activity',
        element: <Navigate to="/transactions" replace />
      }
    ]
  }
]);

export default router;
