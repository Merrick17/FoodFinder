import React, { useState, useEffect } from 'react'
import axios from 'axios'
import markerIcon from '../src/assets/marker.svg'
import {
  Container,
  Header,
  Content,
  Sidebar,
  Footer,
  Navbar,
  Dropdown,
  Nav,
  Icon,
  Input,
  InputGroup,
  Button,
} from 'rsuite'
import 'rsuite/dist/styles/rsuite-default.css'
import MapGL, { Marker } from '@urbica/react-map-gl'
import { MapboxLayer } from '@deck.gl/mapbox'
import { ScatterplotLayer } from '@deck.gl/layers'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
const App = () => {
  const [restos, setRestos] = useState([])
  const [viewport, setViewport] = useState({
    latitude: 37.78,
    longitude: -122.41,
    zoom: 11,
  })
  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
    visible: false,
    title: '',
  })
  const style = {
    padding: '10px',
    color: '#0000',
    cursor: 'pointer',
    //background: '#1978c8',
    borderRadius: '6px',
  }
  const [search, setSearch] = useState('')
  const getLocations = async (query) => {
    const result = await axios.get(
      `https://developers.zomato.com/api/v2.1/locations?query=${query}`,
      { headers: { 'user-key': '721d935701c3e7feace43a43331e3049' } },
    )
    console.log(result.data.location_suggestions)
    setRestos(result.data.location_suggestions)
  }
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewport({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 11,
        })
      })
    }
  }, [])
  return (
    <Container>
      <Header>
        <Navbar appearance="inverse">
          <Navbar.Header>
            {/* <a style={{alignSelf:'center',marginLeft:'10px',alignContent:'center',textAlign:'center',marginTop:'30px'}}>Food Finder</a> */}
          </Navbar.Header>
          {/* <Navbar.Body>
            <Nav>
              <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
              <Nav.Item>News</Nav.Item>
              <Nav.Item>Products</Nav.Item>
              <Dropdown title="About">
                <Dropdown.Item>Company</Dropdown.Item>
                <Dropdown.Item>Team</Dropdown.Item>
                <Dropdown.Item>Contact</Dropdown.Item>
              </Dropdown>
            </Nav>
            <Nav pullRight>
              <Nav.Item icon={<Icon icon="cog" />}>Settings</Nav.Item>
            </Nav>
          </Navbar.Body> */}
        </Navbar>
      </Header>
      <Container>
        <Sidebar>
          <InputGroup
            inside
            style={{ marginTop: '5%', width: '95%', marginLeft: '2%' }}
          >
            <Input
              placeholder={'Rechercher'}
              onChange={(text) => {
                setSearch(text)
                getLocations(search)
              }}
              value={search}
            />
            <InputGroup.Button>
              <Icon icon="search" />
            </InputGroup.Button>
          </InputGroup>
          <div
            style={{
              width: '90%',
              alignItems: 'center',
              marginLeft: '3%',
              marginTop: '5%',
            }}
          >
            {restos.map((elm) => (
              <Button
                appearance="primary"
                key={elm.entity_id}
                block
                onClick={() => {
                  setMarker({
                    latitude: elm.latitude,
                    longitude: elm.longitude,
                    visible: true,
                    title: elm.title,
                  })
                  setViewport({
                    latitude: elm.latitude,
                    longitude: elm.longitude,
                    zoom: 11,
                  })
                }}
              >
                {elm.title}
              </Button>
            ))}
          </div>
        </Sidebar>
        <Content>
          <MapGL
            style={{ width: '100%', height: '100vh' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            accessToken={
              'pk.eyJ1IjoibWVycmljazE3IiwiYSI6ImNqdjg1d243YjBlbms0NW50M3ZvaGlhbG8ifQ.JvWxv9X81IW7k64zGXEY2Q'
            }
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
          >
            {marker.visible ? (
              <Marker longitude={marker.longitude} latitude={marker.latitude}>
                <div style={style}>
                  <img src={markerIcon} />
                  <p style={{margin:'5%'}}> {marker.title}</p>
                </div>
              </Marker>
            ) : (
              <div></div>
            )}
          </MapGL>
        </Content>
      </Container>
    </Container>
  )
}

export default App
