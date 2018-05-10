import React from 'react'
import Boron from 'boron/FadeModal';
import ButtonSvg from '/imports/ui/components/ButtonSvg'
import { Modal, Row, Col } from 'react-bootstrap'
import Radium , { Style } from 'radium'
import cssVars from '/imports/ui/cssVars'
import { Button, SearchInput , SimpleInput, Label} from '/imports/ui/components/FormElements'
import TableItems from '/imports/ui/components/TableItems'
import { Random } from 'meteor/random'
import { Bert } from 'meteor/themeteorchef:bert'
@Radium
export default class ModalAnimation extends React.Component{

  constructor(){
    super()

    this.closeModal = this.closeModal.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleInputDraft = this.handleInputDraft.bind(this)
    this.handleInputCheck = this.handleInputCheck.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleNoAction = this.handleNoAction.bind(this)
	this.renderTableItems = this.renderTableItems.bind(this)
    this.state = {
      open : false,
      itemFilter: '',
      itemsState: 	[{id: 1, itemId: 721, state: false},
                       {id: 2, itemId: 723, state: false},
                       {id: 3, itemId: 732, state: false},
					   {id: 4, itemId: 732, state: false},
                       {id: 5, itemId: 900, state: false},
                       {id: 6, itemId: 701, state: false},
                       {id: 7, itemId: 703, state: false},
                       {id: 8, itemId: 705, state: false},
                       {id: 9, itemId: 707, state: false},
                       {id: 10, itemId: 11506, state: false},
                       {id: 11, itemId: 11610,state: false},
                       {id: 12, itemId: 10997, state: false},
                       {id: 13, itemId: 715, state: false},
                       {id: 14, itemId: 2517, state: false},
                       {id: 15, itemId: 2521, state: false},
					   {id: 16, itemId: 4001, state: false},
                      ],
      itemsAvailable: [],
      draftBy: '',
      checkBy: '',
      recordId: '',
      noAction: false,
      totalCostItems: 0
    }
  }

  closeModal(){
    this.refs.modal.hide();
  }
  showModal(){
    this.setState({open:true})
  }
  onShowModal(){
    this.setState({open:true})
  }
  onHideModal(){
    this.setState({open:false})
  }

