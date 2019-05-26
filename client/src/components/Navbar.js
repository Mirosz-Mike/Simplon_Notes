import React from "react";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    height: "40px"
  },
  link: {
    textDecoration: "none",
    color: "white"
  },
  button: {
    color: "white",
    border: "none",
    cursor: "pointer",
    backgroundColor: "black",
    fontSize: 15,
    textDecoration: "none",
    outline: "none"
  },
  white: {
    color: "white"
  }
};

const getName = localStorage.getItem("name");
const getJwt = localStorage.getItem("token");

const Navbar = () => {
  return (
    <div style={styles.navbar}>
      <a href="/" style={styles.link}>
        Accueil
      </a>
      {!!getName ? (
        <h4 style={styles.white}>{`Bienvenue ${getName}`}</h4>
      ) : (
        <a href="/register" style={styles.link}>
          Inscription
        </a>
      )}
      {!!getJwt ? (
        <button style={styles.button}>Deconnexion</button>
      ) : (
        <a href="/login" style={styles.link}>
          Connexion
        </a>
      )}
    </div>
  );
};

export default Navbar;
