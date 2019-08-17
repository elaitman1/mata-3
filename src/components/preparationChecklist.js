import React, { Component } from "react";
import Confirmation from "./confirmation";

export default class PreparationChecklist extends Component {
  state = {
    cells: {
      Machining: {
        "Clean Chamber": false,
        "Tool Offset": false,
        "Inspection Room": false
      },
      Preparation: {
        "Job Spec Confirmation": false,
        "Revise CAD Modeling": false,
        "Edit Toolpath": false
      },
      Note: ""
    },
    cellSelected: "Machining",
    prevCell: null,
    displayNote: false,
    prevNote: "",
    firstCellSelection: true,
    showConfirmation: false
  };

  selectCell = cell => {
    return () => {
      if (this.state.firstCellSelection) {
        this.setState({ firstCellSelection: false });
      }
      // if Note is selected, open Note textbox on top of the usual selecting of cell styling change
      if (cell === "Note") {
        this.setState({ prevCell: this.state.cellSelected });
        this.toggleNote();
      }
      document.getElementById(this.state.cellSelected).className = "cell";
      document.getElementById(cell).className = "cell selected";
      this.setState({ cellSelected: cell });
    };
  };

  update = e => {
    let newCells = this.state.cells;
    newCells.Note = e.currentTarget.value;
    this.setState({ cells: newCells });
  };

  toggleConfirmation = () => {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  };

  handleSaveChecklist = () => {
    this.toggleConfirmation();
  };

  toggleChecklist = checkList => {
    return () => {
      let newCells = this.state.cells;
      let bool = newCells[this.state.cellSelected][checkList];
      newCells[this.state.cellSelected][checkList] = bool ? false : true;
      this.setState({ cells: newCells });
    };
  };

  // after saving Note, switch back to the previous cell view that the user was at before displaying Note
  saveNote = () => {
    this.setState({
      cellSelected: this.state.prevCell,
      prevCell: null,
      prevNote: this.state.cells.Note
    });
    document.getElementById(this.state.cellSelected).className = "cell";
    document.getElementById(this.state.prevCell).className = "cell selected";
    this.toggleNote();
  };

  // similar logic to save note, but uses a previously saved value to switch the value back to it so as not to save any updates the user may have
  closeNote = () => {
    let newCells = this.state.cells;
    newCells.Note = this.state.prevNote;
    this.setState({ cells: newCells, cellSelected: this.state.prevCell });
    document.getElementById(this.state.cellSelected).className = "cell";
    document.getElementById(this.state.prevCell).className = "cell selected";
    this.toggleNote();
  };

  toggleNote = () => {
    this.setState({ displayNote: !this.state.displayNote });
  };

  renderCells = () => {
    return Object.keys(this.state.cells).map((cell, idx) => {
      // first cell when rendering component sets styling for blue border on the first cell
      const className =
        this.state.firstCellSelection && idx === 0 ? "cell selected" : "cell";
      return (
        <span
          key={idx}
          id={cell}
          className={className}
          onClick={this.selectCell(cell)}
        >
          {cell}
        </span>
      );
    });
  };

  renderTask = () => {
    if (this.state.showConfirmation) {
      return (
        <Confirmation
          task="Preparation Checklist"
          hideTask={this.props.hideTask}
          toggleConfirmation={this.toggleConfirmation}
        />
      );
    } else {
      const note = this.state.displayNote ? (
        <div>
          <div
            className="preparation-checklist-note-overlay"
            onClick={this.closeNote}
          />
          <div className="preparation-checklist-note-container">
            <h5>Add Note</h5>
            <textarea value={this.state.cells.Note} onChange={this.update} />
            <button className="form-submit-button" onClick={this.saveNote}>
              Save
            </button>
          </div>
        </div>
      ) : (
        ""
      );

      const checklistButtons = Object.keys(
        this.state.cells[this.state.cellSelected]
      ).map((checkList, idx) => (
        <Button
          key={idx}
          type={checkList}
          cell={this.state.cellSelected}
          toggleChecklist={this.toggleChecklist}
          bool={this.state.cells[this.state.cellSelected][checkList]}
        />
      ));

      return (
        <div>
          <div className="preparation-checklist-container">
            <h4>Start Job</h4>
            <header className="preparation-checklist-cells-container">
              {this.renderCells()}
            </header>
            <section className="preparation-checklist-body">
              <div className="preparation-checklist-buttons-container">
                {checklistButtons}
              </div>
              <button
                className="form-submit-button"
                onClick={this.handleSaveChecklist}
              >
                Save
              </button>
              {note}
            </section>
          </div>
        </div>
      );
    }
  };

  render = () => {
    return (
      <div>
        <div className="overlay" onClick={this.props.hideTask} />
        {this.renderTask()}
      </div>
    );
  };
}

const Button = props => {
  return (
    <div>
      {props.cell !== "Note" ? (
        <div
          id={props.type}
          className="preparation-checklist-button-container"
          style={{
            backgroundImage: props.bool
              ? "radial-gradient(circle at 50% 50%, #FFFFFF, #2E5BFF)"
              : ""
          }}
          onClick={props.toggleChecklist(props.type)}
        >
          <p>{props.type}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
