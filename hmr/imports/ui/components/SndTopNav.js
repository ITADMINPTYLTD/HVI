import React from 'react'
import Isvg from '/imports/ui/components/CustomSvg'
import cssVars from '/imports/ui/cssVars'
import Radium from 'radium'

const styles = {
  wrapper: {
    display: 'flex',
    padding: "0 "+ cssVars.bodySpacing,
    alignItems : 'center',
    borderBottom: '1px solid #E9E9E9',
    height: '89px',
    title: {
      color: cssVars.brandColor,
      fontSize: '32px',
      fontWeight: 300,
      marginRight: 'auto'
    },
  }

}
@Radium
export class SndTopNavAction extends React.Component {
  styles = {
    wrapper : {
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      ':hover' : {
        textDecoration: 'none'
      }
    },
    link : {
      color :  cssVars.brandColor,
      fontSize: "16px",
      marginRight : '10px'
    },
    icon : {
      fill: cssVars.brandColor,
      width : "60px",
      height : "60px"
    },
  }
  render(){
    return(
      <a id={this.props.id} href={this.props.href} onClick={this.props.onClick} style={this.styles.wrapper}>
          <span style={this.styles.link}>{this.props.text}</span>
          <Isvg style={this.styles.icon} src="/images/icons/icon_add-reverse.svg"/>
      </a>
    )
  }
}


export default class SndTopNav extends React.Component {

  render(){

    var title = this.props.title || FlowRouter.current().route.name;
    if(FlowRouter.current().route.options.actionName){
      title = FlowRouter.current().route.options.actionName
    }
    return(
      <div style={styles.wrapper}>
        <div style={styles.wrapper.title}>{title}</div>
        <div>{this.props.children}</div>
      </div>
    )
  }
}
