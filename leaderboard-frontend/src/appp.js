// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BACKEND_URL = "http://localhost:5000";

// function App() {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [newUserName, setNewUserName] = useState("");
//   const [message, setMessage] = useState("");
//   const [history, setHistory] = useState([]);

//   // Load the leaderboard and all users on start or refresh
//   useEffect(() => {
//     fetchLeaderboard();
//     fetchUsers();
//     fetchHistory();
//   }, []);

//   const fetchLeaderboard = async () => {
//     const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
//     setLeaderboard(res.data);
//   };

//   const fetchUsers = async () => {
//     const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
//     setUsers(res.data);
//   };

//   const fetchHistory = async () => {
//     const res = await axios.get(`${BACKEND_URL}/api/history`);
//     setHistory(res.data);
//   };

//   // Add a new user
//   const addUser = async () => {
//     if (!newUserName) return;
//     await axios.post(`${BACKEND_URL}/api/users`, { name: newUserName });
//     setNewUserName("");
//     setMessage("User added!");
//     fetchLeaderboard();
//     fetchUsers();
//   };

//   // Claim points for selected user
//   const claimPoints = async () => {
//     if (!selectedUser) return setMessage("Select a user first!");
//     const res = await axios.post(`${BACKEND_URL}/api/claim`, { userId: selectedUser });
//     setMessage(`Claimed ${res.data.points} points for user!`);
//     fetchLeaderboard();
//     fetchUsers();
//     fetchHistory();
//   };

//   // If you want to seed users from frontend (optional button)
//   const seedUsers = async () => {
//     await axios.post(`${BACKEND_URL}/api/seed`);
//     fetchLeaderboard();
//     fetchUsers();
//     setMessage("Default users loaded!");
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "30px auto" }}>
//       <h2>Leaderboard</h2>
//       <LeaderboardTable leaderboard={leaderboard} />

//       <h3 style={{ marginTop: 30 }}>Add New User</h3>
//       <input
//         placeholder="Name"
//         value={newUserName}
//         onChange={e => setNewUserName(e.target.value)}
//       />
//       <button onClick={addUser}>Add</button>

//       <h3 style={{ marginTop: 30 }}>Claim Points</h3>
//       <select
//         value={selectedUser}
//         onChange={e => setSelectedUser(e.target.value)}
//       >
//         <option value="">Select User</option>
//         {users.map(u => (
//           <option value={u._id} key={u._id}>
//             {u.name}
//           </option>
//         ))}
//       </select>
//       <button onClick={claimPoints}>Claim Random Points</button>
//       <button onClick={seedUsers} style={{ marginLeft: 10 }}>Seed Default Users</button>
//       <p style={{ color: "green" }}>{message}</p>

//       <h3 style={{ marginTop: 30 }}>Claim History</h3>
//       <HistoryTable history={history} />
//     </div>
//   );
// }

// function LeaderboardTable({ leaderboard }) {
//   return (
//     <table border="1" cellPadding={8}>
//       <thead>
//         <tr>
//           <th>Rank</th>
//           <th>Name</th>
//           <th>Points</th>
//         </tr>
//       </thead>
//       <tbody>
//         {leaderboard.map(u => (
//           <tr key={u._id}>
//             <td>{u.rank}</td>
//             <td>{u.name}</td>
//             <td>{u.totalPoints}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// function HistoryTable({ history }) {
//   return (
//     <table border="1" cellPadding={6}>
//       <thead>
//         <tr>
//           <th>User</th>
//           <th>Points</th>
//           <th>When</th>
//         </tr>
//       </thead>
//       <tbody>
//         {history.map((h, i) => (
//           <tr key={i}>
//             <td>{h.userId?.name || "?"}</td>
//             <td>{h.points}</td>
//             <td>{new Date(h.claimedAt).toLocaleString()}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default App;



// model 2
import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

