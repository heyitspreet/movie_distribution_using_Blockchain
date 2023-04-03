//Code to deoply the contract
const Movie = artifacts.require("C:\\PreetMain\\Learning\\VIT\\Sem6\\Blockchain\\Test2\\movie_dist\\contracts\\MovieDist.sol");

module.exports = function(deployer) {
    deployer.deploy(Movie);
}
