import React from 'react'
import  ModalAnimation from '/imports/ui/components/ModalAnimation'
import ButtonSvg from '/imports/ui/components/ButtonSvg'

export default class Checkbox extends React.Component{
  constructor(){
    super()
    this.state = {
      isChecked: false
    }

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  static propTypes = {
    className: React.PropTypes.string,
    checked: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.bool]),
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    className: '',
    onClick: () => {}
  }

  handleCheckboxChange(event){
    this.setState({isChecked: event.target.checked})
    this.props.onClick(event.target.checked, this.props.recordId)
  }

  render(){
    let styles = {
      color: '#ffffff',
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
        >

        <input type="checkbox"
         checked={this.state.isChecked}
         onChange={this.handleCheckboxChange}
        />
        
        </ModalAnimation>
      </div>

    )
  }
}
