//Code to deoply the contract
const Movie = artifacts.require("../contracts/MovieDist.sol");

module.exports = function(deployer) {
    deployer.deploy(Movie);
}
