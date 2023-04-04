import { useEffect, useState } from "react";

export const ConnectButton = ({ account, setAccount }) => {
    // if account is undefined or empty, render a dropdown for user to select account from metamask
    // if account already selected, render selected account along with disconnect button
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    if(window.ethereum && (accounts === undefined || accounts.length === 0)) {
        window.ethereum.request({
            method: "eth_requestAccounts",
        }).then((accounts) => {
            setAccounts(accounts);
            if(accounts.length > 0) {
                setAccount(accounts[0]);
            }
            setLoading(false);
        }).catch((err) => {
            setError(true);
            setLoading(false);
        });
    }
    const handleAccountChange = (accounts) => {
        setAccounts(accounts);
    }
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountChange);
        }
        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener("accountsChanged", handleAccountChange);
            }
        }
    }, []);
    
    return (
        <div className="connect-button">
            {account !== undefined && account.length > 0 ? (
                <div className="account">
                    <p>{account}</p>
                    <button
                        onClick={() => {
                            setAccount("");
                        }
                    }>
                        Disconnect
                    </button>
                </div>
            ) : (
                <div className="dropdown">
                    <select
                        onChange={(e) => {
                            console.log("e.target.value: ", e.target.value);
                            setAccount(e.target.value);
                        }}
                    >
                        {accounts.map((account) => (
                            <option key={account} value={account}>
                                {account}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
