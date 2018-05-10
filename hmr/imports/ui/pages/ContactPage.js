import React from 'react'
import { Meteor } from 'meteor/meteor'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Settings } from '/imports/api/settings/settings'

export default class ContactPage extends TrackerReact(React.Component) {
  
  constructor(){
    super()
    
    this.state = {
       subscription : {
        settings: Meteor.subscribe('settings')
       }
    }
  }
  
  componentWillUnmount(){
    this.state.subscription.settings.stop();
  }
  
  
  render(){
    return(
      <div>
        CONTACT
      </div>
    )
  }
}