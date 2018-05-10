import React from 'react'
import  ModalAnimation from '/imports/ui/components/ModalAnimation'
import ButtonSvg from '/imports/ui/components/ButtonSvg'

export default class Modal extends React.Component{
  constructor(){
    super()
  }

  static propTypes = {
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render(){
    let styles = {
      color: '#16457a',
      width: '25px',
      height: '25px'
    }
    return(
      <div>
        <ModalAnimation
        ref="addItemModal"
        typeModal="FadeModal"
        onPressEnter={()=>{}}
        modalTitle="Add Items"
        modalBody=""
        modalFooter=""
        onRefresh = {this.props.onRefresh}
        data={this.props.data}
        item={this.props.item}
		isDoctor={this.props.isDoctor || false}
        >
        <ButtonSvg style={styles} icon="/images/icons/icon_arrow-right.svg" />
        </ModalAnimation>
      </div>

    )
  }
}
