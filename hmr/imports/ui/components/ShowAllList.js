import React from 'react'
import { Button } from '/imports/ui/components/FormElements'

export default class HeaderList extends React.Component {
  render(){
    var {data} = this.props
    return(
      <div style={styles.item}>
        <div style={styles.item.field}>Showing only 15 first results ...</div>
        <div><Button onClick={this.props.onClick} kind="default" icon="continue">Show All</Button></div>
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
    fontWeight: '300',
    field: {
      flex: '1'
    }
  }
}
