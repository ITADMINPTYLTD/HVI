import React from 'react';
import Isvg , {Icon} from '/imports/ui/components/CustomSvg'
import cssVars from '/imports/ui/cssVars'
import itemType from '/imports/ui/itemType'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'


@Radium
export class SimpleInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  static defaultProps = {
    onChange: () => {},
    disabled : false,
  }

  componentWillMount(){
    if(this.props.defaultValue){
      this.setState({value:this.props.defaultValue});
      this.props.onChange(this.props.defaultValue)
    }
  }

  componentWillUpdate(nextProps, nextState){
    if(this.props.defaultValue !== nextProps.defaultValue){
      this.setState({value:nextProps.defaultValue});
    }
  }

  value : undefined

  handleChange(event){
    this.props.onChange(event.target.value)
    this.value = event.target.value
    this.setState({value:event.target.value})
  }

  render() {

    let isDisabled = this.props.disabled ? 'disabled' : 'enabled'
    let inputType = !this.props.password ? "text" : "password"
    var inputData = {...this.props}
    delete inputData.password
    delete inputData.defaultValue
    return(
      <div style={[styles.inputSimple,this.props.style,styles[isDisabled]]}>
        <input {...inputData} value={this.state.value} style={[styles.inputMini,styles.inputMini[isDisabled]]} onChange={this.handleChange} type={inputType} />
      </div>
    )
  }
}

@Radium
export class SearchInput extends SimpleInput {
  render(){
    let isDisabled = this.props.disabled ? 'disabled' : 'enabled'
    var inputData = {...this.props}
    delete inputData.password
    return(
      <div style={[styles.inputWrapper,this.props.style,styles[isDisabled]]}>
        <input  {...inputData} style={[styles.input,styles.input[isDisabled]]} onChange={this.handleChange} type="search" />
        <div id="ButtonSearch"><Isvg src="/images/icons/icon_search_simple.svg" style={styles.searchIcon}  /></div>
      </div>
    )
  }
}


@Radium
export class TimeInput extends SimpleInput {
  render(){
    let isDisabled = this.props.disabled ? 'disabled' : 'enabled'
    var inputData = {...this.props}
    return(
      <div className="time-input" style={[styles.inputMini,this.props.style,styles[isDisabled]]}>
        <input  {...inputData} style={[styles.timeInput,styles.input[isDisabled]]} onChange={this.handleChange} type="search" />
      </div>
    )
  }
}

var styles = {
  inputMini : {
    border:"1px solid "+cssVars.midGrey,
    background:"#FFF",
    display: 'flex',
    marginLeft: '10px',
	disabled : {
      pointer:"not-allowed"
    }
  },
  inputWrapper : {
    border:"1px solid "+cssVars.midGrey,
    background:"#FFF",
    display: 'flex',
    marginBottom: '10px'
  },
  inputSimple : {
    border:"1px solid "+cssVars.midGrey,
    background:"#FFF",
    display: 'flex'
  },
  timeInput : {
    border:"0",
    fontSize:'13px',
    width : '40px',
    textAlign:'right'
  },
  input : {
    border:"0",
    width: '100%',
    padding: '10px',
    disabled : {
      pointer:"not-allowed"
    }
  },
  searchIcon: {
    width : '20px',
    height: '15px',
    marginTop: '10px',
    marginRight: '10px'
  },
  disabled : {
    opacity : '0.5',
  }
}



@Radium
export class Label extends React.Component {
  render() {
    let styles = {
      label : {
        marginBottom: '10px'
      }
    }
    return(
      <div style={[styles.label,this.props.style]}>
        {this.props.children}
      </div>
    )
  }
}


