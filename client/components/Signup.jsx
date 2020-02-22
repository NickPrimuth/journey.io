import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Form, Button } from "react-bootstrap";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupVerify: false,
      name: "",
      username: "",
      password: "",
      location: ""
    };

    // this.setName = this.setName.bind(this);
    // this.setUsername = this.setUsername.bind(this);
    // this.setPw = this.setPw.bind(this);
    // this.setLocation = this.setLocation.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  // setName(e) {
  //   this.setState({ name: e.target.value });
  // }

  // setUsername(e) {
  //   this.setState({ username: e.target.value });
  // }

  // setPw(e) {
  //   this.setState({ password: e.target.value });
  // }

  // setLocation(e) {
  //   this.setState({ location: e.target.value });
  // }

  createUser(e) {
    e.preventDefault();
    const body = {
      name: e.target.createNameInput,
      username: e.target.createUsernameInput,
      password: e.target.createPasswordInput,
      location: e.target.createLocationInput
    };

    fetch("/artist/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ signupVerify: true });
        }
      })
      .catch(err => {
        console.log("Login ERROR: ", err);
      });
  }

  render() {
    if (this.state.signinVerify) {
      return <Redirect to="/" />;
    }
    return (
      <Form className="signup" onSubmit={this.createUser}>
        <Form.Group controlId="createNameInput">
          <Form.Label>Artist Name</Form.Label>
          <Form.Control
            type="text"
            // onChange={this.setUsername}
            // value={this.state.name}
          />
        </Form.Group>
        <Form.Group controlId="createUsernameInput">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            // onChange={this.setUsername}
            // value={this.state.username}
          />
        </Form.Group>
        <Form.Group controlId="createPasswordInput">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create a password"
            // onChange={this.setPw}
            // value={this.state.password}
          />
        </Form.Group>
        <Form.Group controlId="createLocationInput">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Button variant="info" type="submit">
          Sign Up
        </Button>
      </Form>
    );
  }
}

export default Signup;