// Floating "My Account" bar - place at top of page
function MyAccountBar({ user }) {
  if (!user) return null;
  return (
    <div style={{
      position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
      zIndex: 20, background: "#fff9e0", borderRadius: 32, boxShadow: "0 3px 21px #ffeaa660",
      padding: "10px 33px 10px 18px", display: "flex", alignItems: "center", gap: 13,
      border: "2px solid #eed877"
    }}>
      <img src={`https://i.pravatar.cc/100?u=${user.name}`} alt="me"
           width={38} height={38}
           style={{ borderRadius: "50%", border: "2.5px solid #fde881", background: "#f4e2b7" }} />
      <div>
        <div style={{ fontWeight: 700, color: "#614d0e" }}>{user.name}</div>
        <div style={{ display: "flex", alignItems: "center", color: "#dab53f", fontWeight: 600 }}>
          <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" alt="coin" width={15} />&nbsp;{user.totalPoints ?? 0}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------

export default function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [myAccount] = useState({ name: "MyName", totalPoints: 99 }); // Set to logged-in user

  useEffect(() => {
    fetchLeaderboard();
    fetchUsers();
    // Don't fetch history here, only when user selected.
  }, []);

  async function fetchLeaderboard() {
    const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
    setLeaderboard(res.data || []);
  }
  async function fetchUsers() {
    const res = await axios.get(`${BACKEND_URL}/api/leaderboard`);
    setUsers(res.data || []);
  }
  async function fetchHistory(userId) {
    if (!userId) {
      setHistory([]);
      return;
    }
    const res = await axios.get(`${BACKEND_URL}/api/history`);
    const selected = res.data.filter(h => h.userId && h.userId._id === userId);
    setHistory(selected);
  }

  async function addUser() {
    if (!newUserName) return;
    await axios.post(`${BACKEND_URL}/api/users`, { name: newUserName });
    setNewUserName("");
    setMessage("User added!");
    fetchLeaderboard();
    fetchUsers();
  }

  async function claimPoints() {
    if (!selectedUser) return setMessage("Select a user first!");
    const res = await axios.post(`${BACKEND_URL}/api/claim`, { userId: selectedUser });
    setMessage(`Claimed ${res.data.points} points for user!`);
    fetchLeaderboard();
    fetchUsers();
    fetchHistory(selectedUser);
  }

  async function seedUsers() {
    await axios.post(`${BACKEND_URL}/api/seed`);
    fetchLeaderboard();
    fetchUsers();
    setMessage("Default users loaded!");
  }

  // Podium ordering: highest is center, 2nd left, 3rd right
  let topThree = leaderboard.slice(0, 3);
  let podiumOrder = [topThree[1], topThree[0], topThree[2]]; // 2nd, 1st, 3rd ranks by their array position

  // The rest
  let rest = leaderboard.slice(3);

  // Avatars
  const getAvatar = user => user?.avatar || `https://i.pravatar.cc/100?u=${user?.name}`;

  // When selectedUser changes, fetch their history
  useEffect(() => {
    if (selectedUser) fetchHistory(selectedUser);
    else setHistory([]);
  }, [selectedUser]);

  // ======== UI ========
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fff8ea 0%, #ffeaae 100%)",
      fontFamily: "Poppins, Arial, sans-serif",
      paddingTop: 62 // Space for MyAccount top bar
    }}>
      {/* Floating "My Account" */}
      <MyAccountBar user={myAccount} />

      {/* Podium */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        background: "rgba(253,231,145,0.19)",
        borderRadius: 28,
        padding: "60px 12px 36px 12px",
        margin: "20px auto 35px auto",
        maxWidth: 470,
        gap: 12,
        position: "relative"
      }}>
        {/* 2nd (left) */}
        <PodiumCard
          rank={2}
          user={podiumOrder[0]}
          avatar={getAvatar(podiumOrder[0])}
          style={{
            minWidth: 115,
            height: 135,
            transform: "translateY(23px)",
            transition: "all 0.4s cubic-bezier(.71,1.4,.75,.99)"
          }}
        />
        {/* 1st (center, highest) */}
        <PodiumCard
          rank={1}
          user={podiumOrder[1]}
          avatar={getAvatar(podiumOrder[1])}
          style={{
            minWidth: 135,
            height: 168,
            margin: "0 -8px",
            zIndex: 2,
            boxShadow: "0 6px 36px #eedeb820",
            transform: "scale(1.10)",
            transition: "all 0.4s cubic-bezier(.71,1.4,.75,.99)"
          }}
        />
        {/* 3rd (right) */}
        <PodiumCard
          rank={3}
          user={podiumOrder[2]}
          avatar={getAvatar(podiumOrder[2])}
          style={{
            minWidth: 112,
            height: 125,
            transform: "translateY(32px)",
            transition: "all 0.4s cubic-bezier(.71,1.4,.75,.99)"
          }}
        />
      </div>

      {/* Below podium list */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        overflow: "hidden",
        boxShadow: "0 7px 28px #eedeb820",
        maxWidth: 470, margin: "0 auto"
      }}>
        {rest.map((user, i) => (
          <div key={user._id}
            style={{
              display: "flex", alignItems: "center",
              padding: "16px 18px",
              borderBottom: i < rest.length - 1 ? "1px solid #fff5d3" : "none",
              background: i % 2 === 0 ? "#fffefb" : "#fef8ea"
            }}>
            <div style={{ width: 26, textAlign: "center", fontWeight: 600, fontSize: 18, color: "#b4a778" }}>{i + 4}</div>
            <img src={getAvatar(user)} alt="" style={{
              width: 38, height: 38, borderRadius: "50%", margin: "0 14px", objectFit: "cover", border: "2px solid #e1dfcd", background: "#e9eae1"
            }} />
            <div style={{
              fontWeight: 600, color: "#4e3708", flex: 1, fontSize: 15,
              maxWidth: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>{user.name}</div>
            <div style={{
              display: "flex", alignItems: "center", fontSize: 16, fontWeight: 700, color: "#e5be64"
            }}>
              <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" alt="coin" width={19} style={{marginRight:4}} />{user.totalPoints ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* --- Actions (add, claim, seed) --- */}
      <div style={{
        maxWidth: 420, margin: "44px auto 0 auto", background: "#fffbe7",
        borderRadius: 13, padding: "20px 23px 18px 23px", boxShadow: "0 1px 12px #f9e5a947"
      }}>
        <div style={{ fontWeight: 600, fontSize: 17, color: "#a98721", marginBottom: 10 }}>Leaderboard Actions</div>
        <AddUser newUserName={newUserName} setNewUserName={setNewUserName} onAdd={addUser} />
        <div style={{ margin: "20px 0 10px 0" }}>
          <ClaimPoints users={users} selectedUser={selectedUser} setSelectedUser={userId=>setSelectedUser(userId)} onClaim={claimPoints} />
        </div>
        <button onClick={seedUsers} style={{ marginRight: 9, background: "#ffe29e", border: "1px solid #cfb977", color: "#c09e56", padding: "7px 19px", borderRadius: 8, fontWeight: 500, cursor: "pointer" }}>
          Seed Default Users
        </button>
        <span style={{ color: "green", fontWeight: 500, marginLeft: 10 }}>{message}</span>
      </div>

      {/* --- Only show table if user is picked --- */}
      {selectedUser && (
        <div style={{ maxWidth: 470, margin: "30px auto 0 auto" }}>
          <div style={{ fontWeight: 600, fontSize: 17, color: "#a98721", marginBottom: 6 }}>Claim History of {users.find(u=>u._id===selectedUser)?.name}</div>
          <HistoryTable history={history} />
        </div>
      )}
    </div>
  );
}

// Podium Card
function PodiumCard({ rank, user, avatar, style = {} }) {
  const crownSrc = rank === 1
    ? "https://img.icons8.com/color/48/000000/crown.png"
    : rank === 2
    ? "https://img.icons8.com/color/48/000000/crown--v2.png"
    : "https://img.icons8.com/color/48/000000/crown--v1.png";
  return (
    <div style={{
      background: "#faf7e8",
      borderRadius: 18,
      position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
      boxShadow: "0 1.5px 21px #ffe3b865", ...style
    }}>
      {/* Crown on top */}
      <img src={crownSrc} alt="crown" style={{ width: 37, position: "absolute", top: -33, left: "50%", transform: "translateX(-50%)" }} />
      {/* Avatar */}
      <img src={avatar} alt={user?.name} style={{
        width: 64, height: 64, borderRadius: "50%", marginTop: 32, border: "3px solid #ffe47e", objectFit: "cover"
      }} />
      {/* FULL Name (NO masking) --- THIS IS THE KEY LINE */}
      <div style={{
        fontWeight: 700, fontSize: 15, margin: "16px 0 2px 0", textAlign: "center", color: "#594214",
        maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>
        {user?.name}
      </div>
      {/* Total Points */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7, margin: "0 0 10px 0",
        fontWeight: 700, color: "#b68940", fontSize: 17
      }}>
        <img src="https://cdn-icons-png.flaticon.com/512/138/138292.png" alt="coin" width={19} />
        {user?.totalPoints ?? 0}
      </div>
    </div>
  );
}


function AddUser({ newUserName, setNewUserName, onAdd }) {
  return (
    <div style={{marginBottom:12}}>
      <input style={{padding:"7px 13px", marginRight:9, borderRadius: 8, border:"1px solid #e5cb7d", fontSize: 15 }}
        placeholder="Enter new user name"
        value={newUserName}
        onChange={e => setNewUserName(e.target.value)}
      />
      <button onClick={onAdd} style={{
        background: "#b48900", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px",
        fontWeight: 500, cursor: "pointer"
      }}>Add User
      </button>
    </div>
  );
}

function ClaimPoints({ users, selectedUser, setSelectedUser, onClaim }) {
  return (
    <>
      <select style={{padding:"7px 13px", marginRight:9, borderRadius: 8, border:"1px solid #e5cb7d", fontSize:15 }}
        value={selectedUser}
        onChange={e => setSelectedUser(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(u => (
          <option value={u._id} key={u._id}>{u.name}</option>
        ))}
      </select>
      <button onClick={onClaim} style={{
        background: "#7fc973", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px",
        fontWeight: 500, cursor: "pointer"
      }}>Claim Random Points</button>
    </>
  );
}

function HistoryTable({ history }) {
  return (
    <table border={1} cellPadding={6} style={{
      width: "100%",
      background: "#fff5df",
      fontSize: 14,
      borderCollapse: "collapse",
      margin: "7px 0 30px 0"
    }}>
      <thead>
        <tr style={{background: "#fff7e3"}}>
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
