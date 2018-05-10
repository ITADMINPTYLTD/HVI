import React from 'react'
import Radium, { Style } from 'radium'

import cssVars from '/imports/ui/cssVars'

@Radium
export default class Page404 extends React.Component{

  render(){
    return (
    <div style={styles.container}>
      <div style={styles.h1}><b style={styles.error}>404</b> Page Not Found</div>
      <p style={styles.lines}>The page you are looking for could not be found.</p>
      <Style rules={{
        body: {
          background: "url(/images/login-bg.jpg) center top",
          backgroundSize: 'cover'
        }
      }} />
    </div>)
  }
}

var styles = {
  container : {
    textAlign : 'center',
    alignItems: 'center',
    justifyContent: 'top',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10%'
  },
  h1 : {
    fontSize : '48px',
    color: '#FFF',
    marginBottom: '30px'
  },
  error : {
    color: 'red'
  },
  lines : {
    color: '#FFF',
    fontSize: '32px'
  }
}