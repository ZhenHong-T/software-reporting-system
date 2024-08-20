import React from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/auth.context";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in as: {user.email}</p>
      <p>Your role is: {user.role}</p>
      {/* TODO */}
    </Container>
  );
};

export default Dashboard;
