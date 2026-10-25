import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SiteVersion from './SiteVersion';
import * as serviceWorker from './serviceWorker';

const root = document.getElementById('root');
const buildYear = Number(root.getAttribute('data-year'));
const initialYear = Number.isInteger(buildYear) && buildYear >= 1000 && buildYear <= 9999
  ? buildYear
  : new Date().getFullYear();
const site = <SiteVersion initialYear={initialYear} />;

if (root.hasChildNodes()) {
  ReactDOM.hydrate(site, root);
} else {
  ReactDOM.render(site, root);
}

// Retire any worker left by a previous build.
serviceWorker.unregister();