@onClickOutside
@Radium
export class Selector extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      open : false,
      selected: props.multiple ? [] : '',
    }
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  static propTypes = {
    data: React.PropTypes.array.isRequired,
    multiple : React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onReset: React.PropTypes.func
  }

  static defaultProps = {
    multiple : false,
    onChange: () => {},
    onReset: () => {}
  }

  componentWillMount(){
    if(this.props.defaultValue){
      this.setState({'selected':this.props.defaultValue})
      this.props.onChange(this.props.defaultValue)
    }
  }

  toggleSelector = ()=>{
    this.setState({'open':!this.state.open})
  }

  reset() {
    this.props.onReset()
    this.props.onChange(this.props.multiple ? []:'');
    this.setState({'selected': this.props.multiple ? [] : '','open':false});
  }

  handleClickOutside(event){
    this.setState({'open':false});
  }

  onSelect = code => {
    if(this.props.multiple){
      var lastSelectState = this.state.selected;
      if(this.state.selected.find((item)=> code === item)){
        lastSelectState.pop(code);
      }
      else {
        lastSelectState.push(code);
      }
      this.props.onChange(lastSelectState)
      this.setState({'selected':lastSelectState,'open':false});
    }
    else {
      this.props.onChange(code)
      this.setState({'selected':code,'open':false});
    }

  }

  selectedOptions(){
    if(this.props.multiple){
      return this.state.selected.map(item => {
        return this.props.data.find((option)=> option._id === item).name
      }).join(', ');
    }
    else {
      return this.props.data.find(option => option._id === this.state.selected).name
    }
  }

  render(){
    let styles = {
      selectorWrapper : {
        border:"1px solid #e2e2e2",
        background:"#FFF",
        position: 'relative',
        padding: '10px',
        cursor: 'pointer',
        marginBottom: '10px',
        flex: '1'
      },
      top : {
        display: 'flex',
      },
      selected : {
        display: 'block',
        width: '100%',
        unselected : {
            color: "#b0b0b0"
        },
      },
      selector : {
        position: 'absolute',
        zIndex: 10,
        background: '#FFF',
        border : '1px solid #f2f2f2',
        left: 0,
        right: 0,
        marginTop: '11px',
        padding: '0 0 20px 0',
      },
      option : {
        listStyle:'none',
        marginTop: '10px',
        marginLeft: '10px',
        selected : {
          fontWeight: 'bold'
        },
        ':hover' : {
          color : cssVars.brandColor,
        }
      },
      arrow : {
        fill : cssVars.brandColor,
        width : "20px",
        height: "15px"
      }
    }


    var { placeholder, data , defaultValue } = this.props;

    if(Array.isArray(this.state.selected)) {
      var tempSelected = this.state.selected;
    }
    else {
      var tempSelected = this.state.selected == '' ? [] : [this.props.selected];
    }

    let selectedName = tempSelected.length ? this.selectedOptions() : placeholder;
    let status = tempSelected.length ? 'selected' : 'unselected';
    return(
      <div id={this.props.id} className={this.props.className} style={[styles.selectorWrapper,this.props.style]}>
        <div style={styles.top} onClick={this.toggleSelector}>
          <span style={[styles.selected,styles.selected[status]]}>{selectedName}</span>
          <Isvg style={styles.arrow} src="/images/icons/icon_arrow-down.svg" />
        </div>
        {this.state.open &&
        <ul style={styles.selector}>
          {this.state.selected != '' && <li style={styles.option} onClick={() => this.reset()}>Reset</li>}
          {data.map((option) => {
            let selectedItem = tempSelected.find((item)=> option._id === item) ? 'selected' : '';
            return (<li data-id={option._id} style={[styles.option,styles.option[selectedItem]]} onClick={() => this.onSelect(option._id)} key={option._id}>{option.name}</li>)
          })}
        </ul>
        }
      </div>
    )
  }
}


@Radium
export  class Button extends React.Component {

  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  displayName: 'Button'

  static propTypes = {
    classIcon: React.PropTypes.string,
    kind: React.PropTypes.oneOf(['default','warning','danger']),
    icon: React.PropTypes.oneOf(['add','continue','return','delete']),
    disabled : React.PropTypes.bool
  }

  static defaultProps = {
    icon : 'continue',
    kind : 'default',
    disabled : false
  }

  icons = {
    'add': "/images/icons/icon_add-simple.svg",
    'continue': "/images/icons/icon_arrow-right.svg",
    'return': "/images/icons/icon_arrow-left.svg",
    'delete': "/images/icons/icon_close.svg",
  }

  styles = {
    base : {
      display: "inline-flex",
      padding: "1px 10px 1px 15px",
      cursor: "pointer",
      svg : {
        width : "20px",
        height: "20px"
      },
      ":hover" : {
        textDecoration : "none"
      }
    },
    content : {
      marginRight : "auto",
      paddingRight : '20px',
    },
    default : {
      color: cssVars.brandColor,
      border: "1px solid "+cssVars.brandColor,
      svg :{
        fill : cssVars.brandColor
      }
    },
    warning : {
      background: cssVars.FadedbrandColor,
      color: cssVars.brandColor,
      border: "1px solid "+ cssVars.FadedbrandColor,
      svg :{
        fill : cssVars.brandColor
      }
    },
    danger : {
      color: "#FFF",
      background: cssVars.brandColor,
      border: "1px solid "+cssVars.brandColor,
      svg :{
        fill : "#FFF"
      }
    },
    disabled : {
      opacity: '0.5'
    }

  }

