import { useEffect } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import PageRender from './customRouter/PageRender'
import PrivateRouter from './customRouter/PrivateRouter'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

import Alert from './components/alert/Alert'
import Header from './components/header/Header'
import StatusModal from './components/StatusModal'

import { useSelector, useDispatch } from 'react-redux'
import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import { getNotifies } from './redux/actions/notifyAction'
import CallModal from './components/message/CallModal'
import Peer from 'peerjs'
// import NotFound from './components/NotFound'

import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import NotFound from './components/NotFound'

const alertOptions = {
  position: 'top right',
  timeout: 5000,
  offset: '30px',
  transition: 'scale',
};


function App() {
  const { auth, status, modal, call } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  
  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])


  return (
    <Router>
      
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        
        <Alert />

        <input type="checkbox" id="theme" />
        
        <div className={`App ${(status || modal) && 'mode'}`}>
          <div className="main">
            
            {auth.token && <Header />}
            {status && <StatusModal />}
            {auth.token && <SocketClient />}
            {call && <CallModal />}
            
            <Route exact path="/" component={auth.token ? Home : Login} />
            <Route exact path="/register" component={Register} />
            
            <PrivateRouter exact path="/:page" component={PageRender} />
            <PrivateRouter exact path="/:page/:id" component={PageRender} />
            <Route exact path="/:page/:id/*" component={NotFound}/>
            
          </div>
        </div>
      </AlertProvider>

    </Router>
  );
}

export default App;
