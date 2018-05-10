import React from 'react'

export default class ItemList extends React.Component {
  render(){
    var {data} = this.props
    return(
      <div style={styles.item}>
        <div style={styles.item.field}>{data.firstname}</div>
        <div style={styles.item.field}>{data.surname}</div>
        <div style={styles.item.field}>{data.DOB.substring(0,10)}&nbsp;</div>
        <div style={{width: '50px'}}>{data.postcode}</div>
        <div style={styles.item.smallField}>{(data.drafted==='1')? 'YES': 'NO'}</div>
		<div style={styles.item.smallField}>{(data.received==='1')? 'YES': 'NO'}</div>
		<div style={{width: '50px'}}>{(data.billed==='1')? 'YES': 'NO'}</div>
		<div style={styles.item.field}>{data.sendDate}</div>
		<div style={styles.item.field}>{data.receivedDate}</div>
		<div style={styles.item.field}>{data.billedDate}</div>
      </div>
    )
  }
}

var styles = {
  item: {
    paddingTop: '10px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e2e2',
    color: '#16457A',
    field: {
      width: '90px'
    },
	smallField:{
	  width: '70px'
	}
  }
}
