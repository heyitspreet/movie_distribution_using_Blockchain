//Making a front end to work with the MovieDist smart contract which has the functions
//to add movies, get movies, and get the number of movies in the contract
/*
    contains functions
    addMovie(bytes32 movieHash, string name, uint price) public
    buyMovie(bytes32 movieHash) public payable
    sendMovie(bytes32 movieHash, address theater) public
    withdraw(uint amount) public
    getMovieCount() public view returns (uint)
    getMovieDetails(uint index) public view returns (bytes32, string, uint, address)
*/
//To make left pane to add movie and buy movie
//right pane to show the transaction details
import React, {useState, useEffect} from "react";
import Web3 from "web3";
import MovieDist from "./contracts/MovieDist.json";

const App = () => {
    const [account, setAccount] = useState("");
    const [movieDist, setMovieDist] = useState(null);
    const [movieCount, setMovieCount] = useState(0);
    const [movieHash, setMovieHash] = useState("");
    const [movieName, setMovieName] = useState("");
    const [moviePrice, setMoviePrice] = useState(0);
    const [movies, setMovies] = useState([]);
    const [buyMovieHash, setBuyMovieHash] = useState("");
    const [buyMoviePrice, setBuyMoviePrice] = useState(0);
    const [buyMovieTheater, setBuyMovieTheater] = useState("");
    const [buyMovieBuyer, setBuyMovieBuyer] = useState("");
    const [buyMovieAmount, setBuyMovieAmount] = useState(0);
    const [sendMovieHash, setSendMovieHash] = useState("");
    const [sendMovieTheater, setSendMovieTheater] = useState("");
    const [sendMovieSender, setSendMovieSender] = useState("");
    const [sendMovieAmount, setSendMovieAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawSender, setWithdrawSender] = useState("");
    const [withdrawAmountSent, setWithdrawAmountSent] = useState(0);

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const loadWeb3 = async () => {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    }

    const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();
        const networkData = MovieDist.networks[networkId];
        if(networkData) {
            const movieDist = new web3.eth.Contract(MovieDist.abi, networkData.address);
            setMovieDist(movieDist);
            const movieCount = await movieDist.methods.getMovieCount().call();
            setMovieCount(movieCount);
            for(var i = 0; i < movieCount; i++) {
                const movie = await movieDist.methods.getMovieDetails(i).call();
                setMovies(movies => [...movies, movie]);
            }
        }
        else {
            window.alert("MovieDist contract not deployed to detected network.");
        }
    }

    const addMovie = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await movieDist.methods.addMovie(movieHash, movieName, moviePrice).send({from: accounts[0]});
    }

    const buyMovie = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await movieDist.methods.buyMovie(buyMovieHash).send({from: accounts[0], value: buyMoviePrice});
    }

    const sendMovie = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await movieDist.methods.sendMovie(sendMovieHash, sendMovieTheater).send({from: accounts[0]});
    }

    const withdraw = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        await movieDist.methods.withdraw(withdrawAmount).send({from: accounts[0]});
    }

    return (
        <div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Add Movie</h1>
                            <form onSubmit={addMovie}>
                                <input type="text" className="form-control mb-1" placeholder="Movie Hash" value={movieHash} onChange={event => setMovieHash(event.target.value)} required />
                                <input type="text" className="form-control mb-1" placeholder="Movie Name" value={movieName} onChange={event => setMovieName(event.target.value)} required />
                                <input type="number" className="form-control mb-1" placeholder="Movie Price" value={moviePrice} onChange={event => setMoviePrice(event.target.value)} required />
                                <input type="submit" className="btn btn-block btn-primary" value="Add Movie" />
                            </form>
                        </div>
                    </main>
                </div>
                <p>&nbsp;</p>
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Buy Movie</h1>
                            <form onSubmit={buyMovie}>
                                <input type="text" className="form-control mb-1" placeholder="Movie Hash" value={buyMovieHash} onChange={event => setBuyMovieHash(event.target.value)} required />
                              </form>
                        </div>
                    </main>
                </div>
                <p>&nbsp;</p>
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Send Movie</h1>
                            <form onSubmit={sendMovie}>
                                <input type="text" className="form-control mb-1" placeholder="Movie Hash" value={sendMovieHash} onChange={event => setSendMovieHash(event.target.value)} required />
                                <input type="text" className="form-control mb-1" placeholder="Theater Address" value={sendMovieTheater} onChange={event => setSendMovieTheater(event.target.value)} required />
                                <input type="submit" className="btn btn-block btn-primary" value="Send Movie" />
                            </form>
                        </div>
                    </main>
                </div>
                <p>&nbsp;</p>
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Withdraw</h1>
                            <form onSubmit={withdraw}>
                                <input type="number" className="form-control mb-1" placeholder="Amount" value={withdrawAmount} onChange={event => setWithdrawAmount(event.target.value)} required />
                                <input type="submit" className="btn btn-block btn-primary" value="Withdraw" />
                            </form>
                        </div>
                    </main>
                </div>
                <p>&nbsp;</p>
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <h1>Movie List</h1>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Movie Hash</th>
                                        <th scope="col">Movie Name</th>
                                        <th scope="col">Movie Price</th>
                                        <th scope="col">Movie Owner</th>
                                        <th scope="col">Movie Theater</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map((movie, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{movie[0]}</td>
                                                <td>{movie[1]}</td>
                                                <td>{movie[2]}</td>
                                                <td>{movie[3]}</td>
                                                <td>{movie[4]}</td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
