import React, { Component } from 'react';
import styles from './styles/common.scss';
import './App.css';
// import DragDemo from 'components/DragDnd';
import XpahtBox from 'components/XpathBox';
// import Simle from 'components/Simple';

class App extends Component {
  render() {
    return (
      <div className="App">
        <XpahtBox className={styles.fullPage} />
        {/*<Simle />*/}
      </div>
    );
  }
}

export default App;
