import React from "react";

import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
// import axios from "axios";

const useStyles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textinput: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  pos: {
    width: "25ch",
  },
  cardd: {
    display: "flex",
    justifyContent: "center",
    marginLeft: "28%",
    width: "42%",
    marginTop: "50px",
  },
  title: {
    fontSize: 44,
  },
});

class App extends React.Component {
  state = {
    showFieldPoly: false,
    showFieldSun: false,
    selectedValue: "",
    message: "",
    polygonArray: "",
    point: "",
    polyanswer: "",
    sunAnswer: "",
  };

  handleFirstFieldChange = (event) => {
    const { value } = event.target;
    this.setState({ polygonArray: value });
  };

  handleSecondFieldChange = (event) => {
    const { value } = event.target;
    this.setState({ point: value });
  };

  checkLayers = (event) => {
    const { value } = event.target;

    this.setState({
      showFieldPoly: value === "Poly",
      showFieldSun: value === "Sun",
      selectedValue: value,
      message: "",
    });
  };

  dataSubmit = (event) => {
    console.log(this.state.polygonArray, this.state.point);
  };

  handleSubmitPolygon = (event) => {
    event.preventDefault();
    const polygon = {
      polygonArray: this.state.polygonArray,
      point: this.state.point,
    };

    axios.post(`http://localhost:8000/check`, { polygon }).then((res) => {
      console.log(res.data);
      this.setState({ polyanswer: res.data });
    });
  };

  handleSubmitSun = (event) => {
    event.preventDefault();
    const sun = {
      Buildings: this.state.polygonArray,
      point: this.state.point,
    };

    axios.post(`http://localhost:8000/sun`, { sun }).then((res) => {
      console.log(res.data);
      this.setState({ sunAnswer: res.data });
    });
  };

  render() {
    const { selectedValue, showFieldPoly, showFieldSun } = this.state;
    const { classes } = this.props;

    return (
      <div className="App">
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            Problem
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={selectedValue}
            onChange={this.checkLayers}
            label="Problem"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Poly">Polygon Problem</MenuItem>
            <MenuItem value="Sun">Sun Covering Problem</MenuItem>
          </Select>
        </FormControl>
        <form className={classes.textinput}>
          {showFieldPoly ? (
            <TextField
              id="Array"
              label="Array of Polygon"
              variant="outlined"
              onChange={this.handleFirstFieldChange}
              value={this.state.polygonArray}
            />
          ) : null}
          {showFieldPoly ? (
            <>
              <TextField
                id="Point"
                label="Point to find out"
                variant="outlined"
                onChange={this.handleSecondFieldChange}
                value={this.state.point}
              />
              <Button
                className={classes.pos}
                variant="contained"
                onClick={this.handleSubmitPolygon}
              >
                Default
              </Button>

              <Card className={classes.cardd}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    variant="h5"
                    component="h2"
                  >
                    {this.state.polyanswer}
                  </Typography>
                </CardContent>
              </Card>
            </>
          ) : null}
          {showFieldSun ? (
            <TextField
              id="Array"
              label="Array of Buildings"
              variant="outlined"
              onChange={this.handleFirstFieldChange}
              value={this.state.polygonArray}
            />
          ) : null}
          {showFieldSun ? (
            <>
              <TextField
                id="Sun"
                label="Coodinate of Sun"
                variant="outlined"
                onChange={this.handleSecondFieldChange}
                value={this.state.point}
              />
              <Button
                className={classes.pos}
                variant="contained"
                onClick={this.handleSubmitSun}
              >
                Submit
              </Button>

              <Card className={classes.cardd}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    variant="h5"
                    component="h2"
                  >
                    {this.state.sunAnswer}
                  </Typography>
                </CardContent>
              </Card>
            </>
          ) : null}

          {/* <div>
            <h1>{this.state.polyanswer}</h1>
          </div> */}
        </form>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
