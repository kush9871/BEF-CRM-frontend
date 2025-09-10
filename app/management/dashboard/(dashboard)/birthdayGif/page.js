"use client"
import React, { useEffect, useState } from "react";

const BirthdayGif = ( birthday ) => {
  const [loading, setLoading] = useState(false);

  // Extract names from the birthdayUser array and join with commas
  const names = birthday?.birthdayUser?.map((user) => user.name).join(", ");

  return (
    <div style={styles.container}>
      <h1>🎉 Birthday Wishes 🎉</h1>

      {names && <h4>🎈 Happy Birthday <b>{names}</b> !</h4>}

      {loading && <p>Generating GIF...</p>}

        <div style={{ marginTop: "20px" }}>
          <img src="/images/birthdayGif.gif" alt="Birthday GIF" style={styles.image} />
        </div>

      {!names && <p>No birthdays today.</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  image: {
    maxWidth: "100%",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
};

export default BirthdayGif;
