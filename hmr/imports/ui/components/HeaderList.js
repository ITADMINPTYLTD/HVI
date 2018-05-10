import React from 'react'

export default class HeaderList extends React.Component {
  render(){
  
    return(
      <div style={styles.item}>
        <div style={styles.item.field}>FIRSTNAME</div>
        <div style={styles.item.field}>SURNAME</div>
        <div style={styles.item.field}>DATE OF BIRTH</div>
        <div style={{width: '50px'}}>POST CODE</div>     
		<div style={styles.item.smallField}>DRAFTED</div>
		<div style={styles.item.smallField}>RECEIVED</div>
		<div style={styles.item.smallField}>BILLED</div>
		<div style={styles.item.smallField}>SEND DATE</div>
		<div style={styles.item.smallField}>RECEIVED DATE</div>
		<div style={styles.item.smallField}>BILLED DATE</div>
      </div>
    )
  }
}

var styles = {
  item: {
    paddingTop: '10px',
    paddingLeft: '5px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#EEE',
    borderBottom: '1px solid #e2e2e2',
    color: '#16457A',
    fontWeight: '700',
    field: {
      width: '90px'
    },
	smallField:{
	  width: '70px'
	}
  }
}
