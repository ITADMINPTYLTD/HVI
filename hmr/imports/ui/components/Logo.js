import React from 'react'
import Isvg from '/imports/ui/components/CustomSvg'

export default class Logo extends React.Component {
  render(){
    let style = {
      a : {
        display : "block",
        height : this.props.height || 40,
        width : this.props.width || 40,
        position: "absolute",
        marginTop: "23px"
      }
    }
    return(
      <a href={this.props.href} style={style.a}> <img src="images/logo.jpg" alt="Logo Medi7" className="logonav img-circle img-responsive"/></a>
    )
  }
}
