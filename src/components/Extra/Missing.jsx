import React from 'react';
import styled from 'styled-components';

// Styled component for the entire 404 page container
const ErrorPageContainer = styled.div`
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
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// 404 Error Page component
const Missing = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <ErrorPageContainer>
      <Headline>404</Headline>
      <Message>Oops! Page not found.</Message>
      <Button onClick={handleRefresh}>Refresh</Button>
    </ErrorPageContainer>
  );
};

export default Missing;
