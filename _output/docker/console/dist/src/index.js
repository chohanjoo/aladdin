import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
import './styles/index.css';
// Preload the icon webfonts used for badging in graph labels. Otherwise, Cytoscape may render labels prior
// to the font being loaded. (Kiali-2817)  We do this here (as opposed to public/index.html) because react
// can convert the font file into the media asset.
var faWebfont = require('./fonts/fontawesome-webfont.woff2');
var linkFa = document.createElement('LINK');
linkFa.setAttribute('rel', 'preload');
linkFa.setAttribute('href', faWebfont);
linkFa.setAttribute('as', 'font');
linkFa.setAttribute('type', 'font/woff2');
linkFa.setAttribute('crossorigin', 'anonymous');
var pfWebfont = require('./fonts/PatternFlyIcons-webfont.woff');
var linkPf = document.createElement('LINK');
linkPf.setAttribute('rel', 'preload');
linkPf.setAttribute('href', pfWebfont);
linkPf.setAttribute('as', 'font');
linkPf.setAttribute('type', 'font/woff');
linkPf.setAttribute('crossorigin', 'anonymous');
document.getElementsByTagName('head')[0].append(linkFa);
document.getElementsByTagName('head')[0].append(linkPf);
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
//# sourceMappingURL=index.js.map