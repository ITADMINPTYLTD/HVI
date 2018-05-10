import React from 'react'
import ButtonSvg from '/imports/ui/components/ButtonSvg'

export default class TableItems extends React.Component {
  render(){
    return(
      <table style={{width: '100%', marginBottom: '5px'}}>
        <tr style={styles.header}>
          <th >ITEM </th>
          <th >DESCRIPTION</th>
          <th >PRICE(AUD)</th>
          <th ></th>
        </tr>

        {this.props.children}
      </table>
    )
  }
}

var styles = {
  flex: {
    display: 'flex'
  },
  header: {
    height: '30px',
    backgroundColor: '#eeeeee',
    color: '#16457A',
    fontWeight: '700'
  },
  item: {
    paddingTop: '10px',
    paddingLeft: '5px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#16457A',
    fontWeight: '700',
    field: {
      flex: '1'
    }
  }
}
