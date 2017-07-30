import React from 'react';
import ReactDom from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import App from './app.jsx';//why must add  suffix?

//why can't find the dom, coz in the html, the dom is behind js!
//console.log(document.getElementById('root'));
const render = (Component)=>{//the first letter must be capital!
	ReactDom.render(
		<AppContainer>
			<Component>
			</Component>
		</AppContainer>
		,document.getElementById('root')
		)
};
render(App);
if(module.hot) {
	module.hot.accept('./app.jsx', ()=>render(App));
}

