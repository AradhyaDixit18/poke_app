import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme, CssBaseline, Container, TextField, Grid, Card, CardMedia, CardContent, Typography, Switch } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonData = await Promise.all(
          response.data.results.map(async (poke) => {
            const pokeDetails = await axios.get(poke.url);
            return { ...poke, image: pokeDetails.data.sprites.front_default };
          })
        );
        setPokemon(pokemonData);
      } catch (error) {
        console.error('Error fetching Pokémon data', error);
      }
    };
    fetchPokemon();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredPokemon = pokemon.filter((poke) => poke.name.includes(search));

  return (
    <ThemeProvider theme={darkMode ? darkTheme : createTheme()}>
      <CssBaseline />
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Pokémon Search
        </Typography>
        <TextField
          label="Search Pokémon"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleSearchChange}
        />
        <Grid container justifyContent="flex-end">
          <Typography>Dark Mode</Typography>
          <Switch checked={darkMode} onChange={handleToggleDarkMode} />
        </Grid>
        <Grid container spacing={2}>
          {filteredPokemon.map((poke) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={poke.name}>
              <Card>
                <CardMedia component="img" image={poke.image} alt={poke.name} />
                <CardContent>
                  <Typography variant="h5">{poke.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
