import './CustomReportImage.css';
import ReactDOM from 'react-dom';
import React from 'react';
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import { element } from 'prop-types';

// const report_types = [
//   { value: 1, label: 'Radiograph of chest' },
//   { value: 2, label: 'CT Thorax (P+C)' },
//   { value: 3, label: 'USG abdomen and pelvis' },
//   { value: 4, label: 'Left Upper Limb Venous Doppler' },
//   { value: 5, label: 'CT Urography (P+C)' },
//   { value: 6, label: 'CT Abdomen and Pelvis' },
//   { value: 7, label: 'Radiograph of Kub' },
//   { value: 8, label: 'USG Kub' },
//   { value: 9, label: 'CT Urography Plain' },
//   { value: 10, label: 'CT Brain Plain' },
//   { value: 11, label: 'MRI Brain (P + C) 3 Tesla' },
//   { value: 12, label: 'Radiographs of Right Knee Joint(AP/LAT)' }
// ];

// const options1 = [
//   {
//     value: '3/12/2018',
//     label: '3/12/2018',
//     img: '/static/assets/images/reports/chest1.jpeg'
//   },
//   {
//     value: '4/12/2018',
//     label: '4/12/2018',
//     img: '/static/assets/images/reports/chest2.jpeg'
//   },
//   {
//     value: '6/12/2018',
//     label: '6/12/2018',
//     img: '/static/assets/images/reports/chest3.jpeg'
//   },
//   {
//     value: '8/12/2018',
//     label: '8/12/2018',
//     img: '/static/assets/images/reports/chest4.jpeg'
//   },
//   {
//     value: '19/12/2018',
//     label: '19/12/2018',
//     img: '/static/assets/images/reports/chest5.jpeg'
//   },
//   {
//     value: '23/12/2018',
//     label: '23/12/2018',
//     img: '/static/assets/images/reports/chest6.jpeg'
//   }
// ];

// const options2 = [
//   {
//     value: '4/12/2018',
//     label: '4/12/2018',
//     img: '/static/assets/images/reports/ct_t_1.jpeg'
//   },
//   {
//     value: '8/12/2018',
//     label: '8/12/2018',
//     img: '/static/assets/images/reports/ct_t_2.jpeg'
//   },
//   {
//     value: '19/12/2018',
//     label: '19/12/2018',
//     img: '/static/assets/images/reports/ct_t_3.jpeg'
//   }
// ];

// const options3 = [
//   {
//     value: '3/12/2018',
//     label: '3/12/2018',
//     img: '/static/assets/images/reports/brain.jpeg'
//   },
//   {
//     value: '4/12/2018',
//     label: '4/12/2018',
//     img: '/static/assets/images/reports/brain2.jpeg'
//   },
//   {
//     value: '8/12/2018',
//     label: '8/12/2018',
//     img: '/static/assets/images/reports/brain3.jpeg'
//   },
//   {
//     value: '23/12/2018',
//     label: '23/12/2018',
//     img: '/static/assets/images/reports/brain4.jpeg'
//   }
// ];

class CustomReportImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTypeSelected: {},
      optionSelected: [],
      isDisabled: false,
      maxItems: 2,
      patient_name: '',
      report_data: []
    };
    this.onChangeHandlerReportType = this.onChangeHandlerReportType.bind(this);
    this.onChangeHandlerDates = this.onChangeHandlerDates.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.formData.extraFilters[0].val !==
      this.props.formData.extraFilters[0].val
    ) {
      $.ajax({
        type: 'POST',
        url: `/superset/get_patient_reports/`,
        data: {
          patient_name: this.props.formData.extraFilters[0].val
        },
        success: result => {
          console.log('result--->', result);
          this.setState({
            report_types: result.data,
            patient_name: this.props.formData.extraFilters[0].val,
            reportTypeSelected: [],
            optionSelected: [],
            report_data: []
          });
        },
        error: err => {
          console.log('error--->', err);
        }
      });
    }
  }

  componentDidMount() {
    $.ajax({
      type: 'POST',
      url: `/superset/get_patient_reports/`,
      data: {
        patient_name: this.props.formData.extraFilters[0].val
      },
      success: result => {
        console.log('result--->', result);
        this.setState({
          report_types: result.data,
          patient_name: this.props.formData.extraFilters[0].val,
          reportTypeSelected: [],
          optionSelected: [],
          report_data: []
        });
      },
      error: err => {
        console.log('error--->', err);
      }
    });
  }

  onChangeHandlerReportType(option) {
    $.ajax({
      type: 'POST',
      url: `/superset/get_patient_reports_dates/`,
      data: {
        patient_name: this.state.patient_name,
        report_type: option.value
      },
      success: result => {
        this.setState({
          reportTypeSelected: option,
          optionSelected: [],
          datesMenu: result.data,
          report_data: []
        });
      },
      error: err => {
        console.log('error--->', err);
      }
    });
  }

  onChangeHandlerDates(option) {
    if (option.length <= this.state.maxItems) {
      var report_dates = [];
      option.map(date => {
        report_dates.push(date.value);
      });

      $.ajax({
        type: 'POST',
        url: `/superset/get_patient_reports_details/`,
        data: {
          patient_name: this.state.patient_name,
          report_type: this.state.reportTypeSelected.value,
          report_date: option.slice(-1)[0].value,
          report_dates: report_dates
        },
        success: result => {
          console.log('result------>', result);
          this.setState({
            report_data: result.data,
            optionSelected: option
          });
        },
        error: err => {
          console.log('error--->', err);
        }
      });
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <h2>Name: {this.state.patient_name}</h2>
        <div className="select-container">
          <div className="select-item">
            <label>Report Type:</label>
            <Select
              options={this.state.report_types}
              onChange={value => this.onChangeHandlerReportType(value)}
              value={this.state.reportTypeSelected}
            />
          </div>
          <div className="select-item">
            <label>Date:</label>
            <Select
              options={this.state.datesMenu}
              onChange={value => this.onChangeHandlerDates(value)}
              value={this.state.optionSelected}
              multi
            />
          </div>
        </div>

        <div className="image-container">
          {this.state.report_data &&
            this.state.report_data.map((option, index) => {
              return (
                <div key={index} className="image-item">
                  <img width={400} height={300} src={option[0].image} />
                  <label>{option[0].report_date}</label>
                  <div>{option[0].observation}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

CustomReportImage.propTypes = {};
CustomReportImage.defaultProps = {};

export default CustomReportImage;
