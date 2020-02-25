import React from 'react';
import Details from './Details';
import { Card, Button } from 'react-bootstrap';

const InactiveCard = ({
  name,
  id,
  show,
  onClick,
  showDetails,
  toggleDetailsModal
}) => {
  return (
    <Card
      className="dashboardCard"
      style={{ width: '25rem', backgroundColor: '#CACACA' }}
    >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="inactiveCard">Inactive</Card.Subtitle>
        <div className="buttons">
          <Button
            type="submit"
            variant="outline-info"
            onClick={() => {
              showDetails(id);
            }}
          >
            View Details
          </Button>
        </div>
        <Details
          show={show}
          campaign={name}
          id={id}
          toggleDetailsModal={toggleDetailsModal}
        />
      </Card.Body>
    </Card>
  );
};

export default InactiveCard;
