//SPF-License-Identifier: UNLICENSED
//Smart contract for a producer to distribute a movie to a theater
//Information about the movie is stored in the blockchain and the producer can distribute the movie to a theater
// Producer can store details like the movie name and price in the blockchain (MovieHash, MovieName, Price) 
// Theater can buy the movie (MovieHash) and the producer can send the movie to the theater (MovieHash, TheaterAddress)
// The producer can also withdraw the money from the contract (MovieHash, Amount)

pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

contract MovieDist {
    struct Movie {
        string name;
        uint price;
        address theater;
        bool isValue;
    }

    //counter to keep track of the number of movies in the mapping
    uint public movieCount = 0;

    //mapping to store the movies
    mapping (bytes32 => Movie) public movies;

    //mapping to store the balances of the theaters
    mapping (address => uint) public balances;

    mapping(uint => bytes32) public movieList;
    //function to add a movie to the mapping
    function addMovie(bytes32 movieHash, string name, uint price) public {
        require(!movies[movieHash].isValue);
        movies[movieHash] = Movie(name, price, 0, true);
        movieList[movieCount] = movieHash;
        movieCount++;
    }

    //function to buy a movie
    function buyMovie(bytes32 movieHash) public payable {
        require(movies[movieHash].isValue);
        require(movies[movieHash].theater == 0);
        require(msg.value == movies[movieHash].price);
        movies[movieHash].theater = msg.sender;
        balances[msg.sender] += msg.value;
    }

    //function to send a movie to a theater
    function sendMovie(bytes32 movieHash, address theater) public {
        require(movies[movieHash].isValue);
        require(movies[movieHash].theater == theater);
        balances[theater] += movies[movieHash].price;
        movies[movieHash].theater = 0;
    }

    //function to withdraw the money from the contract
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }

    function getMovieCount() public view returns (uint) {
        return movieCount;
    }

    //Get movie details function to get the details of a movie (finds all the movie hashes from movieList and returns the details of the movie)
    function getMovieDetails(uint index) public view returns (bytes32, string, uint, address) {
        bytes32 movieHash = movieList[index];
        return (movieHash, movies[movieHash].name, movies[movieHash].price, movies[movieHash].theater);
    }
    function getAllMovieDetails() public view returns (bytes32[], string[], uint[], address[]) {
        bytes32[] memory movieHashes = new bytes32[](movieCount);
        string[] memory movieNames = new string[](movieCount);
        uint[] memory moviePrices = new uint[](movieCount);
        address[] memory movieTheaters = new address[](movieCount);
        for (uint i = 0; i < movieCount; i++) {
            bytes32 movieHash = movieList[i];
            movieHashes[i] = movieHash;
            movieNames[i] = movies[movieHash].name;
            moviePrices[i] = movies[movieHash].price;
            movieTheaters[i] = movies[movieHash].theater;
        }
        return (movieHashes, movieNames, moviePrices, movieTheaters);
    }
}


/*
 Functions implemented:
    addMovie(bytes32 movieHash, string name, uint price) public
    buyMovie(bytes32 movieHash) public payable
    sendMovie(bytes32 movieHash, address theater) public
    withdraw(uint amount) public
    getMovieCount() public view returns (uint)
    getMovieDetails(uint index) public view returns (bytes32, string, uint, address)
*/