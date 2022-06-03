import React from "react";
import styled from "styled-components";

// styled components do not impact the React components

const Testing = () => {
    return (
        <Container>
            <h3>Hello world</h3>
            <p>Hello people</p>
            <button>Click me</button>
        </Container>
    );
};

const Container = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    background: hsl(0, 0%, 83%);
    color: hsl(0, 0%, 22%);

    h3 {
        color: red;
    }
`;

export default Testing;
