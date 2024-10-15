import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled component for the entire unauthorized page container
const UnauthorizedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

// Styled component for the headline
const Headline = styled.h1`
  font-size: 4rem;
  color: #333;
`;

// Styled component for the message
const Message = styled.p`
  font-size: 1.5rem;
  color: #666;
`;

// Styled component for the button
const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

// Unauthorized Page component
const UnauthorizedPage = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    nav('/');
  };

  return (
    <UnauthorizedContainer>
      <Headline>Unauthorized</Headline>
      <Message>Sorry, you are not authorized to access this page.</Message>
      <Button onClick={handleLogout}>Logout</Button>
    </UnauthorizedContainer>
  );
};

export default UnauthorizedPage;
