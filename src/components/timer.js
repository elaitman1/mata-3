import React, { Component } from "react";
import Confirmation from "./confirmation";
import _ from "lodash";

export default class Timer extends Component {
  state = {
    hour: null,
    minute: null,
    second: null,
    showConfirmation: false
  };

  toggleConfirmation = () => {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  };

  handleStartTimer = () => {
    this.toggleConfirmation();
  };

  updateTimerValue = field => {
    return () => {
      const timerType = this.props.notificationTimer ? `.${this.props.dndTimerType}` : "";
      const selectorClass = this.props.notificationTimer ? `.timer-selector-bar${timerType}` : ".timer-selector-bar"
      let selector = document
        .querySelector(selectorClass)
        .getBoundingClientRect();
      let fieldElements = document.querySelectorAll(`.timer-value.${field}${timerType}`);
      // for each timer element that isn't one of the empty spaces for placeholder/styling purposes, get the average of its top and bottom positions and check that against the selector bar's top and bottom bounding positions to determine if it should be selected and also update the state's value for that timer spec for handling submit
      fieldElements.forEach(elem => {
        if (elem.innerHTML !== " ") {
          const timerTypeNoPeriod = timerType.slice(1, timerType.length);
          let scrollPos =
            (elem.getBoundingClientRect().top +
              elem.getBoundingClientRect().bottom) /
            2;
          if (scrollPos >= selector.top && scrollPos <= selector.bottom) {
            elem.className = `timer-value ${field} ${timerTypeNoPeriod} selected`;
            this.setState({ [field]: parseInt(elem.innerHTML) });
          } else {
            if (elem.className !== `timer-value ${field} ${timerTypeNoPeriod}`) {
              elem.className = `timer-value ${field} ${timerTypeNoPeriod}`;
            }
          }
        }
      });
    };
  };

  renderTask = () => {
    const scrollables = Object.keys(this.state).map((timerSpec, idx) => {
      if (timerSpec !== "showConfirmation") {
        return (
          <Scrollable
            key={idx}
            spec={timerSpec}
            updateTimerValue={this.updateTimerValue}
            notificationTimer={this.props.notificationTimer}
            dndTimerType={this.props.dndTimerType}
          />
        );
      }
    });

    if (this.state.showConfirmation) {
      return (
        <Confirmation
          task="Timer"
          hideTask={this.props.hideTask}
          toggleConfirmation={this.toggleConfirmation}
        />
      );
    } else {
      const containerClassName = this.props.notificationTimer ? "timer-container notification" : "timer-container";
      const buttonClassName = this.props.notificationTimer ? "form-submit-button hide" : "form-submit-button";
      const selectorClassName = this.props.notificationTimer ? `timer-selector-bar ${this.props.dndTimerType}` : "timer-selector-bar";
      return (
        <div className={containerClassName}>
          <div className="timer-specs-container">
            <span className={selectorClassName} />
            {scrollables}
          </div>
          <button
            className={buttonClassName}
            onClick={this.handleStartTimer}
          >
            Start
          </button>
        </div>
      );
    }
  };

  render = () => {
    const className = this.props.notificationTimer ? "overlay notification" : "overlay";
    return (
      <div>
        <div className={className} onClick={this.props.hideTask} />
        {this.renderTask()}
      </div>
    );
  };
}

const Scrollable = props => {
  const header = _.capitalize(props.spec);
  const arrayLength = props.spec === "hour" ? 13 : 60;

  return (
    <div className="timer-input-container">
      <h4>{header}</h4>
      <div
        className="timer-scrollable-container"
        onScroll={props.updateTimerValue(props.spec)}
      >
        {[" ", " ", " ", " ", " ", " ", " ", " "]
          .concat([...Array(arrayLength).keys()])
          .concat([" ", " ", " ", " ", " ", " ", " ", " ", " "])
          .map((val, idx) => {
            const timerType = props.notificationTimer ? props.dndTimerType : "";
            const className =
              val === 0
                ? `timer-value ${props.spec} ${timerType} selected`
                : `timer-value ${props.spec} ${timerType}`;
            return (
              <p key={idx} className={className}>
                {val}
              </p>
            );
          })}
      </div>
    </div>
  );
};
