//Making a front end to work with the MovieDist smart contract which has the functions
//to add movies, get movies, and get the number of movies in the contract
/*
    contains functions
    addMovie(bytes32 movieHash, string name, uint price) public
    buyMovie(bytes32 movieHash) public payable
    getMovieCount() public view returns (uint)
    getMovieDetails(uint index) public view returns (bytes32, string, uint, address)
*/
//using ganache to make payments, and using truffle
/* ganache : {
  host: "127.0.0.1",
  port : 7545,
  network_id : "5777"
},*/

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MovieDist from "./contracts/MovieDist.json";
import "./App.css";
import ConnectButton from "./components/ConnectButton";

//To make left pane of site to add movie and buy movie
//right pane of the site to show the transaction details
//Title bar saying Etheater

const App = () => {

  const [account, setAccount] = useState("");
  const [movieDist, setMovieDist] = useState(null);
  const [movieCount, setMovieCount] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [movieHash, setMovieHash] = useState("");
  const [movieName, setMovieName] = useState("");
  const [moviePrice, setMoviePrice] = useState("");

  // console.log(Ganache);
  const updateMovies = (movieHashes, movieNames, moviePrices, movieTheatres) => {
    const tempMovies = [];
    for (let i = 0; i < movieHashes.length; i++) {
      tempMovies.push({
        hash: Web3.utils.toAscii(movieHashes[i]).replace(/\u0000/g, ''),
        name: movieNames[i],
        price: moviePrices[i],
        theatre: movieTheatres[i]
      });
    }
    setMovies(tempMovies);
  }
  useEffect(() => {
    const init = async () => {
      try {
        // create Web3 instance using Ganache provider
        const ganacheProvider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        const web3Instance = new Web3(ganacheProvider);
        
        // const web3Instance = new Web3(Ganache.provider());
        // Get chain id of Ganache network
        const chainId = await web3Instance.eth.net.getId();
        console.log("chainId: ", chainId);
        // Get deployed MovieDist contract instance
        const deployedNetwork = MovieDist.networks[chainId]; // ?
        console.log("deployedNetwork: ", deployedNetwork); 
        const instance = new web3Instance.eth.Contract(
          MovieDist.abi,
          deployedNetwork && deployedNetwork.address,
        );
        console.log("instance: ", instance);
        // Set web3, accounts, and contract to the state
        setMovieDist(instance);
        // const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        // console.log("accounts: ", accounts);
        // setAccount(accounts[0]);
        const movieCount = await instance.methods.getMovieCount().call();
        setMovieCount(movieCount);
        // setMovies using data returned by calling getAllMovieDetails() function
        //     function getAllMovieDetails() public view returns (bytes32[], string[], uint[], address[])
        const allMovieDetails = await instance.methods.getAllMovieDetails().call();
        console.log("allMovieDetails: ", allMovieDetails);
        updateMovies(allMovieDetails[0], allMovieDetails[1], allMovieDetails[2], allMovieDetails[3]);


        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  const addMovie = async (hash, name, price) => {
    setLoading(true);
    try {
      // call addMovie function of MovieDist contract with addMovie function defined as  function addMovie(bytes32 movieHash, string name, uint price) 
      const movieHashBytes32 = Web3.utils.fromAscii(hash);
      const response = await movieDist.methods.addMovie(movieHashBytes32, name, price).send({ from: account, gas: 3000000 });
      console.log("Response: ", response);
    } catch (error) {
      console.log("Error while adding", hash, name, price);
      console.log(error);
    }
    window.location.reload();
  }

  const buyMovie = async (hash, value) => {
    setLoading(true);
    console.log("Buying movie with hash: ", hash, account, value);
    await movieDist.methods.buyMovie(hash).send({ from: account, value: value, gas: 3000000 });
    window.location.reload();
  }

  if (loading) {
    return <div id="loader" className="text-center mt-5"><p>Loading...</p></div>;
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <h1>ETHeater</h1>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <ConnectButton account={account} setAccount={setAccount}/>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h2>Add Movie</h2>
              <form onSubmit={(event) => {
                event.preventDefault();
                const hash = movieHash;
                const name = movieName;
                const price = Web3.utils.toWei(moviePrice, 'Ether');
                addMovie(hash, name, price);
              }
              }>
                <input type="text" className="form-control mb-1" placeholder="Movie Hash" onChange={(e) => {setMovieHash(e.target.value)}} />
                <input type="text" className="form-control mb-1" placeholder="Movie Name" onChange={(e) => {setMovieName(e.target.value)}} />
                <input type="text" className="form-control mb-1" placeholder="Movie Price" onChange={(e) => {setMoviePrice(e.target.value) }} />
                <input type='submit' className="btn btn-block btn-primary" value='Add Movie' />
              </form>
            </div>
          </main>
        </div>
        <hr />
        <table className="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th scope="col">Movie Hash</th>
              <th scope="col">Movie Name</th>
              <th scope="col">Movie Price</th>
              <th scope="col">Movie Owner</th>
              <th scope="col">Buy Movie</th>
            </tr>
          </thead>
          <tbody id="movieList">
            {movies.map((movie, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{movie.hash}</th>
                  <td>{movie.name}</td>
                  <td>{Web3.utils.fromWei(movie.price, 'Ether')} Eth</td>
                  <td>{movie.theatre !== '0x0000000000000000000000000000000000000000' ? movie.theatre : '-'}</td>
                  <td>
                    {movie.theatre === '0x0000000000000000000000000000000000000000' && movie.theatre !== account
                      ? <button
                        name={movie.hash}
                        value={movie.price}
                        onClick={(event) => {
                          const movieHash = Web3.utils.fromAscii(event.target.name).padEnd(32, '0');
                          console.log("movieHash: ", movieHash);
                          buyMovie(movieHash, event.target.value);
                        }}
                        className="btn btn-block btn-primary"
                      >
                        Buy
                      </button>
                      : null
                    }
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