  componentWillMount(){
      let draftBy = this.props.item.draftedBy
      let checkBy = this.props.item.completedBy
      let recordId = this.props.item.recordId
      let itemsIds = this.props.item.itemsIds || []
      let allItems = Session.get('allItems')
      let items = allItems.filter(x => itemsIds.includes(parseInt(x.item)))
      let itemsState = this.state.itemsState
      var itemsList = []
      itemsState.forEach( a =>   allItems.forEach(b => {
			 if(parseInt(b.item) === parseInt(a.itemId))
			 {itemsList.push(b)}
			 /*
			  * TODO: Find a better way to add two items with the same ID
			  * At the moment, itemId + 00 to identify the second ID
			 
			 if(parseInt(b.itemId) === 732 && parseInt(a.itemId) === 732){
				 itemList.push(a)
			 }*/
	  })
	  )

      let itemsSelected = itemsState.map(x => {
			  if(itemsIds.includes(x.itemId)){
				x.state = true
				return x
			  }else{return x}
      })
      // No Action
      let noAction = (this.props.item.noAction === 'Y') ? true : false
      this.setState({noAction: noAction})
      this.setState({draftBy: draftBy})
      this.setState({checkBy: checkBy})
      this.setState({recordId: recordId})
      this.setState({itemsAvailable: itemsList})
      this.setState({itemsState: itemsSelected})
     
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.open && prevState.open !== this.state.open){
      this.refs.modal.show();
    }
  }

  handleFilter(value){
    this.setState({itemFilter: value})
  }

  handleAddItem(item){
    this.setState({itemFilter: ''})
    this.state.itemsSelected.push(item)
  }

  handleRemove(value){
    let items = this.state.itemsSelected.filter(item => item.item != value)
    this.setState({itemsSelected: items})
  }

  handleCheckbox(value){
    let items = this.state.itemsState
    //Find selected checkbox
    //let selected = items.find( x => x.itemId === value.itemId)
    let updatedItems = items.map(x => {
			if(x.itemId === parseInt(value.itemId)){
			  x.state = !value.state
			  return x
		        }else{return x}
		       })
    
    this.setState({itemsState: updatedItems})
  }

  handleSave(){
    let itemsIds = []
    this.state.itemsState.forEach( item => {if(item.state) itemsIds.push(item.itemId)})
    let save = {
      codeSite: Session.get('codeSite'),
      recordId: this.props.item.recordId,
      completeBy: this.state.checkBy || '',
      draftBy: this.state.draftBy || '',
      noAction: this.state.noAction ? 'Y' : 'N',
      items: itemsIds
    }

    let id = this.props.item.appointmentId
    //PUT: Update
    if(parseInt(id) != 0 ){
      let self = this
      Meteor.call('putData', save, id, function(error, results){
        if(error){
          console.log(error)
          Bert.alert(
            'There was a problem while updating this record',
            'danger',
            'growl-bottom-right'
          )
        }else{
          console.log(results)
          Bert.alert(
            'Record Updated Successfully',
            'success',
            'growl-bottom-right'
          )
          //Refresh List
          self.props.onRefresh(Session.get('codeSite'), results)
        }
      })
    }
    //POST: Insert First Time
    else{
      self = this
      Meteor.call('postData', save, function(error, results){
        if(error){
          console.log(error)
          Bert.alert(
            'There was a problem while saving this record',
            'danger',
            'growl-bottom-right'
          )
        }else{
          console.log(results)
          Bert.alert(
            'Record Saved Successfully',
            'success',
            'growl-bottom-right'
          )
          //Refresh List
          self.props.onRefresh(Session.get('codeSite'), results)
        }
      })
    }
  }

  handleNoAction(event){
	  //Initial States reset
	  let itemsState= [{id: 1, itemId: 721, state: false},
                       {id: 2, itemId: 723, state: false},
                       {id: 3, itemId: 732, state: false},
					   {id: 4, itemId: 732, state: false},
                       {id: 5, itemId: 900, state: false},
                       {id: 6, itemId: 701, state: false},
                       {id: 7, itemId: 703, state: false},
                       {id: 8, itemId: 705, state: false},
                       {id: 9, itemId: 707, state: false},
                       {id: 10, itemId: 11506, state: false},
                       {id: 11, itemId: 11610,state: false},
                       {id: 12, itemId: 10997, state: false},
                       {id: 13, itemId: 715, state: false},
                       {id: 14, itemId: 2517, state: false},
                       {id: 15, itemId: 2521, state: false},
					   {id: 16, itemId: 4001, state: false},
                      ]
					  
      this.setState({
        noAction: event.target.checked,
        draftBy: '',
        checkBy: '',
		itemsState: itemsState
      })
  }

  handleInputDraft(value){
    this.setState({draftBy: value})
  }

  handleInputCheck(value){
    this.setState({checkBy: value})
  }

  renderDailyLoad(){
    let total = 0
    let self = this
    this.state.itemsState.forEach((x) =>{
      let item = self.state.itemsAvailable.find(item=> parseInt(item.item) === x.itemId)
      if(x.state){total = total + parseFloat(parseFloat(item.schedule/100).toFixed(2))}
    })
    return total
  }
  
  renderTableItems(){
	  var items = []	
	  let disabledNoAction = this.state.noAction ? styles.disabled : null
      this.state.itemsAvailable.forEach((item)=>{
		  let state = this.state.itemsState.filter( x => x.itemId === parseInt(item.item))
									
		  for( i = 0; i < state.length; i++){
			items.push(<tr style={disabledNoAction} key={parseInt(state[i].id)}>
			<td>{item.item}</td>
			<td style={{paddingLeft: '5px'}}>{item.description}</td>
			<td>{parseInt(item.schedule)/100}</td>
			<div><input disabled={this.state.noAction} checked={state[i].state ? 'checked' : ''} value={state[i].state} onChange={this.handleCheckbox.bind(this, state[i])} type="checkbox"/></div>
			</tr>)						
		  }
	  })
	  return items
	  
  }

  render(){
	let styleIsDisabled = this.props.isDoctor ? styles.disabled : null
    let modalBody = <div style={styles.modalBody}>
					  <div style={styleIsDisabled}>
                      <div><span style={styles.text}> Doctor: </span>{this.props.data.nameDoctor}</div>
                      <div><span style={styles.text}> Patient: </span> {this.props.item.namePatient}</div>
                      <div style={{display:'flex'}}>
                        {!<SearchInput onChange={this.handleFilter} style={{flex:'4'}} id="form-search-items" placeholder="Items" />}
						<TableItems>
                          {	
							this.renderTableItems()
                          }
                        </TableItems>
                      </div>
                      <div style={{alignItems: 'center', justifyContent: 'space-around'}}>
                        <div style={{marginBottom: '2px'}}>
                        Total: {this.renderDailyLoad()}&nbsp;AUD
                        </div>
                      </div>
                      <div style={{display:'flex', justifyContent: 'flex-start'}}>
                        <Label style={{marginRight: '5px'}}>No Action:</Label>
                        <div><input checked={this.state.noAction} value={this.state.noAction} onChange={this.handleNoAction} type="checkbox"/></div>
                      </div>
                      <div style={{display:'flex', justifyContent: 'flex-start',padding: '0px'}}>
                        <Label style={{marginRight: '5px'}}>Drafted by:</Label>
                        <SimpleInput disabled={this.state.noAction} defaultValue={this.state.draftBy} onChange={this.handleInputDraft}/>
                      </div>
                      <div style={{display:'flex', justifyContent: 'flex-start', padding: '0px'}}>
                        <Label style={{marginRight: '5px'}}>Completed by:</Label>
                        <SimpleInput disabled={this.state.noAction} defaultValue={this.state.checkBy} onChange={this.handleInputCheck}/>
                      </div>
                      <Button onClick={this.handleSave} kind="default">SAVE</Button>
					  </div>
                    </div>
    return(

      <div className={this.props.className} style={this.props.style}>
        <a style={styles.link} onClick={this.showModal}>
          {this.props.children}
        </a>
        {this.state.open &&
        <Boron closeOnClick={false} className="modal-boron" ref="modal"  onHide={()=>{this.onHideModal()}} onShow={()=>{this.onShowModal()}} backdropStyle={styles.backdrop} modalStyle={styles.modal}>
          <div style={styles.modalTop} className="modal-top">
              <div style={styles.modalTop.title}>{this.props.modalTitle}</div>
              <ButtonSvg style={styles.modalTop.close} onClick={this.closeModal} icon="/images/icons/icon_close.svg" />
          </div>
          <Modal.Body style={styles.modalBody}>
            { modalBody }
          </Modal.Body>
          <Modal.Footer style={styles.modalFooter}>
            {this.props.modalFooter}
          </Modal.Footer>
        </Boron>}
        {this.state.open &&
        <Style rules={{
          body: {
            overflow : 'hidden'
          }
        }} />}
      </div>
    )
  }
}

var styles = {
  flex: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  svg: {
    width: '25px',
    height: '25px',
    color: '#16457a'
  },
  modal: {
    width: '900px',
    color: '#606060',
  },
  backdrop : {
    backgroundColor: cssVars.overlay
  },
  modalTop: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft : '20px',
    background : cssVars.brandColor,
    title: {
      marginLeft : '10px',
      marginRight : 'auto',
      color: '#FFFFFF',
    },
    icon : {
      width: '20px',
      fill : '#FFF'
    },
    close : {
      width: "50px",
      display: "inline-block",
      padding: "5px 12px 0px 12px",
      cursor : 'pointer',
      svg : {
        fill : '#FFF'
      }
    }
  },
  modalBody : {
    paddingLeft: '10px',
    minHeight: '100px'
  },
  modalFooter: {
    margin: '0 20px',
    textAlign: 'left',
    padding: '5px 0'
  },
  link: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    ':hover' : {
      textDecoration : 'none'
    }
  },
  text: {
    color: '#16457a'
  },
  disabled: {
	pointerEvents: 'none',
	opacity: '0.4'
  }
}
