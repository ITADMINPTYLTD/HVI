import React from 'react'
import cssVars from '/imports/ui/cssVars'
import Radium from 'radium'

@Radium
export default class LeftSidebar extends React.Component{

  render(){
    var styles = {
      wrapper : {
        background: '#eeeeee',
        paddingLeft: '15px',
        paddingRight: '30px',
        paddingTop: '20px',
        paddingBottom: '20px',
        height: '100vh',
        width: "240px"
      },
    }

    return(
      <div id={this.props.id} style={[styles.wrapper,this.props.style]}>
        {this.props.children}
      </div>
    )
  }
}
