/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import { t } from '@superset-ui/translation';

const propTypes = {
  user: PropTypes.object.isRequired
};

export default class UploadFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      progress: 'Initial'
    };
    this.onChange = this.onChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  onChange(event) {
    // this.setState({ search: event.target.value });
    console.log(event.target.files);
    const file = event.target.files[0];
    this.setState({ file });
  }

  onUpload() {
    console.log('in upload');

    const data = new FormData();
    data.append('file', this.state.file)
    data.append('filename', this.state.file.name)

    fetch('/superset/upload_file/', {
      // Your POST endpoint
      method: 'POST',
      body: data // This is your file object
    })
      .then(
        response => console.log(response)
         // if the response is a JSON object
      )
      .catch(
        error => console.log(error) // Handle the error response object
      );

      this.setState({progress: 'completed'})
  }

  render() {
    return (
      <div>
        <hr />
        <Panel>
          <div class="container">
            <h2>Upload Report</h2>
            <p>
              <label class="btn btn-default btn-sm" for="my-file-selector">
                <input
                  id="my-file-selector"
                  type="file"
                  name="file"
                  style={{ display: 'none' }}
                  onChange={e => this.onChange(e)}
                />
                Choose File
              </label>
              <span class="label label-info" id="upload-file-info" />
              <br />
              <br />
              <input
                type="button"
                value="Upload"
                class="btn btn-primary btn-sm"
                onClick={() => this.onUpload()}
              />
            </p>
          </div>
          <div>
            {this.state.file && (
              <table className="dataframe table table-striped table-condensed table-hover dataTable no-footer">
                <thead>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Progress</th>
                </thead>
                <tbody>
                  <td>{this.state.file.name}</td>
                  <td>{this.state.file.size}</td>
                  <td>{this.state.progress}</td>
                </tbody>
              </table>
            )}
          </div>
        </Panel>
      </div>
    );
  }
}
