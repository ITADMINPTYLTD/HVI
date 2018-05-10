import React from 'react'

import {Meteor} from 'meteor/meteor'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import SndTopNav , {SndTopNavAction} from '/imports/ui/components/SndTopNav'
import cssVars from '/imports/ui/cssVars'
import LeftSidebar from '/imports/ui/components/LeftSidebar'
import AppointmentItem from '/imports/ui/components/AppointmentItem'
import { Centers } from '../../api/centers/centers'
import { Random } from 'meteor/random'
import { Session } from 'meteor/session'
import { Button, SearchInput , SimpleInput, Selector , Label, Radio} from '/imports/ui/components/FormElements'
import { Bert } from 'meteor/themeteorchef:bert'
import { Loader } from 'react-loader'
import Spinner from '/imports/ui/components/Spinner'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import moment  from 'moment'

export default class MainPage extends TrackerReact(React.Component) {
  constructor(){
    super()

    this.state = {
      filter : '',
      maxRows: 15,
      results: [],
	  date: '',
	  dateString: '',
	  focused: false,
      subscription : {
        centers: Meteor.subscribe('centers'),
      }
    }

    this.fetchData = this.fetchData.bind(this)
    this.getResults = this.getResults.bind(this)
    this.getDailyLoad = this.getDailyLoad.bind(this)
    this.renderSpinner = this.renderSpinner.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
	this.onDateChange = this.onDateChange.bind(this)
    this.onFocusChange = this.onFocusChange.bind(this)
	this.handleDatePicker = this.handleDatePicker.bind(this)
	this.getTodayDate = this.getTodayDate.bind(this)
  }
  
  componentDidMount(){
    $('#spinner').hide()
  }
  
  componentWillUnmount() {
  	this.state.subscription.centers.stop();
  }

  listCenters(){
    return Centers.find({}).fetch()
  }

  handleFilter(value){
	// Check that a date was selected
	date = this.state.dateString.length > 0 ? this.state.dateString : this.getTodayDate()
    this.setState({filter: value, results: [], maxRows: 15})
    Session.set('codeSite', value)

    let codeSite = Session.get('codeSite')
    this.showSpinner()
    this.fetchItems(codeSite)
    this.fetchData(codeSite, date)
  }

  renderSpinner(){
      return <Spinner/>
  }

  getResults(){
    return this.state.results
  }

  fetchItems(codeSite){
    Meteor.call('getItems', codeSite, function(error, results){
      if(error){
        console.log(error)
        Session.set('allItems',[])
      }else{
        if(!results){
          results = []
        }
        Session.set('allItems', JSON.parse(results))
      }
    })

  }

  fetchData(codesite, date){
    let self = this

    Meteor.call('getAppointmentsByDate', codesite, date, function(error, results){
      if(error){
        console.log(error)
        self.setState({results: []})
      }else{
        if(!results){
          results = []
        }
        self.setState({results: JSON.parse(results)})
        self.hideSpinner()
      }
    })
  }

  hideSpinner(){
    $('#spinner').hide()
    $('#content').show()
	$('#contentAppointments').show()
  }

  showSpinner(){
    $('#spinner').show()
    $('#content').hide()
	$('#contentAppointments').hide()
  }


  getDailyLoad(){
    let count = 0
    let items = Session.get("allItems")
    this.getResults().forEach( x => {
      x.appointments.forEach(appointment => {
        appointment.itemsIds.forEach(item =>{
          let foundItem = items.find(i => i.item == item)
          count += parseInt(foundItem.rebate100) / 100
        })
      })
    })

    return count.toFixed(2)
  }

  handleDatePicker(date){
	  date = date == null ? this.getTodayDate() : date
	  dateString= moment(date).format('DD-MM-YYYY')
	  //console.log('Date:'+dateString)
	  this.setState({date: date, dateString: dateString})
	  let codeSite = Session.get('codeSite')

	  if(codeSite != null){
		this.showSpinner()
		this.fetchData(codeSite, dateString)
	  }
  }
  
