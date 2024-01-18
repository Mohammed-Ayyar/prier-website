// import { useState } from 'react'
import './App.css'
import Button from '@mui/material/Button';
import MainContent from './components/MainContent';
import Container from '@mui/material/Container';



function TextButtons() {

  return (
    <>
      <div 
      style={{display: "flex", justifyContent: "center", width :"100vw"
    }}
  >

      <Container maxWidth="xl">
        <MainContent />
      </Container>
      </div>
    </>
  );
}

export default TextButtons
