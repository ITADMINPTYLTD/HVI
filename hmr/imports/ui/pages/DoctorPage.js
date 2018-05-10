import React from 'react'
import { Meteor } from 'meteor/meteor'
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
import IdleMonitor from 'react-simple-idle-monitor';

export default class DoctorPage extends TrackerReact(React.Component) {
  constructor(){
    super()

    this.state = {
      filter : '',
      maxRows: 15,
      results: [],
	  date: moment(),
	  dateString: moment(new Date).format('DD-MM-YYYY'),
      subscription : {
        centers: Meteor.subscribe('centers'),
      }
    }
	this._onIdle = this._onIdle.bind(this)
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
  
  handleDatePicker(date){
	  date = date == null ? this.getTodayDate() : date
	  dateString= moment(date).format('DD-MM-YYYY')
	  //console.log('Date:'+dateString)
	  this.setState({date: date, dateString: dateString})

	  if(date != null){
		this.handleFilter(this.props.idDoctor, this.props.codeSite, dateString)
	  }
  }
  
  //Calendar Events
  onDateChange(date) {
    this.setState({ date });
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }
  
  getTodayDate(){
	  let today = new Date();
	  return today
  }
  
   getTodayDateString(){
	  let today = new Date();
	  dateString= moment(today).format('DD-MM-YYYY')
      return dateString; 
  }
  
  
  
  // This functions will update the page every 60 seconds if there is not activity
  /*
  refresh(time) {
    if(new Date().getTime() - time >= 60000) 
        window.location.reload(true);
    else 
        setTimeout(this.refresh(time), 10000);
  }
  refreshPage(){
	 console.log('refreshPage')
	 var time = new Date().getTime();
	 // Detect if there is any activity on that page
     $(document.body).bind("mousemove keypress", function(e) {
         time = new Date().getTime();
     });

     setTimeout(this.refresh(time), 10000);
  }*/
  

  componentWillMount(){
	this.setState({dateString: this.getTodayDateString()})
    this.handleFilter(this.props.idDoctor, this.props.codeSite, this.getTodayDateString())
  }

  componentDidMount(){
    $('#spinner').hide()
    this.tracker = Tracker.autorun(()=> {
      FlowRouter.watchPathChange()
    })
  }

  componentWillUnmount() {
  	this.state.subscription.centers.stop();
  }

  listCenters(){
    return Centers.find({}).fetch()
  }

  handleFilter(value, codeSite, date){
    this.setState({filter: value, results: [], maxRows: 999})
    this.showSpinner()
    this.fetchItems(codeSite)
	if(date != null){
		this.fetchData(value, codeSite, date)
	}
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

  fetchData(value, codesite, date){
    self = this

    Meteor.call('getAppointmentByDoctor', value, codesite, date, function(error, results){
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
  }

  showSpinner(){
    $('#spinner').show()
    $('#content').hide()
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
  
  _onIdle(){
	  console.log('On Idle');
	  window.location.reload(true);
  }
  
  render(){

    let lengthList = (this.getResults().length > 0)

    return(
    <div style={styles.container}>
		  <IdleMonitor timeout={300000} 
				onIdle={this._onIdle} 
				onActive={() => {console.log('On Active')}}
				/>
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
            </LeftSidebar>
            <main style={styles.main}>
					
					<div style={styles.topBar}>
					  <div style={styles.topTitle}>
						DATE: {this.state.dateString}
					  </div>
					</div>
					{ !lengthList  && <div>Waiting to connect to server...</div>}
					{this.renderSpinner()}
					{ lengthList && <div>
					  <div>Daily Load: {this.getDailyLoad()} AUD</div>
					  <div style={styles.item}>
						<div style={styles.item.field}>DOCTOR</div>
					  </div>
					  { this.getResults().map((r) =>{
						return <AppointmentItem onRefresh={this.onRefresh} key={Random.id()} data={r} isDoctor/>
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
