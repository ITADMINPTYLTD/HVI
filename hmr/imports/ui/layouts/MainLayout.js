import React from 'react'
import cssVars from '/imports/ui/cssVars'

export default MainLayout = ({navbar,content}) =>(
    <div style={style.default}>
      <header>{navbar()}</header>
      {content()}
    </div>
)

var style = {
  default : {
    fontFamily: cssVars.fontText
  }
}
