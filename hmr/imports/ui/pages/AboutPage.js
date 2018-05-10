import React from 'react'
import { Meteor } from 'meteor/meteor'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Settings } from '/imports/api/settings/settings'

export default class AboutPage extends TrackerReact(React.Component) {
  
  constructor(){
    super()
    
    this.state = {
       subscription : {
        settings: Meteor.subscribe('settings')
       }
    }
    
    this.getSettings = this.getSettings.bind(this)
  }
  
  componentWillUnmount(){
    this.state.subscription.settings.stop();
  }
  
  getSettings(){
    return ''
  }
  
  render(){
    return(
      <div>
        {this.getSettings()}
      </div>
    )
  }
}