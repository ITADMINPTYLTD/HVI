import React from 'react'
import { Random } from 'meteor/random'
import Modal from '/imports/ui/components/Modal'

export default class AppointmentItem extends React.Component {

  constructor(){
    super()
    this.convertSecondsToHHmm = this.convertSecondsToHHmm.bind(this)
    this.getTotalItems = this.getTotalItems.bind(this)
  }
  
  componentDidMount(){
    Session.set("totalCost", 0)
  }

  pad(num){
    return ('0'+num).slice(-2)
  }

  convertSecondsToHHmm(secs){
    let minutes = Math.floor(secs/60)
    let hours = Math.floor(minutes/60)
    minutes = minutes%60
    return this.pad(hours)+':'+this.pad(minutes)
  }

  getTotalItems(){
    let total = 0
	let items = Session.get("allItems")
    this.props.data.appointments.map((appointment) => {
		//console.log(appointment.items)
		appointment.itemsIds.forEach(item =>{
			  let foundItem = items.find(i => i.item == item)
			  total += parseInt(foundItem.rebate100) / 100
			})
		})
    return total.toFixed(2)
  }

  render(){
    var {data, isDoctor} = this.props
    let items = Session.get("allItems")
    let total = this.getTotalItems()
    return(
      <div>
        <div style={styles.item}>
          <div style={styles.item.field}>{data.nameDoctor}</div>
		  <div style={styles.item.field}>${total}</div>
		  <div style={styles.item.fieldStatus}>Document Prepared?</div>
        </div>
        <div className="ContentAppointmentItem">
          {
            data.appointments.map((appointment) => {
	        //Total Cost Items by Patient
    		let count = 0
    		appointment.itemsIds.forEach(item =>{
    		  let foundItem = items.find(i => i.item == item)
    		  count += parseInt(foundItem.rebate100) / 100
    		})
	        //Disable Element
			let stylesDisabled = styles.enabled
			if(appointment.noAction === 'Y' && isDoctor){
			  stylesDisabled = styles.disabled
			}
			//No visible if No drafted
			let stylesVisibility = styles.visible
			if(appointment.drafted === 'N' && isDoctor){
				stylesVisibility = styles.invisible
			}
			//let item = <div style={{...stylesDisabled, ...stylesVisibility}}>
			let item = <div style={{...stylesDisabled}}>
						 <div key={appointment.recordId} style={styles.appointment}>
									 <div style={{display: 'flex'}}>
										 <div style={styles.appointment.field}>{appointment.namePatient}</div>
										 <div style={styles.appointment.field}>{this.convertSecondsToHHmm(appointment.appointmentTime)}</div>
										 <div style={styles.appointment.field}>${count.toFixed(2)}</div>
										  <div style={styles.appointment.field}>
											<Modal isDoctor={isDoctor} onRefresh={this.props.onRefresh} data={data} item={appointment}/>
										  </div>
									  </div>
									<div style={styles.item.fieldStatus}>
										 <div style={styles.appointment.field}>{appointment.drafted === 'Y' ? <h4 style={{color: '#ffa500'}}>Drafted</h4> : ''}</div>
										 <div style={styles.appointment.field}>{appointment.completed === 'Y' ? <h4 style={{color: '#ffa500'}}>Completed</h4> : ''}</div>
										 <div style={styles.appointment.field}>{appointment.noAction === 'Y' ? <h4 style={{color: '#ffa500'}}>No Action</h4> : ''}</div>
									</div>
							</div>
						</div>
			return item
			})
        }
        </div>
      </div>
    )
  }
}

var styles = {
  item: {
    backgroundColor: '#eeeeee',
    paddingTop: '10px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e2e2',
    color: '#16457A',
    field: {
      flex: '1',
      paddingLeft: '10px'
    }},
	fieldStatus:{
		flex: '2',
		paddingLeft: '10px',
		display: 'flex'
	},
    appointment: {
      paddingTop: '10px',
      paddingBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e2e2e2',
      color: '#16457A',
      field: {
        flex: '1',
        paddingLeft: '10px'
      }
    },
    disabled: {
	     pointerEvents: 'none',
	     opacity: '0.4'
    },
    enabled: {enabled: 'enabled'},
	visible: {/*Visible element*/},
	invisible: {display: 'none'}
}
