import React from 'react'

import {Meteor} from 'meteor/meteor'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import SndTopNav , {SndTopNavAction} from '/imports/ui/components/SndTopNav'
import cssVars from '/imports/ui/cssVars'
import LeftSidebar from '/imports/ui/components/LeftSidebar'
import Sorter from '/imports/ui/components/Sorter'
import ItemList from '/imports/ui/components/ItemList'
import HeaderList from '/imports/ui/components/HeaderList'
import ShowAllList from '/imports/ui/components/ShowAllList'
import { Centers } from '../../api/centers/centers'
import { Random } from 'meteor/random'
import Spinner from '/imports/ui/components/Spinner'

import { SearchInput , SimpleInput, Selector , Label, Radio} from '/imports/ui/components/FormElements'

export default class MainPage extends TrackerReact(React.Component) {
  constructor(){
    super()
    this.state = {
      filter : '',
      searchTerm: '',
      drafted: '',
      maxRows: 15,
      results: [],
      resultsFiltered: [],
      selectedSort: 'asc',
      subscription : {
        centers: Meteor.subscribe('centers'),
      }
    }

    this.handleOnChangeSorter = this.handleOnChangeSorter.bind(this)
    this.handleSearchFilter = this.handleSearchFilter.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.getResults = this.getResults.bind(this)
    this.handleDraftedFilter = this.handleDraftedFilter.bind(this)
    this.handleShowAll = this.handleShowAll.bind(this)
  }

  componentWillUnmount() {
  	this.state.subscription.centers.stop();
  }

  componentDidMount(){
    $('#spinner').hide()
  }

  hideSpinner(){
    $('#spinner').hide()
    $('#content').show()
  }

  showSpinner(){
    $('#spinner').show()
    $('#content').hide()
  }

  handleShowAll(){
    this.setState({maxRows: 9999})
  }

  handleSearchFilter(value){
    let v = value.toLowerCase()
    this.setState({searchTerm: v})

  }

  handleFilter(value){
    this.showSpinner()
    this.setState({filter: value, results: [], maxRows: 15})
    this.fetchData(value)
  }

  handleDraftedFilter(value){
    let resultsFiltered = []
    this.setState({drafted: value})
  }

  handleOnChangeSorter(code){
    this.setState({selectedSort: code})
  }

  listCenters(){
    return Centers.find({}).fetch()
  }

  getResults(){
    var BreakException = {};
    let results = []
    let resultsFiltered= []
    let count = 0

    //If Drafted filter is activated
    if(this.state.drafted.length > 0){
      //Filter by Drafted
      this.state.resultsFiltered.forEach((r)=>{
        if(r.drafted === '') r.drafted = '0'
        if(r.drafted === this.state.drafted){
          resultsFiltered.push(r)
        }
      })
    }
    else{
      resultsFiltered = this.state.results
    }
    //Filter by Firstname, surname and DOB
    try {
      resultsFiltered.forEach((r)=>{
        //Limit max rows results
        if (count === this.state.maxRows) throw BreakException;
        let v = this.state.searchTerm
        if(r.firstname.toLowerCase().includes(v) ||
          r.surname.toLowerCase().includes(v)   ||
          r.DOB.substring(0,10).includes(v)
        ){
          results.push(r)
        }
        count += 1
      })
    }catch (e) {
      if (e !== BreakException) throw e;
    }
    //Results filtered
    return results
  }

  fetchData(codesite){
    self = this
    Meteor.call('getResults', codesite, function(error, results){
      if(error){
        console.log(error)
        self.setState({results: [], resultsFiltered: []})
      }else{
        if(!results){
          results = []
        }
        self.setState({results: JSON.parse(results), resultsFiltered: JSON.parse(results)})
        self.hideSpinner()
      }
    })
  }

  renderSpinner(){
      return <Spinner/>
  }

  render(){

    let optionsSorter = [
      {code : 'asc', text: 'Name (A–Z)', sorter: {name: 1}},
      {code : 'desc', text: 'Name (Z–A)', sorter: {name: 1}},
      {code : 'youngest', text: 'D.O.B Asc', sorter: {createdAt: -1}},
      {code : 'oldest', text: 'D.O.B Desc', sorter: {createdAt: 1}}
    ]

    let dataSelector = [
      {_id: '1', name: 'YES'},
      {_id: '0', name: 'NO'}
    ]

    let lengthList = (this.getResults().length > 0)

    return(
    <div style={styles.container}>
          <div style={styles.wrapper}>
            <LeftSidebar>
              <Label>Filter results</Label>
              {this.listCenters().map((c)=>{
                return <Radio dataId={c._id} key={c._id} current={this.state.filter} value={c.code}  onClick={this.handleFilter.bind(this, c.code)}>{c.name}</Radio>
              })}
              <Label>Search by</Label>
              <Selector placeholder="DRAFTED" onChange={this.handleDraftedFilter} data={dataSelector} />
              <SearchInput id="form-search-keyword" onChange={this.handleSearchFilter} placeholder="Names or D.O.B" />
            </LeftSidebar>
            <main style={styles.main}>
              <div style={styles.topBar}>
                <div style={styles.topTitle}>
                  HMR
                </div>
              </div>
              { !lengthList  && <div>Please select a Center on the left side</div>}
              {this.renderSpinner()}
              <div style={styles.scrollBar}>
                {lengthList && <div>
                  <HeaderList/>
                  {this.getResults().map((r) =>{
                    return <ItemList key={Random.id()} data={r} />
                  })}
                  <ShowAllList onClick={this.handleShowAll}/>
                  </div>
                }
              </div>
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
  scrollBar:{
	flex: '1',
	display: 'flex',
	overflowX: 'scroll'
  },
  box:{
	  minHeight: 'min-content',
	  display: 'flex'
  }
}
