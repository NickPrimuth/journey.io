import React from 'react';
// ActiveCard is created via React Bootstrap
import { Card, Button } from 'react-bootstrap';

import Details from './Details';

// Located on the Artist Dashboard, the ActiveCard component houses the interface to edit and view the metrics for an active campaign. It is distinguishable from an inactive card simply by the text above the "edit" and "view metrics" buttons that says "Active".

// Props are being passed down from the Dashboard Component
// name and id relate to campaign.id and campaign.name
// onClick, t
const ActiveCard = ({
  id,
  name,
  artistName,
  show,
  onClick,
  showDetails,
  toggleDetailsModal,
  deactivate
}) => {
  //card display
  console.log('active card ', id);
  return (
    <Card className='dashboardCard' style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className='activeCard'>Active</Card.Subtitle>
        <Card.Subtitle>
          Link:
          <a href={window.location.origin + '/' + artistName + '/' + name}>
            {window.location.origin + '/' + artistName + '/' + name}
          </a>
        </Card.Subtitle>
        <div className='buttons'>
          <Button
            type='submit'
            variant='danger'
            onClick={() => {
              deactivate(id);
            }}
          >
            Deactivate
          </Button>
          <Button
            type='submit'
            variant='info'
            onClick={() => {
              onClick(id);
            }}
          >
            Edit
          </Button>
          <Button
            type='submit'
            variant='outline-info'
            onClick={() => {
              showDetails(id);
            }}
          >
            View Details
          </Button>
        </div>
        <Details show={show} campaign={name} id={id} toggleDetailsModal={toggleDetailsModal} />
      </Card.Body>
    </Card>
  );
};

export default ActiveCard;
