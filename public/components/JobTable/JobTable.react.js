import React from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import ConfirmButton from '../utils/ConfirmButton.react';
import ProgressSpinner from '../utils/ProgressSpinner.react';

import tagManagerApi from '../../util/tagManagerApi';

export default class JobTable extends React.Component {

    constructor(props) {
        super(props);
    }

    removeJob(jobId) {
      var self = this;
      tagManagerApi.deleteJob(jobId).then((res) => {
        setTimeout(() => {
          self.props.triggerRefresh();
        }, 1000);
      });
    }

    rollbackJob(jobId) {
      var self = this;
      tagManagerApi.rollbackJob(jobId).then((res) => {
        setTimeout(() => {
          self.props.triggerRefresh();
        }, 1000);
      });
    }

    stepProgress(step) {
      if (step.type === 'AllUsagesOfTagRemovedCheck') {
        return (
          <span>
            <b>{(step.originalCount - step.completed)}/{step.originalCount}</b> content still contain <b>{step.apiTagId}</b>
          </span>
        );
      }

      if (step.type === 'TagRemovedCheck') {
        return (
          <span>
            Confirming <b>{step.apiTagId}</b> has been removed from CAPI
          </span>
        );
      }

      return false;
    }

    prettyJobStatus(jobStatus) {
      if (jobStatus == 'waiting' || jobStatus == 'owned') {
        // This is a pretty meaningless distinction to end users so just wrap it up as 'in progress'
        return 'In Progress';
      } else if (jobStatus == 'complete') {
        return 'Done';
      } else if (jobStatus == 'failed') {
        return 'Failed';
      } else if (jobStatus == 'rolledback') {
        return 'Rolled Back';
      }
      return jobStatus;
    }

    prettyStepType(stepType) {
      if (stepType == 'remove-tag-from-content') {
        return 'Remove tag from all content';
      } else if (stepType == 'remove-tag-path') {
        return 'Remove path for tag';
      } else if (stepType == 'remove-tag-from-capi') {
        return 'Remove tag from CAPI';
      } else if (stepType == 'remove-tag') {
        return 'Remove tag from Tag Manager';
      } else if (stepType == 'add-tag-to-content') {
        return 'Add tag to content';
      } else if (stepType == 'merge-tag-for-content') {
        return 'Merging tag in content';
      } else if (stepType == 'reindex-tags') {
        return 'Reindexing tags';
      } else if (stepType == 'reindex-sections') {
        return 'Reindexing sections';
      }
      return stepType;
    }

    prettyStepStatus(stepStatus){
      if (stepStatus == 'ready') {
        return <i className="i-clock" title="Waiting to be processed"/>;

      } else if (stepStatus == 'processing' || stepStatus == 'processed') {
        return <ProgressSpinner/>

      } else if (stepStatus == 'complete') {
        return <i className="i-tick-green" title="Complete"/>;

      } else if (stepStatus == 'rolledback') {
        return <i className="i-rollback-grey" title="Rollback successful"/>;

      } else if (stepStatus == 'failed') {
        return <i className="i-cross-red" title="Failed"/>;

      } else if ( stepStatus == 'rollbackfailed') {
        return <i className="i-failed-face-red" title="Rollback failed"/>;
      }
      return <span>{stepStatus}</span>
    }

    stepRowClass(step) {
      if (step.stepStatus == 'failed' || step.stepStatus == 'rollbackfailed') {
        return 'row-warning';
      } else if (step.stepStatus == 'complete') {
        return 'row-complete';
      } else if (step.stepStatus == 'rolledback') {
        return 'row-rolledback'
      }
      return '';
    }


    renderJobStep(step, job) {
      return (
        <tr className={this.stepRowClass(step)} key={job.id + step.type}>
          <td>{this.prettyStepType(step.type)}</td>
          <td>{step.stepMessage}</td>
          <td>{this.prettyStepStatus(step.stepStatus)}</td>
        </tr>);
    }

    renderAllSteps(job) {
      return (
        <td>
          <table className="grid-table jobtable">
            <thead>
              <tr>
                <th>Step</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {job.steps.map(this.renderJobStep, this, job)}
            </tbody>
          </table>
        </td>
      );
    }

    renderCurrentStep(job) {
      const step = job.steps.find(s => {
          return s.stepStatus != "complete";
      });

      const rowClass = this.stepRowClass(step);
      return (
          <td>
            <span className={rowClass}>
              {this.prettyStepType(step.type)}
            </span>
          </td>
        );
    }

    renderDeleteButton(job) {
      if (job.jobStatus == "failed" || job.jobStatus == "rolledback" || job.jobstatus == "complete") {
        return <ConfirmButton buttonText="Delete" onClick={this.removeJob.bind(this, job.id)} disabled={this.props.disableDelete}/>;
      }
      return false;
    }

    renderRollbackButton(job) {
      if (job.jobStatus == "failed") {
        return <ConfirmButton buttonText="Rollback" onClick={this.rollbackJob.bind(this, job.id)} disabled={this.props.disableDelete}/>;
      }
      return false;
    }

    renderStatusCell(job) {
      return <div>
        <h4>{this.prettyJobStatus(job.jobStatus)}</h4>
        {this.renderDeleteButton(job)}
        {this.renderRollbackButton(job)}
      </div>;
    }

    renderListItem(job) {
      const itemTime = moment(job.createdAt, 'x');

      return (
        <tbody className="jobtable__results">
          <tr key={job.id}>
            <td>
              {itemTime.format('DD/MM/YYYY')}<br />
              {itemTime.format('HH:mm:ss')}
            </td>
            <td>{job.createdBy}</td>
              {this.props.simpleView ? this.renderCurrentStep(job) : this.renderAllSteps(job)}
            <td>
              {this.renderStatusCell(job)}
            </td>
          </tr>
        </tbody>
      );
    }

    render () {

      return (
          <table className="grid-table jobtable">
            <thead className="jobtable__header">
              <tr>
                <th>Started</th>
                <th>User</th>
                <th>
                  {this.props.simpleView ? "Current Step" : "Progress"}
                </th>
                <th></th>
              </tr>
            </thead>
            {this.props.jobs.map(this.renderListItem, this)}
          </table>

      );
    }
}
