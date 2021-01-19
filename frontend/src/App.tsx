import React, { FormEvent, useState } from 'react';
import { Container, Header, Content, Button, Form, FormGroup, ControlLabel, FormControl, SelectPicker, Modal, ButtonToolbar, FlexboxGrid } from 'rsuite';
import 'rsuite/dist/styles/rsuite-dark.css';
import axios from 'axios';

interface Player {
  id: number,
  name: string,
  score: string,
  isFocused: boolean,
  tempScore: string
}

interface Word {
  name: string,
  definition?: string,
  exists: boolean
}

function App() {
  const [newGame, setNewGame] = useState<boolean>(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Word>();

  const data = [
    {
      'label': 'Two',
      'value': '2'
    },
    {
      'label': 'Three',
      'value': '3'
    },
    {
      'label': 'Four',
      'value': '4'
    }
  ];

  const setUpGame = (value: number): void => {
    const newPlayers: Player[] = [];

    for (let i = 0; i < value; i++) {
      const player: Player =  {
        id: Math.floor(Math.random() * 100),
        name: `Player ${i + 1}`,
        score: '0',
        isFocused: false,
        tempScore: '0'
      }

      newPlayers.push(player);
    }

    setPlayers(newPlayers);
    setNewGame(false);
  };

  const handleFocus = (player: Player): void => {
    const updatedPlayer: Player = Object.create(player);
    updatedPlayer.isFocused = true;

    setPlayers(
      players.map(p => (
        p.id === player.id ? updatedPlayer : p
      ))
    )
  };

  const handleChange = (value: string, player: Player): void => {
    const updatedPlayer: Player = Object.create(player);

    if (/^-?\d*?$/.test(value)) {
      updatedPlayer.tempScore = value;
    }

    setPlayers(
      players.map(p => (
        p.id === player.id ? updatedPlayer : p
      ))
    )
  };

  const handleBlur = (player: Player): void => {
    const { score, tempScore } = player;
    const updatedPlayer: Player = Object.create(player);
    updatedPlayer.score = (parseInt(score) + parseInt(tempScore)).toString();
    updatedPlayer.tempScore = '0';
    updatedPlayer.isFocused = false;

    setPlayers(
      players.map(p => (
        p.id === player.id ? updatedPlayer : p
      ))
    )
  };

  const searchWord = (event: FormEvent): void => {
    event.preventDefault();
    setIsSearching(true);

    axios.get(`http://localhost:8080?word=${searchValue}`)
      .then(res => {
        setSearchResult(res.data);
      })

    setSearchValue('');
    setIsSearching(false);
  };

  const playerHtml = players.map(player => {
    const { name, score, tempScore, isFocused } = player;
   return (
    <FlexboxGrid
      justify="space-around"
      style={{
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <FlexboxGrid.Item colspan={5}>
        <FormGroup>
          <ControlLabel>Player</ControlLabel>
          <FormControl readOnly value={player.name} />
        </FormGroup>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <FormGroup>
          <ControlLabel>Score</ControlLabel>
          <FormControl
            name={name}
            value={isFocused ? tempScore !== '0' ? tempScore : '' : score}
            onFocus={() => handleFocus(player)}
            onChange={value => handleChange(value, player)}
            onBlur={() => handleBlur(player)}
          />
        </FormGroup>
      </FlexboxGrid.Item>
    </FlexboxGrid>
   );
  })

  return (
    <div className="App">
      <Container>
        <Header style={{textAlign: "center"}}>
          <h1>Scrabble</h1>
        </Header>
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={16}>
              {newGame ?
                <Form layout="horizontal" autocomplete="off">
                  <FormGroup>
                    <ControlLabel>How Many Players</ControlLabel>
                    <SelectPicker
                      data={data}
                      searchable={false}
                      style={{ width: 500 }}
                      onChange={setUpGame}
                    />
                  </FormGroup>
                </Form> :
                <>
                  <Modal style={{ textAlign: "center" }} show={showModal} onHide={() => {setShowModal(false); setSearchResult(undefined)}}>
                    <Modal.Header>
                      <Modal.Title>Scrabble Dictionary Look Up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form autocomplete="off" onSubmit={(x, event) => searchWord(event)}>
                        <FormGroup>
                          <ControlLabel>Please type in a word</ControlLabel>
                          <FormControl
                            name="search"
                            value={searchValue}
                            onChange={value => setSearchValue(value)}
                          />
                        </FormGroup>
                        {
                          searchResult &&
                          <div style={{ paddingBottom: 25 }}>
                            <h3>
                              {searchResult.name}
                              <span 
                                style={searchResult.exists
                                  ? {color: "green"}
                                  : {color: "red"}
                                }
                              >
                              {searchResult.exists ? ' is ' : ' is not '}
                              </span>
                              a valid Scabble word
                            </h3>
                            {
                              searchResult.definition &&
                              <p>Definition: {searchResult.definition}</p>
                            }
                          </div>
                        }
                        <FormGroup>
                          <ButtonToolbar>
                            <Button
                              appearance="primary"
                              type="submit"
                              loading={isSearching}
                            >
                              Submit
                            </Button>
                            <Button 
                              appearance="subtle"
                              color="red"
                              type="button"
                              loading={isSearching}
                              onClick={() => {setShowModal(false); setSearchResult(undefined)}}
                            >
                              Cancel
                            </Button>
                          </ButtonToolbar>
                        </FormGroup>
                      </Form> 
                    </Modal.Body>
                  </Modal>

                  <Form autocomplete="off" layout="horizontal">
                    <Button
                      block
                      color="cyan"
                      appearance="ghost"
                      onClick={() => setShowModal(true)}
                    >
                      Look Up Word
                    </Button>
                    {playerHtml}
                    <Button
                      color="red"
                      appearance="ghost"
                      onClick={() => setNewGame(true)}
                    >
                      New Game
                    </Button>
                  </Form>
                </>
              }
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </div>
  );
}

export default App;
