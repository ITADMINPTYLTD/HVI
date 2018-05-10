import React from 'react'
import cssVar from '/imports/ui/cssVars'
import Radium from 'radium'
import Isvg from '/imports/ui/components/CustomSvg'
import onClickOutside from 'react-onclickoutside'

@onClickOutside
@Radium
export default class Sorter extends React.Component{
  constructor(){
    super();

    this.state = {
      open : false,
      selected: 'asc'
    }

    this.onSelect = this.onSelect.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  static defaultProps = {
    onChange: () => {},
    options: [
      {code : 'asc', text: 'Title (A–Z)'},
      {code : 'newest', text: 'Newest'},
      {code : 'oldest', text: 'Oldest'}
    ]
  }

  toggleSelector = ()=>{
    this.setState({'open':!this.state.open});
  }

  onSelect = code => {
    this.props.onChange(code)
    this.setState({'selected':code,'open':false});
  }

  handleClickOutside(event){
    this.setState({'open':false});
  }

  render(){
    let styles = {
      wrapper : {
        heigh: '20px',
        padding: '15px 20px',
        position : 'relative',
        cursor: 'pointer',
        marginTop: '5px'
      },
      open : {
        background: '#f2f2f2',
      },
      top : {
        display: 'flex',
      },
      sortBy : {
        marginRight: '5px',
        fontWeight: 300
      },
      selected : {
        color : cssVar.brandColor,
        marginRight: '5px',
      },
      selector : {
        position: 'absolute',
        background: '#FFF',
        border : '1px solid #f2f2f2',
        left: 0,
        right: 0,
        marginTop: '15px',
        padding: '0 0 20px 0',
      },
      option : {
        listStyle:'none',
        marginTop: '20px',
        marginLeft: '20px',
      },
      arrow : {
        fill : cssVar.brandColor,
        height: "20px",
        width : "20px"
      }
    }

    let selected = this.props.options.find(option => option.code === this.state.selected)
    let openCss = this.state.open ? styles.open : styles.close
    return (
          <div id={this.props.id} style={[styles.wrapper,openCss]}>
            <div style={styles.top} onClick={this.toggleSelector}>
              <span style={styles.sortBy}>Sort by: </span>
              <span style={styles.selected}>{selected.text}</span>
              <Isvg style={styles.arrow} src="/images/icons/icon_arrow-down.svg" />
            </div>
            {this.state.open &&
            <ul style={styles.selector}>
              {this.props.options.map((option) => {
                return (<li style={styles.option} onClick={() => this.onSelect(option.code)} key={option.code}>{option.text}</li>)
              })}
            </ul>
            }
          </div>
    )
  }
}
