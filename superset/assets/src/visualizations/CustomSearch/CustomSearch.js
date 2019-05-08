import './CustomSearch.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { element } from 'prop-types';
import { Button } from 'react-bootstrap';
// import Button from 'src/components/Button';
class CustomSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { type: '', search_string: '', gender: 'A' };
  }

  handleChange(event) {
    this.setState({ search_string: event.target.value });
  }

  handleSelectChange(event) {
    this.setState({ type: event.target.value });
  }

  handleGenderChange(event) {
    this.setState({ gender: event.target.value });
  }

  handleSubmit(event) {
    $.ajax({
      type: 'POST',
      url: `/superset/get_search_results/`,
      data: {
        search_string: this.state.search_string,
        search_type: this.state.type,
        gender: this.state.gender
      },
      success: result => {
        console.log('result--->', result.data);
        this.setState({
          result: result.data
        });
      },
      error: err => {
        console.log('error--->', err);
      }
    });
    event.preventDefault();
  }

  render() {
    let data = this.props.payload.data;

    return (
      <div style={{ paddingTop: '20px' }}>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label>
              {' '}
              Gender
              <select
                className="form-control"
                // style={{ marginLeft: '10px' }}
                value={this.state.gender}
                onChange={this.handleGenderChange}
              >
                <option value="A">All</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Oher</option>
              </select>
            </label>
            <label style={{ marginLeft: '20px' }}>
              Search Category
              <select
                className="form-control"
                // style={{ marginLeft: '10px' }}
                value={this.state.type}
                onChange={this.handleSelectChange}
              >
                <option value="M">Medication</option>
                <option value="T">Tests</option>
                <option value="H">Health</option>
                <option value="P">Procedures</option>
              </select>
            </label>

            <label style={{ marginLeft: '20px' }}>
              Search
              <input
                // required
                className="form-control"
                // style={{ marginLeft: '10px' }}
                type="text"
                value={this.state.search_string}
                onChange={this.handleChange}
              />
            </label>

            <Button type="submit" style={{ marginLeft: '20px' }}>
              Search
            </Button>
          </div>
        </form>

        <div>fil
          {this.state.result && (
            <table className="dataframe table table-striped table-condensed table-hover dataTable no-footer">
              <thead>
                <tr>
                  <th>PRN</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Visit Date</th>
                  <th>Search Text Source</th>
                </tr>
              </thead>
              <tbody>
                {this.state.result.map(result => {
                  return (
                    <tr>
                      {Object.values(result).map(r => {
                        return <td>{r}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

CustomSearch.propTypes = {};
CustomSearch.defaultProps = {};

export default CustomSearch;