  //Calendar Events
  onDateChange(date) {
    this.setState({ date });
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  onRefresh(codeSite, results){
    //Get Save Data from ModalAnimation
    console.log(codeSite, results)
    var BreakException = {}
    let newObj = JSON.parse(results.content)
    let obj
    let list
    this.state.results.forEach( r => r.appointments.forEach(ap => {
      if(ap.recordId === newObj.recordId){
        console.log('ap:'+JSON.stringify(ap))
        obj = ap
      }
    }))
    //Optimising refresh
    self = this
    this.state.results.forEach( (r,index) => {r.appointments.forEach((ap, index2) => {
      if(ap.recordId === newObj.recordId){
        //Delete element found from list
        r.appointments = r.appointments.filter( a => ap !== a)
        //Add modified element
	    //newObj.noAction = ap.noAction
        newObj.internalId = ap.internalId
        newObj.appointmentTime = ap.appointmentTime
        newObj.namePatient = ap.namePatient
        //Inserting newObj in specific position of the array
        r.appointments.splice(index2, 0, newObj)
        //Replace original branch of the tree
        let newState = self.state.results
        newState[index] = r
        self.setState({results: newState})
      }
    })})
  }
  
   getTodayDate(){
	  let today = new Date();
	  dateString= moment(today).format('DD-MM-YYYY')
      return dateString; 
  }

  render(){

    let lengthList = (this.getResults().length > 0)
    return(
    <div style={styles.container}>
          <div style={styles.wrapper}>
            <LeftSidebar>
			  <div style={styles.topBar}>
                  <div style={styles.topTitle}>
                    DATE : <SingleDatePicker
									id="input_date"
									placeholder="Select Date"
									showClearDate={true}
									withPortal={true}
									daySize={45}
									isOutsideRange={()=> false}
									numberOfMonths={1}
									enableOutsideDays={true}
									reopenPickerOnClearDate= {true}
									isDayBlocked={() => false }
									displayFormat="DD-MM-YYYY"
									date={this.state.date} // momentPropTypes.momentObj or null
									onDateChange={date => this.handleDatePicker(date)} // PropTypes.func.isRequired
									focused={this.state.focused} // PropTypes.bool
									onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
								/>
                  </div>
              </div>
              <Label>Filter results</Label>
              {this.listCenters().map((c)=>{
                return <Radio dataId={c._id} key={c._id} current={this.state.filter} value={c.code}  onClick={this.handleFilter.bind(this, c.code)}>{c.name}</Radio>
              })}
            </LeftSidebar>
            <main style={styles.main}>
                <div style={styles.topBar}>
                  <div style={styles.topTitle}>
                    DATE : {this.state.dateString.length > 0 ? this.state.dateString : this.getTodayDate()}
                  </div>
                </div>
                { !lengthList  && <div>Please select a Center on the left sidebar</div>}
                {this.renderSpinner()}
                { lengthList && <div id="contentAppointments">
                  <div>Daily Load: {this.getDailyLoad()} AUD</div>
                  <div style={styles.item}>
                    <div style={styles.item.field}>DOCTOR</div>
                  </div>
                  { this.getResults().map((r) =>{
                    return <AppointmentItem onRefresh={this.onRefresh} key={Random.id()} data={r}/>
                  })}
                  </div>
                }
            </main>
          </div>
    </div>
  )
  }
}

var styles = {
  container : {
    height: "calc(100% - 180px)",
  },
  wrapper : {
    display : "flex",
    minHeight: '100%'
  },
  main : {
    flex:1,
    width: '100%',
    padding:'0 '+cssVars.bodySpacing,
  },
  topBar: {
    display: 'flex',
    borderBottom: "1px solid " + cssVars.midGrey
  },
  topTitle: {
    color: cssVars.brandColor,
    marginRight : 'auto',
    padding: '20px 0'
  },
  item: {
    paddingTop: '10px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e2e2',
    color: '#16457A',
    field: {
      flex: '1',
      paddingLeft: '10px'
    },
  }
}
