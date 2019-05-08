import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContextProvider } from 'react-dnd'
import html5Backend from 'react-dnd-html5-backend'

import './index.css';
import App from './App';

ReactDOM.render((
<DragDropContextProvider backend={html5Backend}>
    <App />
</DragDropContextProvider>
), document.getElementById('root'));
