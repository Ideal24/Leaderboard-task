import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

// Floating My Account bar
function MyAccountBar({ user }) {
  if (!user) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "#fff9e0",
        borderRadius: 32,
        boxShadow: "0 3px 21px #ffeaa660",
        padding: "10px 33px 10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 13,
        border: "2px solid #eed877",
        minWidth: 225,
      }}
    >
      <img
        src={`https://i.pravatar.cc/100?u=${user.name}`}
        alt="me"
        width={38}
        height={38}
        style={{
          borderRadius: "50%",
          border: "2.5px solid #fde881",
          background: "#f4e2b7",
        }}
      />
      <div>
        <div style={{ fontWeight: 700, color: "#614d0e" }}>{user.name}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#dab53f",
            fontWeight: 600,
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/138/138292.png"
            alt="coin"
            width={15}
          />
          &nbsp;{user.totalPoints ?? 0}
        </div>
      </div>
    </div>
  );
}

// Podium Card component
function PodiumCard({ user, style }) {
  const avatar = user?.name
    ? `https://i.pravatar.cc/100?u=${user.name}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  return (
    <div
      style={{
        borderRadius: 18,
        background: "#fff9e2",
        textAlign: "center",
        padding: "0 12px 14px 12px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <img
        src={avatar}
        alt={user?.name}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          margin: "17px 0 8px 0",
          border: "3px solid #f4d668ff",
          objectFit: "cover",
          boxShadow: "0 1px 9px #ece5ba70",
        }}
      />
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          margin: "7px 0 5px 0",
          color: "#594214",
          maxWidth: 110,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {user?.name || "—"}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#b68940",
          fontWeight: 700,
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/138/138292.png"
          alt="coin"
          width={19}
        />
        <span style={{ marginLeft: 6 }}>{user?.totalPoints ?? 0}</span>
      </div>
    </div>
  );
}

// History Table for Claim Points
function HistoryTable({ history }) {
  return (
    <table
      border={1}
      cellPadding={6}
      style={{
        width: "100%",
        background: "#fff5df",
        fontSize: 14,
        borderCollapse: "collapse",
        margin: "7px 0 30px 0",
      }}
    >
      <thead>
        <tr style={{ background: "#fff7e3" }}>
          <th>Points</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {history.map((h, i) => (
          <tr key={i}>
            <td>{h.points}</td>
            <td>{new Date(h.claimedAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [myAccount] = useState({ name: "MyName", totalPoints: 99 });

  useEffect(() => {
    fetchLeaderboard();
    fetchUsers();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
      setLeaderboard(res.data || []);
    } catch (error) {
      setLeaderboard([]);
    }
  }

  async function fetchUsers() {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
      setUsers(res.data || []);
    } catch (error) {
      setUsers([]);
    }
  }

  async function fetchHistory(userId) {
    if (!userId) {
      setHistory([]);
      return;
    }
    try {
      const res = await axios.get(`${BACKEND_URL}/api/history`);
      setHistory(res.data.filter((h) => h.userId && h.userId._id === userId));
    } catch (error) {
      setHistory([]);
    }
  }

  async function addUser() {
    if (!newUserName) return;
    try {
      await axios.post(`${BACKEND_URL}/api/users`, { name: newUserName });
      setNewUserName("");
      setMessage("User added!");
      fetchLeaderboard();
      fetchUsers();
    } catch (error) {
      setMessage("Error adding user");
    }
  }

  async function claimPoints() {
    if (!selectedUser) return setMessage("Select a user first!");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/claim`, {
        userId: selectedUser,
      });
      setMessage(`Claimed ${res.data.points} points for user!`);
      fetchLeaderboard();
      fetchUsers();
      fetchHistory(selectedUser);
    } catch (error) {
      setMessage("Error claiming points");
    }
  }

  async function seedUsers() {
    try {
      await axios.post(`${BACKEND_URL}/api/seed`);
      fetchLeaderboard();
      fetchUsers();
      setMessage("Default users loaded!");
    } catch (error) {
      setMessage("Error seeding users");
    }
  }

  // THE IMPORTANT PART: Use leaderboard[0], [1], [2] safely
  const first = leaderboard[0] || { name: "—", totalPoints: 0 };
  const second = leaderboard[1] || { name: "—", totalPoints: 0 };
  const third = leaderboard[2] || { name: "—", totalPoints: 0 };
  const rest = leaderboard.slice(3);

  useEffect(() => {
    if (selectedUser) fetchHistory(selectedUser);
    else setHistory([]);
  }, [selectedUser]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff8ea 0%, #ffeaae 100%)",
        fontFamily: "Poppins, Arial, sans-serif",
        paddingTop: 20,
      }}
    >
      <MyAccountBar user={myAccount} />

      {/* Podium */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 32, // Increased gap for visibility
          margin: "64px auto 35px auto",
          maxWidth: 750,
          minHeight: 210,
          position: "relative",
        }}
      >
        {/* Second Place (Left) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://img.icons8.com/color/48/000000/crown--v2.png"
            alt="crown"
            style={{
              width: 42,
              marginBottom: -45,
              zIndex: 5,
              filter: "drop-shadow(0 2px 6px #d7eaffcc)",
            }}
          />
          <PodiumCard
            user={second}
            style={{
              minWidth: 108,
              height: 148,
              background: "#d5e8fdff",
              boxShadow: "0 2px 22px #bddaf7aa, 0 0 3px #fff",
              transform: "translateY(22px)",
            }}
          />
        </div>
        {/* First Place (Middle, Largest, Most Prominent) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://img.icons8.com/color/48/000000/crown.png"
            alt="crown"
            style={{
              width: 60,
              marginBottom: -13,
              zIndex: 5,
              filter: "drop-shadow(0 3px 10px gold)",
            }}
          />
          <PodiumCard
            user={first}
            style={{
              minWidth: 128,
              height: 184,
              background: "#fffce1",
              boxShadow:
                "0 0 0 6px #fff5cc, 0 0 55px 6px #ffe46b, 0 2px 30px #e1ad3f77",
              transform: "scale(1.13)",
              zIndex: 2,
            }}
          />
        </div>
        {/* Third Place (Right, Slightly Smaller) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://img.icons8.com/color/48/000000/crown--v1.png"
            alt="crown"
            style={{
              width: 39,
              marginBottom: -50,
              zIndex: 5,
              filter: "drop-shadow(0 1px 6px #ffd4c1)",
            }}
          />
          <PodiumCard
            user={third}
            style={{
              minWidth: 80,
              height: 145,
              background: "#fbccc5ff",
              boxShadow: "0 2px 18px #ffd6cd99, 0 0 3px #fff",
              transform: "translateY(29px)",
            }}
          />
        </div>
      </div>

      {/* Leaderboard List */}
      <div
        style={{
          background: "#fff",
          borderRadius: 13,
          overflow: "hidden",
          boxShadow: "0 7px 28px #eedeb820",
          maxWidth: 470,
          margin: "0 auto",
        }}
      >
        {rest.map((user, i) => (
          <div
            key={user._id || i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 18px",
              borderBottom: i < rest.length - 1 ? "1px solid #fff5d3" : "none",
              background: i % 2 === 0 ? "#fffefb" : "#fef8ea",
            }}
          >
            <div
              style={{
                width: 26,
                textAlign: "center",
                fontWeight: 600,
                fontSize: 18,
                color: "#b4a778",
              }}
            >
              {i + 4}
            </div>
            <img
              src={`https://i.pravatar.cc/100?u=${user?.name || ""}`}
              alt=""
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                margin: "0 14px",
                objectFit: "cover",
                border: "2px solid #e1dfcd",
                background: "#e9eae1",
              }}
            />
            <div
              style={{
                fontWeight: 600,
                color: "#4e3708",
                flex: 1,
                fontSize: 15,
                maxWidth: 130,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#e5be64",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/138/138292.png"
                alt="coin"
                width={19}
                style={{ marginRight: 4 }}
              />
              {user.totalPoints ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* --- Actions --- */}
      <div
        style={{
          maxWidth: 420,
          margin: "44px auto 0 auto",
          background: "#fffbe7",
          borderRadius: 13,
          padding: "20px 23px 18px 23px",
          boxShadow: "0 1px 12px #f9e5a947",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 17,
            color: "#a98721",
            marginBottom: 10,
          }}
        >
          Leaderboard Actions
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            style={{
              padding: "7px 13px",
              marginRight: 9,
              borderRadius: 8,
              border: "1px solid #e5cb7d",
              fontSize: 15,
            }}
            placeholder="Enter new user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <button
            onClick={addUser}
            style={{
              background: "#b48900",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add User
          </button>
        </div>
        <div style={{ margin: "20px 0 10px 0" }}>
          <select
            style={{
              padding: "7px 13px",
              marginRight: 9,
              borderRadius: 8,
              border: "1px solid #e5cb7d",
              fontSize: 15,
            }}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option value={u._id} key={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            onClick={claimPoints}
            style={{
              background: "#7fc973",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Claim Random Points
          </button>
        </div>
        <button
          onClick={seedUsers}
          style={{
            marginRight: 9,
            background: "#ffe29e",
            border: "1px solid #cfb977",
            color: "#c09e56",
            padding: "7px 19px",
            borderRadius: 8,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Seed Default Users
        </button>
        <span style={{ color: "green", fontWeight: 500, marginLeft: 10 }}>
          {message}
        </span>
      </div>

      {/* History Table for selected user */}
      {selectedUser && (
        <div style={{ maxWidth: 470, margin: "30px auto 40px auto" }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 17,
              color: "#a98721",
              marginBottom: 6,
            }}
          >
            Claim History of {users.find((u) => u._id === selectedUser)?.name}
          </div>
          <HistoryTable history={history} />
        </div>
      )}
    </div>
  );
}