  handleClick(){
    if(!this.props.disabled){
      this.props.onClick()
    }
  }

  render(){
    // Cannot use radium with SVG , has to be done manually , we support only the fill color
    var svgStyles = this.styles.base.svg;
    svgStyles.fill = this.styles[this.props.kind].svg.fill;
    let isDisabled = this.props.disabled ? 'disabled' : 'enabled'
    return(
      <a className={this.props.className} style={[this.styles.base,this.styles[this.props.kind],this.props.style,this.styles[isDisabled]]} href={this.props.href} onClick={this.handleClick}>
          <div style={this.styles.content}>{this.props.children}</div><Isvg style={svgStyles} src={this.icons[this.props.icon]} />
      </a>
    )
  }
}

@Radium
export  class Radio extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selected : false
    }
  }

  componentWillMount(){
    this.updateStatus(this.props.current,this.props.value)
  }

  updateStatus(current,value){
      var isMultiple = typeof current != 'string'
      var cleanCurrent = isMultiple ? current : [current]
      this.setState({ 'selected' : !!cleanCurrent.find((item)=> value === item )})
  }

  componentWillReceiveProps(nextProps){
    if(this.props.current !== nextProps.current){
     this.updateStatus(nextProps.current,nextProps.value)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.selected == this.state.selected){
      return false
    }
    return true
  }

  static propTypes = {
    size : React.PropTypes.string,
  }

  static defaultProps = {
    size : 'sm'
  }
  render () {

    var {className, dataId, id, value , current , icon,size} = this.props

    // Svg are dynamically loaded and are not proper react components, so CSS changes need to be done here
    var iconStyle = this.state.selected ? this.styles.iconSelected : this.styles.icon
    return (
      <div id={id} data-id={dataId} className={className} style={[this.styles.wrapper,this.styles.wrapper[size]]} onClick={()=>this.props.onClick(value)}>
        { icon &&
          <span style={[this.styles.iconWrapper,this.styles.iconWrapper[size]]}>
            <Isvg key={Math.random()} style={iconStyle} src={"/images/icons/icon_"+itemType[icon]+".svg"} />
          </span>
        }
        { !icon &&
          <span style={this.styles.radio}>
            { this.state.selected && <span style={this.styles.selected}></span>}
          </span>
        }
        {this.props.children}
      </div>
    )
  }
  styles = {
    wrapper : {
      display: 'flex',
      alignItems: 'center',
      marginBottom : '20px',
      cursor : 'pointer',
      xl : {
        marginRight: '20px',
        fontSize: '18px',
        lineHeight: '1em'
      }
    },
    iconWrapper : {
      background: "#FFF",
      width: "25px",
      height : "25px",
      borderRadius : "12.5px",
      marginRight : '15px',
      xl:{
        background: 0,
        width:"50px",
        height:"40px"
      }
    },
    icon : {
      fill : cssVars.grey
    },
    iconSelected : {
      fill : cssVars.sndBrandColor
    },
    radio : {
      position: 'relative',
      border: "1px solid "+cssVars.grey,
      background: "#FFF",
      width: "25px",
      height : "25px",
      borderRadius : "12.5px",
      marginRight : '15px'
    },
    selected :{
      position: 'absolute',
      background: cssVars.sndBrandColor,
      top: '5px',
      left: '5px',
      width: "13px",
      height : "13px",
      borderRadius : "12.5px",
    }
  }
}


@Radium
export  class InputInline extends React.Component {
  render(){

    let styles = {
      wrapper : {
        display: 'flex',
        alignItems: 'center',
        //marginRight : "-20px"
      },
      elememt :{
        marginRight: "20px",
        width : "100%"
      },
      button : {
        marginBottom: "10px",
        marginRight: "20px"
      },
      icon : {
        alignSelf: 'flex-start',
        marginTop: '-10px',
        height: '42px',
        width: '42px',
        marginRight: "20px"
      }
    }

    // Overwrite some styles , easier here than directly on the form
    const childrenWithProps = React.Children.map(this.props.children,(child) => {
      if(child.type == Icon){
        return React.cloneElement(child, {
          style: styles.icon
        })
      }
      if(child.type == Button){
        return React.cloneElement(child, {
          style: [styles.button,child.props.style]
        })
      }
      return React.cloneElement(child, {
          style: [styles.elememt,child.props.style]
      })
    });

    return(
      <div style={[styles.wrapper,this.props.style]}>{childrenWithProps}</div>
    )
  }

}
