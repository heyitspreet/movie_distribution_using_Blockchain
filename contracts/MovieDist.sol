//Smart contract for a producer to distribute a movie to a theater
//Information about the movie is stored in the blockchain and the producer can distribute the movie to a theater
// Producer can store details like the movie name and price in the blockchain (MovieHash, MovieName, Price) 
// Theater can buy the movie (MovieHash) and the producer can send the movie to the theater (MovieHash, TheaterAddress)
// The producer can also withdraw the money from the contract (MovieHash, Amount)

pragma solidity ^0.4.0;

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

    function getMovieList() public view returns (bytes32[]) {
        bytes32[] memory movieList = new bytes32[](movieCount);
        for (uint i = 0; i < movieCount; i++) {
            movieList[i] = movieList[i];
        }
        return movieList;
    }
}

//     mapping (bytes32 => Movie) public movies;
//     mapping (address => uint) public balances;
    
//     function addMovie(bytes32 movieHash, string name, uint price) public {
//         require(!movies[movieHash].isValue);
//         movies[movieHash] = Movie(name, price, 0, true);
//     }
    
//     function buyMovie(bytes32 movieHash) public payable {
//         require(movies[movieHash].isValue);
//         require(msg.value == movies[movieHash].price);
//         movies[movieHash].theater = msg.sender;
//         balances[msg.sender] += msg.value;
//     }
    
//     function sendMovie(bytes32 movieHash, address theater) public {
//         require(movies[movieHash].isValue);
//         require(movies[movieHash].theater == theater);
//         balances[theater] += movies[movieHash].price;
//         movies[movieHash].theater = 0;
//     }
    
//     function withdraw(uint amount) public {
//         require(balances[msg.sender] >= amount);
//         balances[msg.sender] -= amount;
//         msg.sender.transfer(amount);
//     }
// }

//The MovieDist.sol file contains the smart contract for a producer to distribute a movie to a theater. The producer can store details like the movie name and price in the blockchain (MovieHash, MovieName, Price). The theater can buy the movie (MovieHash) and the producer can send the movie to the theater (MovieHash, TheaterAddress). The producer can also withdraw the money from the contract (MovieHash, Amount).
