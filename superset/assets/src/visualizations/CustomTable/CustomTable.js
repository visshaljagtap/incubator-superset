import d3, { json } from 'd3';
import './CustomTable.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { Table } from 'react-bootstrap';
import { element } from 'prop-types';

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $.ajax({
      type: 'POST',
      url: `/superset/get_search_results/`,
      data: {
        search_string: "sample_text"
      },
      success: result => {
        console.log('result--->', result);
      },
      error: err => {
        console.log('error--->', err);
      }
    });
  }

  render() {
    let data = this.props.payload.data;
    let columns = data.columns;
    let records = data.records;
    const headers = columns.map(column => <th>{column}</th>);
    let elements = [];
    records.map(r => {
      let temp = [];
      {
        columns.map(c => {
          if (c == 'Patient') {
            const link =
              'http://localhost:9000/superset/dashboard/8/?preselect_filters={"109": {"Patient_Name":"' +
              r[c] +
              '"}}';
            console.log(link);

            temp.push(
              <td>
                <a href={link}>{r[c]}</a>
              </td>
            );
          } else {
            temp.push(<td>{r[c]}</td>);
          }
        });
      }
      elements.push(temp);
    });
    const rows = elements.map(e => <tr>{e}</tr>);

    return (
      <div>
        <table className="dataframe table table-striped table-condensed table-hover dataTable no-footer">
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

CustomTable.propTypes = {};
CustomTable.defaultProps = {};

export default CustomTable;
