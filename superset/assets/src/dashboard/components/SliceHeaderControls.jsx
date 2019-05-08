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
import moment from 'moment';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { t } from '@superset-ui/translation';
import { saveSvgAsPng, svgAsPngUri, svgAsDataUri } from 'save-svg-as-png';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  GooglePlusIcon,
  LinkedinIcon,
} from 'react-share';

const propTypes = {
  slice: PropTypes.object.isRequired,
  isCached: PropTypes.bool,
  isExpanded: PropTypes.bool,
  cachedDttm: PropTypes.string,
  updatedDttm: PropTypes.number,
  supersetCanExplore: PropTypes.bool,
  sliceCanEdit: PropTypes.bool,
  toggleExpandSlice: PropTypes.func,
  forceRefresh: PropTypes.func,
  exploreChart: PropTypes.func,
  exportCSV: PropTypes.func,
};

const defaultProps = {
  forceRefresh: () => ({}),
  toggleExpandSlice: () => ({}),
  exploreChart: () => ({}),
  exportCSV: () => ({}),
  cachedDttm: null,
  updatedDttm: null,
  isCached: false,
  isExpanded: false,
  supersetCanExplore: false,
  sliceCanEdit: false,
};

const VerticalDotsTrigger = () => (
  <div className="vertical-dots-container">
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
  </div>
);

class SliceHeaderControls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.exportCSV = this.exportCSV.bind(this);
    this.exploreChart = this.exploreChart.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.refreshChart = this.refreshChart.bind(this);
    this.toggleExpandSlice = this.props.toggleExpandSlice.bind(
      this,
      this.props.slice.slice_id,
    );

    this.state = {
      showControls: false,
      svgUrl: '',
      vizTypes: [
        'pie',
        'pin_visualization',
        'histogram',
        'dist_bar',
        'chord',
        'sankey',
        'world_map',
        'treemap',
        'sunburst',
        'bubble',
        'line',
        'area',
        'box_plot',
        'country_map',
        'line_multi',
        'heatmap',
        'directed_force',
        'cal_heatmap',
        'para',
        'dual_line',
        'word_cloud',
      ],
    };
  }

  exportCSV() {
    this.props.exportCSV(this.props.slice.slice_id);
  }

  exploreChart() {
    this.props.exploreChart(this.props.slice.slice_id);
  }

  refreshChart() {
    if (this.props.updatedDttm) {
      this.props.forceRefresh(this.props.slice.slice_id);
    }
  }

  toggleControls() {
    this.setState({
      showControls: !this.state.showControls,
    });
  }

  downlaodViz(id) {
    console.log('oin saveeeeeeeeee', id);

    var svgId = 'svg_' + id;
    d3.select('#' + id + ' svg').attr('id', svgId);
    var svgEl = d3.select('#' + id + ' svg');
    let file_name = id + '-visualization.png';
    svgEl = svgEl[0][0];
    if (svgEl !== null) {
      saveSvgAsPng(document.getElementById(svgId), file_name, {
        backgroundColor: 'white',
      });
    }
    // var svgEl = d3.select("#" + id + " svg")
    // svgEl = svgEl[0][0]
    // if (svgEl !== null) {
    //   var name = "viz.svg"
    //   var svgData = svgEl.outerHTML;
    //   var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    //   var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
    //   var svgUrl = URL.createObjectURL(svgBlob);
    //   var downloadLink = document.createElement("a");
    //   downloadLink.href = svgUrl;
    //   downloadLink.download = name;
    //   document.body.appendChild(downloadLink);
    //   downloadLink.click();
    //   document.body.removeChild(downloadLink);
    // }
  }

  shareViz(id) {
    var svgId = 'svg_' + id;
    var svgEl = d3.select('#' + id + ' svg').attr('id', svgId);
    let currentThis = this;
    console.log(svgEl);
    if (svgEl[0][0] !== null) {
      svgAsPngUri(
        document.getElementById(svgId),
        { backgroundColor: 'white' },
        function(uri) {
          $.ajax({
            type: 'POST',
            url: `/superset/save_viz_image/`,
            data: {
              data: uri,
            },
            success: svgUrl => {
              console.log('url--->', svgUrl);
              currentThis.setState({
                svgUrl,
              });
            },
            error: err => {
              console.log('error--->', err);
            },
          });
        },
      );
    }
  }

  render() {
    const { slice, isCached, cachedDttm, updatedDttm } = this.props;
    const cachedWhen = moment.utc(cachedDttm).fromNow();
    const updatedWhen = updatedDttm ? moment.utc(updatedDttm).fromNow() : '';
    const refreshTooltip = isCached
      ? t('Cached %s', cachedWhen)
      : (updatedWhen && t('Fetched %s', updatedWhen)) || '';

    return (
      <Dropdown
        id={`slice_${slice.slice_id}-controls`}
        pullRight
        // react-bootstrap handles visibility, but call toggle to force a re-render
        // and update the fetched/cached timestamps
        onToggle={this.toggleControls}
      >
        <Dropdown.Toggle className="slice-header-controls-trigger" noCaret>
          <VerticalDotsTrigger />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <MenuItem onClick={this.refreshChart} disabled={!updatedDttm}>
            {t('Force refresh')}
            <div className="refresh-tooltip">{refreshTooltip}</div>
          </MenuItem>

          <MenuItem divider />

          {slice.description && (
            <MenuItem onClick={this.toggleExpandSlice}>
              {t('Toggle chart description')}
            </MenuItem>
          )}

          {this.state.vizTypes.includes(slice.viz_type) && (
            <div>
              <MenuItem
                onClick={() => {
                  this.downlaodViz(`chart-id-${slice.slice_id}`);
                }}
              >
                {t('Download')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.shareViz(`chart-id-${slice.slice_id}`);
                }}
              >
                {t('Share')}
                <div style={{ display: 'flex' }}>
                  <WhatsappShareButton url={this.state.svgUrl}>
                    <WhatsappIcon size={28} round />
                  </WhatsappShareButton>
                  <FacebookShareButton url={this.state.svgUrl}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={this.state.svgUrl}>
                    <LinkedinIcon size={28} round />
                  </LinkedinShareButton>
                  <GooglePlusShareButton url={this.state.svgUrl}>
                    <GooglePlusIcon size={28} round />
                  </GooglePlusShareButton>
                  <TwitterShareButton url={this.state.svgUrl}>
                    <TwitterIcon size={28} round />
                  </TwitterShareButton>
                </div>
              </MenuItem>
            </div>
          )}

          {this.props.sliceCanEdit && (
            <MenuItem href={slice.edit_url} target="_blank">
              {t('Edit chart metadata')}
            </MenuItem>
          )}

          <MenuItem onClick={this.exportCSV}>{t('Export CSV')}</MenuItem>

          {this.props.supersetCanExplore && (
            <MenuItem onClick={this.exploreChart}>
              {t('Explore chart')}
            </MenuItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

SliceHeaderControls.propTypes = propTypes;
SliceHeaderControls.defaultProps = defaultProps;

export default SliceHeaderControls;
