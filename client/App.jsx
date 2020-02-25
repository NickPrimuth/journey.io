/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */

import React, { Component } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Campaign from './components/Campaign';
import CreateCampaign from './components/CreateCampaign';
import EditCampaign from './components/EditCampaign';
import './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      artistName: '',
      activeCampaigns: []
    };

    this.updateId = this.updateId.bind(this);
  }

  // On App mount, get the campaign data for each endpoint (active campaigns only) and save it to the variable in state called activeCampaigns
  componentDidMount() {
    fetch('/user/getCampaigns')
      .then((data) => data.json())
      .then((res) => {
        this.setState({ activeCampaigns: res.campaigns });
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }

  // Create a function called updateId that when it's eventually called, it will take in the artistId and set the artistId key in state to the argument provided.
  updateId(artistId, artistName) {
    this.setState({ id: artistId, artistName: artistName });
  }

  render() {
    const { activeCampaigns } = this.state;
    if (activeCampaigns.length > 0) {
      const routes = activeCampaigns.map((obj, i) => {
        let pathStr = '/' + obj.artist + '/' + obj.campaign;
        return (
          <Route
            key={i}
            exact
            path={pathStr}
            render={(props) => (
              <Campaign
                {...props}
                artistName={obj.artist}
                artistId={obj.artist_id}
                artistName={obj.artist}
                campaignId={obj.campaign_id}
              />
            )}
          />
        );
      });
      return (
        <div className='router'>
          <main>
            <Switch>
              <Route exact path='/' component={Homepage} />
              <Route
                exact
                path='/login'
                render={(props) => <Login {...props} updateState={this.updateId} />}
              />
              <Route
                exact
                path='/signup'
                render={(props) => <Signup {...props} updateState={this.updateId} />}
              />
              <Route
                exact
                path='/dashboard'
                render={(props) => (
                  <Dashboard
                    {...props}
                    artistId={this.state.id}
                    artistName={this.state.artistName}
                  />
                )}
              />
              <Route
                exact
                path='/createcampaign'
                render={(props) => <CreateCampaign {...props} artistId={this.state.id} />}
              />
              {routes}
            </Switch>
          </main>
        </div>
      );
    }
    return (
      <div className='router'>
        <main>
          <Switch>
            <Route exact path='/' component={Homepage} />
            <Route
              exact
              path='/login'
              render={(props) => <Login {...props} updateState={this.updateId} />}
            />
            <Route
              exact
              path='/signup'
              render={(props) => <Signup {...props} updateState={this.updateId} />}
            />
            <Route
              exact
              path='/dashboard'
              render={(props) => (
                <Dashboard {...props} artistId={this.state.id} artistName={this.state.artistName} />
              )}
            />
            <Route
              exact
              path='/createcampaign'
              render={(props) => <CreateCampaign {...props} artistId={this.state.id} />}
            />
            <Route
              exact
              path='/editcampaign'
              render={(props) => <EditCampaign {...props} artistId={this.state.id} />}
            />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
