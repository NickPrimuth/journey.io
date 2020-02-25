import React, { Component } from 'react';

import { Jumbotron, Button } from 'react-bootstrap';

import ActiveCard from './ActiveCard';
import InactiveCard from './InactiveCard';
import EditCampaign from './EditCampaign';
import CreateCampaign from './CreateCampaign';

//This is the main artist management page
class Dashboard extends Component {
  //assigns props passed down (artistId and campaignId)
  //initializes state
  constructor(props) {
    super(props);
    this.state = {
      artistName: this.props.artistName,
      campaigns: [],
      currentCampaign: {},
      showEditModal: false,
      showCreateModal: false,
      showDetailsModal: false
    };
    this.assignCurrentCampaign = this.assignCurrentCampaign.bind(this);
    this.assignCurrentCampaignDetails = this.assignCurrentCampaignDetails.bind(
      this
    );
    this.toggleCreateModal = this.toggleCreateModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
    this.loadArtistCampaigns = this.loadArtistCampaigns.bind(this);
    this.deactivateCampaign = this.deactivateCampaign.bind(this);
  }
  //fetch the artist's campaigns
  componentDidMount() {
    this.loadArtistCampaigns();
  }
  //this function hides or shows the create modal
  toggleCreateModal(show) {
    this.setState({ showCreateModal: show });
  }
  //this function hides or shows the edit modal
  toggleEditModal(show) {
    this.setState({ showEditModal: show });
  }
  //this function hides or shows the details modal
  toggleDetailsModal(show) {
    this.setState({ showDetailsModal: show });
  }
  //when you click edit on the currentcampaign is assigned in the state for view of the edit
  assignCurrentCampaign(id) {
    let currentCampaign = {};
    this.state.campaigns.forEach(campaign => {
      if (id === campaign.id) {
        currentCampaign = campaign;
      }
    });
    this.setState({ currentCampaign, showEditModal: true });
  }
  //when you click edit on the currentcampaign is assigned in the state for view of the details metrics modal
  assignCurrentCampaignDetails(id) {
    let currentCampaign = {};
    this.state.campaigns.forEach(campaign => {
      if (id === campaign.id) {
        currentCampaign = campaign;
      }
    });
    this.setState({ currentCampaign, showDetailsModal: true });
  }
  // loads all the artists campaigns with the props.artistid passed down
  loadArtistCampaigns() {
    fetch('/artist/dashboard/')
      .then(data => data.json())
      .then(res => {
        //all modals should be turned off upon any actions
        this.setState({
          campaigns: res.campaigns,
          showEditModal: false,
          showCreateModal: false
        });
      })
      .catch(err => {
        console.log('Error retrieving campaigns: ', err);
      });
  }
  //deactiviating campaign
  deactivateCampaign(campaignId) {
    fetch('/artist/deactivatecampaign', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: campaignId })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.loadArtistCampaigns();
      })
      .catch(err => {
        console.log('Error deactivating campaign: ', err);
      });
  }

  render() {
    const { campaigns } = this.state;
    const cards = campaigns.map((campaign, i) => {
      //only render active cards for active campaigns
      if (campaign.active) {
        return (
          <ActiveCard
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            artistName={this.state.artistName}
            show={this.state.showDetailsModal}
            onClick={this.assignCurrentCampaign}
            showDetails={this.assignCurrentCampaignDetails}
            toggleDetailsModal={this.toggleDetailsModal}
            deactivate={this.deactivateCampaign}
          />
        );
      } else {
        return (
          //only render inactive cards for inactive campaigns
          <InactiveCard
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            show={this.state.showDetailsModal}
            onClick={this.assignCurrentCampaign}
            showDetails={this.assignCurrentCampaignDetails}
            toggleDetailsModal={this.toggleDetailsModal}
          />
        );
      }
    });

    return (
      //title
      <div className="dashboard">
        <Jumbotron fluid>
          <h1>My Dashboard</h1>
        </Jumbotron>
        <div className="d-flex row">
          {cards}
          <Button
            className="createCampaign"
            onClick={() => {
              this.toggleCreateModal(true);
            }}
          >
            Create Campaign
          </Button>
        </div>
        {/* edit modal */}
        <EditCampaign
          show={this.state.showEditModal}
          currentCampaign={this.state.currentCampaign}
          toggleEditModal={this.toggleEditModal}
          loadArtistCampaigns={this.loadArtistCampaigns}
        />
        {/* create modal */}
        <CreateCampaign
          show={this.state.showCreateModal}
          artistId={this.props.artistId}
          toggleCreateModal={this.toggleCreateModal}
          loadArtistCampaigns={this.loadArtistCampaigns}
        />
      </div>
    );
  }
}

export default Dashboard;
