import React, { useState, useEffect } from "react";
import Seat from "../components/Seat";
import "../styles/seatSelection.css";
import { useParams } from "react-router-dom";
const SeatSelection = () => {
  const [seats, setSeats] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [user, setUser] = useState(null);
  const [isAlloted, setIsAlloted] = useState(false);
  const { Hostel } = useParams();
  console.log(Hostel);
  useEffect(() => {
    fetch(`hostelallotment-production.up.railway.app/api/check-session`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      });
    fetch(`hostelallotment-production.up.railway.app/api/check-allocation/${Hostel}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.isAlloted) {
          setIsAlloted(data.isAlloted);
        }
      });
    fetch(`hostelallotment-production.up.railway.app/api/blocks/${Hostel}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setBlocks(data));

    fetch(`hostelallotment-production.up.railway.app/api/floors/${Hostel}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setFloors(data));
  }, []);

  useEffect(() => {
    if (selectedBlock && selectedFloor !== "") {
      fetch(
        `hostelallotment-production.up.railway.app/api/seats/${Hostel}/?block=${selectedBlock}&floor=${selectedFloor}`,
        { credentials: "include" }
      )
        .then((response) => response.json())
        .then((data) => setSeats(data));
    }
  }, [selectedBlock, selectedFloor, Hostel]);

  const handleSeatClick = (index) => {
    const newSeats = seats.map((seat, i) => ({
      ...seat,
      status:
        seat.status === "selected" && i !== index ? "available" : seat.status,
    }));

    if (newSeats[index].status !== "alloted") {
      newSeats[index].status = "selected";
      setSelectedSeat(newSeats[index]);
    }

    setSeats(newSeats);
  };

  const handleFinalizeSelection = () => {
    if (selectedSeat && user) {
      fetch(`hostelallotment-production.up.railway.app/api/seats/${Hostel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSeat.id,
          status: "alloted",
          user: user,
        }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update the seat status in the UI
            alert("Successfully confirmed your seat");

            fetch(`hostelallotment-production.up.railway.app/api/check-allocation/${Hostel}`, {
              credentials: "include",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.isAlloted) {
                  setIsAlloted(true);
                }
              });
          } else {
            alert("Failed to finalize seat selection.");
          }
        });
    } else {
      alert("Please select a seat first.");
    }
  };

  if (blocks.length === 0 || floors.length === 0) return <p>Loading...</p>;

  return (
    <>
      {isAlloted ? (
        <div className="alloted-message">
          <h1>You have already been allotted a room.</h1>
          <p>
            Your room allocation is finalized and you cannot make any more
            selections.
          </p>
        </div>
      ) : (
        <div className="container">
          <h1 className="userName">Student: {user} </h1>
          <h1>Select Your Room </h1>
          <div className="filters">
            <label>
              Block:
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option value="">Select Block</option>
                {blocks.map((block) => (
                  <option key={block} value={block}>
                    {block}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Floor:
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
              >
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {seats.length > 0 && (
            <div className="seating">
              {seats.map((seat, index) => (
                <Seat
                  key={seat.id}
                  roomNumber={seat.room_number}
                  status={seat.status}
                  user={seat.student_alloted}
                  onClick={() => handleSeatClick(index)}
                />
              ))}
            </div>
          )}
          {selectedBlock && selectedFloor && (
            <button onClick={handleFinalizeSelection}>
              Finalize Your Seat Selection
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default SeatSelection;
