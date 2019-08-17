import React, { Component } from "react";
import StartJob from "./startJob/startJob";
import PreparationChecklist from "./preparationChecklist";
import Inspection from "./inspection";
import Timer from "./timer";

export default class Machine extends Component {
  state = {
    selectedTask: null
  };

  displayTask = task => {
    return () => {
      this.setState({ selectedTask: task });
    };
  };

  hideTask = () => {
    this.setState({ selectedTask: null });
  };

  renderTask = () => {
    switch (this.state.selectedTask) {
      case "Start Job":
        return <StartJob hideTask={this.hideTask} />;
      case "Preparation Checklist":
        return <PreparationChecklist hideTask={this.hideTask} />;
      case "Inspection":
        return <Inspection hideTask={this.hideTask} />;
      case "Timer":
        return <Timer hideTask={this.hideTask} />;
      default:
        return "";
    }
  };

  render = () => {
    const buttonTypes = [
      "Start Job",
      "Preparation Checklist",
      "Inspection",
      "Timer"
    ];

    return (
      <div className="machine-container">
        <div className="machine-header">
          <span
            className="back-icon machine"
            onClick={this.props.toggleMachineSelection(null)}
          >
            &lsaquo;
          </span>
          <h1 className="machine-name">
            {this.props.machine.type} {this.props.machine.id}
          </h1>
        </div>
        <img src="./assets/machine.png" alt="MachinePNG" />
        <div className="machine-buttons-container">
          {buttonTypes.map((butTyp, idx) => (
            <Button key={idx} type={butTyp} displayTask={this.displayTask} />
          ))}
        </div>
        <div>{!this.state.selectedTask ? "" : this.renderTask()}</div>
      </div>
    );
  };
}

const Button = props => {
  return (
    <div
      className="machine-button-container"
      onClick={props.displayTask(props.type)}
    >
      <p>{props.type}</p>
    </div>
  );
};
