import React from 'react'
import { Meteor } from 'meteor/meteor';
import { SimpleInput,Button } from '/imports/ui/components/FormElements'
import Radium, { Style } from 'radium'

import cssVars from '/imports/ui/cssVars'


@Radium
export default class LoginPage extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      errorMessage : '',
    }
  }

  componentWillUnmount() {

  }

  // Handle when the user type enter in the login
  onKeyUp(event){
    if(event.type === "keyup" && event.key === "Enter" ) {
      this.submit()
    }
  }

  submit(){
    let email = this.refs.email.value,
    password = this.refs.password.value

    if(email,password) {
      Meteor.loginWithPassword(email,password,(error)=>{
        if(error){
          this.setState({errorMessage:error.reason})
        }
        else {
          // Redirect the user to the good url
          if(Meteor.userId() && Meteor.user()){
            let user = Meteor.user()
            if(Meteor.user().username === 'admin'){
              const go = '/admin'
              return FlowRouter.go(go);
            }
            if(Meteor.user().username === 'nurse'){
              return FlowRouter.go('/nurse');
            }
            if(Meteor.user().username === 'doctor'){
              return FlowRouter.go('/doctor');
            }
          }
        }
      })
    }
    else {
      this.setState({errorMessage:'Please fill your login and password'})
    }

  }

  render(){
    return (
    <div style={styles.container} onKeyUp={(event)=>{this.onKeyUp(event)}}>
      <div style={styles.h1} >Welcome to HMR Medi7</div>
      <div ref="form" style={styles.form}>
        <SimpleInput ref='email' placeholder="Email" onChange={this.handleLogin} />
        <SimpleInput ref='password' password={true} placeholder="Password" onChange={this.handlePassword} />
        <p style={styles.error}>{this.state.errorMessage}</p>
        <Button onClick={() => this.submit()} style={styles.button} kind="danger">Sign in</Button>
        {/*<p style={styles.signup}>Not registered?  Sign up now  ></p>*/}
      </div>
      <Style rules={{
        body: {
          background: "url(/images/bg.jpg) center top",
          backgroundRepeat: 'repeat-x',
          height: '100vh',
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
    marginTop: '10%'
  },
  error : {
    color : cssVars.sndBrandColor
  },
  signup : {
    textAlign: 'left',
    marginTop: '20px',
    color : '#FFF'
  },
  h1 : {
    fontSize : '32px',
    fontFamily: 'raleway',
    color: '#FFF',
    marginBottom: '30px'
  },
  form :{
    margin: '0 auto',
    width: '310px'
  },
  button : {
    background: cssVars.sndBrandColor,
    border: '1px solid '+cssVars.sndBrandColor,
    width : '90%',
    textAlign: 'center'
  }
}
