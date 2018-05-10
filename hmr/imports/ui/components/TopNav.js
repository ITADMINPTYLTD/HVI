import React from 'react'
import Logo from './Logo'
import TopNavItem from './TopNavItem'
import cssVars from '/imports/ui/cssVars'

export default class TopNav extends React.Component{

  constructor(){
    super()
    this.renderTopNav = this.renderTopNav.bind(this)
  }
  isActive(routeName){
    let isActive = FlowRouter.current().route.name === routeName;
    if(routeName === 'HMR' && (FlowRouter.current().route.name === 'Admin' || FlowRouter.current().route.name === 'Nurse')){isActive = true}
    return isActive
  }

  renderTopNav(){
    let type = this.props.type
    let component
    if(type === 'admin' || type === 'nurse'){
      component = <div style={{display: 'flex'}}>
              <TopNavItem active={this.isActive('HMR')} href={"/"+type}>HMR</TopNavItem>
              <TopNavItem active={this.isActive('Appointments')} href="/appointments/">Appointments</TopNavItem>
              {/*<TopNavItem active={this.isActive('About')} href="/about/">About</TopNavItem>
              <TopNavItem active={this.isActive('Contact')} href="/contact/">Contact</TopNavItem>
	      */}
            </div>
    }else {
      component = <div></div>
    }

    return component
  }


  render(){

    let style = {
      topNavWrapper : {
        background : cssVars.brandColor,
        backgroundSize: "contain",
        borderBottom : "1px solid #CCC"
      },
      topNav : {
        height: "90px",
        position : "relative",
        marginLeft: cssVars.bodySpacing
      },
      nav : {
        position : "absolute",
        display : "flex",
        bottom: 0,
        right: cssVars.bodySpacing
      }
    }



    return(
      <div style={style.topNavWrapper}>
        <div className="topNav" style={style.topNav}>
          {/*<Logo href="/" />*/}
          <nav style={style.nav}>
            {this.renderTopNav()}
          </nav>
        </div>
      </div>
    )
  }
}
